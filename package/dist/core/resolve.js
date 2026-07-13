export async function resolveConverter(converter) {
    if (typeof converter === "function") {
        return converter();
    }
    else {
        const m_1 = await import(`../converters/aws-apigw-v2.js`);
        // @ts-expect-error
        return m_1.default;
    }
}
export async function resolveWrapper(wrapper) {
    if (typeof wrapper === "function") {
        return wrapper();
    }
    else {
        // This will be replaced by the bundler
        const m_1 = await import("../wrappers/aws-lambda.js");
        // @ts-expect-error
        return m_1.default;
    }
}
/**
 *
 * @param tagCache
 * @returns
 * @__PURE__
 */
export async function resolveTagCache(tagCache) {
    if (typeof tagCache === "function") {
        return tagCache();
    }
    else {
        // This will be replaced by the bundler
        const m_1 = await import("../cache/tag/dynamodb.js");
        return m_1.default;
    }
}
/**
 *
 * @param queue
 * @returns
 * @__PURE__
 */
export async function resolveQueue(queue) {
    if (typeof queue === "function") {
        return queue();
    }
    else {
        const m_1 = await import("../queue/sqs.js");
        return m_1.default;
    }
}
/**
 *
 * @param incrementalCache
 * @returns
 * @__PURE__
 */
export async function resolveIncrementalCache(incrementalCache) {
    if (typeof incrementalCache === "function") {
        return incrementalCache();
    }
    else {
        const m_1 = await import("../cache/incremental/s3.js");
        return m_1.default;
    }
}
/**
 * @param imageLoader
 * @returns
 * @__PURE__
 */
export async function resolveImageLoader(imageLoader) {
    if (typeof imageLoader === "function") {
        return imageLoader();
    }
    else {
        const m_1 = await import("../overrides/imageLoader/s3.js");
        return m_1.default;
    }
}
