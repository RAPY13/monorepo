import { isBinaryContentType } from "./binary.js";
import { debug, error, warn } from "./logger.js";
/** Beginning single backslash is intentional, to look for the dot + the extension. Do not escape it again. */
const CACHE_EXTENSION_REGEX = /\.(cache|fetch)$/;
export function hasCacheExtension(key) {
    return CACHE_EXTENSION_REGEX.test(key);
}
// We need to use globalThis client here as this class can be defined at load time in next 12 but client is not available at load time
export default class S3Cache {
    constructor(_ctx) { }
    async get(key, 
    // fetchCache is for next 13.5 and above, kindHint is for next 14 and above and boolean is for earlier versions
    options) {
        if (globalThis.disableIncrementalCache) {
            return null;
        }
        const isFetchCache = typeof options === "object"
            ? options.kindHint
                ? options.kindHint === "fetch"
                : options.fetchCache
            : options;
        const softTags = typeof options === "object" ? options.softTags : [];
        const tags = typeof options === "object" ? options.tags : [];
        return isFetchCache
            ? this.getFetchCache(key, softTags, tags)
            : this.getIncrementalCache(key);
    }
    async getFetchCache(key, softTags, tags) {
        debug("get fetch cache", { key, softTags, tags });
        try {
            const { value, lastModified } = await globalThis.incrementalCache.get(key, true);
            // const { Body, LastModified } = await this.getS3Object(key, "fetch");
            const _lastModified = await globalThis.tagCache.getLastModified(key, lastModified);
            if (_lastModified === -1) {
                // If some tags are stale we need to force revalidation
                return null;
            }
            if (value === undefined)
                return null;
            // For cases where we don't have tags, we need to ensure that the soft tags are not being revalidated
            // We only need to check for the path as it should already contain all the tags
            if ((tags ?? []).length === 0) {
                // Then we need to find the path for the given key
                const path = softTags?.find((tag) => tag.startsWith("_N_T_/") &&
                    !tag.endsWith("layout") &&
                    !tag.endsWith("page"));
                if (path) {
                    const pathLastModified = await globalThis.tagCache.getLastModified(path.replace("_N_T_/", ""), lastModified);
                    if (pathLastModified === -1) {
                        // In case the path has been revalidated, we don't want to use the fetch cache
                        return null;
                    }
                }
            }
            return {
                lastModified: _lastModified,
                value: value,
            };
        }
        catch (e) {
            // We can usually ignore errors here as they are usually due to cache not being found
            debug("Failed to get fetch cache", e);
            return null;
        }
    }
    async getIncrementalCache(key) {
        try {
            const { value: cacheData, lastModified } = await globalThis.incrementalCache.get(key, false);
            // const { Body, LastModified } = await this.getS3Object(key, "cache");
            // const cacheData = JSON.parse(
            //   (await Body?.transformToString()) ?? "{}",
            // ) as S3CachedFile;
            const meta = cacheData?.meta;
            const _lastModified = await globalThis.tagCache.getLastModified(key, lastModified);
            if (_lastModified === -1) {
                // If some tags are stale we need to force revalidation
                return null;
            }
            const requestId = globalThis.__als.getStore()?.requestId ?? "";
            globalThis.lastModified[requestId] = _lastModified;
            if (cacheData?.type === "route") {
                return {
                    lastModified: _lastModified,
                    value: {
                        kind: globalThis.isNextAfter15 ? "APP_ROUTE" : "ROUTE",
                        body: Buffer.from(cacheData.body ?? Buffer.alloc(0), isBinaryContentType(String(meta?.headers?.["content-type"]))
                            ? "base64"
                            : "utf8"),
                        status: meta?.status,
                        headers: meta?.headers,
                    },
                };
            }
            else if (cacheData?.type === "page" || cacheData?.type === "app") {
                if (globalThis.isNextAfter15 && cacheData?.type === "app") {
                    return {
                        lastModified: _lastModified,
                        value: {
                            kind: "APP_PAGE",
                            html: cacheData.html,
                            rscData: Buffer.from(cacheData.rsc),
                            status: meta?.status,
                            headers: meta?.headers,
                        },
                    };
                }
                return {
                    lastModified: _lastModified,
                    value: {
                        kind: globalThis.isNextAfter15 ? "PAGES" : "PAGE",
                        html: cacheData.html,
                        pageData: cacheData.type === "page" ? cacheData.json : cacheData.rsc,
                        status: meta?.status,
                        headers: meta?.headers,
                    },
                };
            }
            else if (cacheData?.type === "redirect") {
                return {
                    lastModified: _lastModified,
                    value: {
                        kind: "REDIRECT",
                        props: cacheData.props,
                    },
                };
            }
            else {
                warn("Unknown cache type", cacheData);
                return null;
            }
        }
        catch (e) {
            // We can usually ignore errors here as they are usually due to cache not being found
            debug("Failed to get body cache", e);
            return null;
        }
    }
    async set(key, data, ctx) {
        if (globalThis.disableIncrementalCache) {
            return;
        }
        // This one might not even be necessary anymore
        // Better be safe than sorry
        const detachedPromise = globalThis.__als
            .getStore()
            ?.pendingPromiseRunner.withResolvers();
        try {
            if (data?.kind === "ROUTE" || data?.kind === "APP_ROUTE") {
                const { body, status, headers } = data;
                await globalThis.incrementalCache.set(key, {
                    type: "route",
                    body: body.toString(isBinaryContentType(String(headers["content-type"]))
                        ? "base64"
                        : "utf8"),
                    meta: {
                        status,
                        headers,
                    },
                }, false);
            }
            else if (data?.kind === "PAGE" || data?.kind === "PAGES") {
                const { html, pageData, status, headers } = data;
                const isAppPath = typeof pageData === "string";
                if (isAppPath) {
                    await globalThis.incrementalCache.set(key, {
                        type: "app",
                        html,
                        rsc: pageData,
                        meta: {
                            status,
                            headers,
                        },
                    }, false);
                }
                else {
                    await globalThis.incrementalCache.set(key, {
                        type: "page",
                        html,
                        json: pageData,
                    }, false);
                }
            }
            else if (data?.kind === "APP_PAGE") {
                const { html, rscData, headers, status } = data;
                await globalThis.incrementalCache.set(key, {
                    type: "app",
                    html,
                    rsc: rscData.toString("utf8"),
                    meta: {
                        status,
                        headers,
                    },
                }, false);
            }
            else if (data?.kind === "FETCH") {
                await globalThis.incrementalCache.set(key, data, true);
            }
            else if (data?.kind === "REDIRECT") {
                await globalThis.incrementalCache.set(key, {
                    type: "redirect",
                    props: data.props,
                }, false);
            }
            else if (data === null || data === undefined) {
                await globalThis.incrementalCache.delete(key);
            }
            // Write derivedTags to dynamodb
            // If we use an in house version of getDerivedTags in build we should use it here instead of next's one
            const derivedTags = data?.kind === "FETCH"
                ? ctx?.tags ?? data?.data?.tags ?? [] // before version 14 next.js used data?.data?.tags so we keep it for backward compatibility
                : data?.kind === "PAGE"
                    ? data.headers?.["x-next-cache-tags"]?.split(",") ?? []
                    : [];
            debug("derivedTags", derivedTags);
            // Get all tags stored in dynamodb for the given key
            // If any of the derived tags are not stored in dynamodb for the given key, write them
            const storedTags = await globalThis.tagCache.getByPath(key);
            const tagsToWrite = derivedTags.filter((tag) => !storedTags.includes(tag));
            if (tagsToWrite.length > 0) {
                await globalThis.tagCache.writeTags(tagsToWrite.map((tag) => ({
                    path: key,
                    tag: tag,
                    // In case the tags are not there we just need to create them
                    // but we don't want them to return from `getLastModified` as they are not stale
                    revalidatedAt: 1,
                })));
            }
            debug("Finished setting cache");
        }
        catch (e) {
            error("Failed to set cache", e);
        }
        finally {
            // We need to resolve the promise even if there was an error
            detachedPromise?.resolve();
        }
    }
    async revalidateTag(tags) {
        if (globalThis.disableDynamoDBCache || globalThis.disableIncrementalCache) {
            return;
        }
        try {
            const _tags = Array.isArray(tags) ? tags : [tags];
            for (const tag of _tags) {
                debug("revalidateTag", tag);
                // Find all keys with the given tag
                const paths = await globalThis.tagCache.getByTag(tag);
                debug("Items", paths);
                const toInsert = paths.map((path) => ({
                    path,
                    tag,
                }));
                // If the tag is a soft tag, we should also revalidate the hard tags
                if (tag.startsWith("_N_T_/")) {
                    for (const path of paths) {
                        // We need to find all hard tags for a given path
                        const _tags = await globalThis.tagCache.getByPath(path);
                        const hardTags = _tags.filter((t) => !t.startsWith("_N_T_/"));
                        // For every hard tag, we need to find all paths and revalidate them
                        for (const hardTag of hardTags) {
                            const _paths = await globalThis.tagCache.getByTag(hardTag);
                            debug({ hardTag, _paths });
                            toInsert.push(..._paths.map((path) => ({
                                path,
                                tag: hardTag,
                            })));
                        }
                    }
                }
                // Update all keys with the given tag with revalidatedAt set to now
                await globalThis.tagCache.writeTags(toInsert);
            }
        }
        catch (e) {
            error("Failed to revalidate tag", e);
        }
    }
}
