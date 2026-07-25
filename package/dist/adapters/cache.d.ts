/// <reference types="node" />
import { IncrementalCache } from "../cache/incremental/types.js";
import { TagCache } from "../cache/tag/types.js";
interface CachedFetchValue {
    kind: "FETCH";
    data: {
        headers: {
            [k: string]: string;
        };
        body: string;
        url: string;
        status?: number;
        tags?: string[];
    };
    revalidate: number;
}
interface CachedRedirectValue {
    kind: "REDIRECT";
    props: Object;
}
interface CachedRouteValue {
    kind: "ROUTE" | "APP_ROUTE";
    body: Buffer;
    status: number;
    headers: Record<string, undefined | string | string[]>;
}
interface CachedImageValue {
    kind: "IMAGE";
    etag: string;
    buffer: Buffer;
    extension: string;
    isMiss?: boolean;
    isStale?: boolean;
}
interface IncrementalCachedPageValue {
    kind: "PAGE" | "PAGES";
    html: string;
    pageData: Object;
    status?: number;
    headers?: Record<string, undefined | string>;
}
interface IncrementalCachedAppPageValue {
    kind: "APP_PAGE";
    html: string;
    rscData: Buffer;
    headers?: Record<string, undefined | string | string[]>;
    postponed?: string;
    status?: number;
}
type IncrementalCacheValue = CachedRedirectValue | IncrementalCachedPageValue | IncrementalCachedAppPageValue | CachedImageValue | CachedFetchValue | CachedRouteValue;
type IncrementalCacheContext = {
    revalidate?: number | false | undefined;
    fetchCache?: boolean | undefined;
    fetchUrl?: string | undefined;
    fetchIdx?: number | undefined;
    tags?: string[] | undefined;
};
interface CacheHandlerContext {
    fs?: never;
    dev?: boolean;
    flushToDisk?: boolean;
    serverDistDir?: string;
    maxMemoryCacheSize?: number;
    _appDir: boolean;
    _requestHeaders: never;
    fetchCacheKeyPrefix?: string;
}
interface CacheHandlerValue {
    lastModified?: number;
    age?: number;
    cacheState?: string;
    value: IncrementalCacheValue | null;
}
export declare function hasCacheExtension(key: string): boolean;
declare global {
    var incrementalCache: IncrementalCache;
    var tagCache: TagCache;
    var disableDynamoDBCache: boolean;
    var disableIncrementalCache: boolean;
    var lastModified: Record<string, number>;
    var isNextAfter15: boolean;
}
export default class S3Cache {
    constructor(_ctx: CacheHandlerContext);
    get(key: string, options?: boolean | {
        fetchCache?: boolean;
        kindHint?: "app" | "pages" | "fetch";
        tags?: string[];
        softTags?: string[];
    }): Promise<CacheHandlerValue | null>;
    getFetchCache(key: string, softTags?: string[], tags?: string[]): Promise<CacheHandlerValue | null>;
    getIncrementalCache(key: string): Promise<CacheHandlerValue | null>;
    set(key: string, data?: IncrementalCacheValue, ctx?: IncrementalCacheContext): Promise<void>;
    revalidateTag(tags: string | string[]): Promise<void>;
}
export {};
