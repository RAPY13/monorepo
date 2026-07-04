import { BaseEventOrResult, Converter, DefaultOverrideOptions, ImageLoader, InternalEvent, InternalResult, LazyLoadedOverride, OverrideOptions, Wrapper } from "../types/open-next.js";
import { TagCache } from "../cache/tag/types.js";
export declare function resolveConverter<E extends BaseEventOrResult = InternalEvent, R extends BaseEventOrResult = InternalResult>(converter: DefaultOverrideOptions<E, R>["converter"]): Promise<Converter<E, R>>;
export declare function resolveWrapper<E extends BaseEventOrResult = InternalEvent, R extends BaseEventOrResult = InternalResult>(wrapper: DefaultOverrideOptions<E, R>["wrapper"]): Promise<Wrapper<E, R>>;
/**
 *
 * @param tagCache
 * @returns
 * @__PURE__
 */
export declare function resolveTagCache(tagCache: OverrideOptions["tagCache"]): Promise<TagCache>;
/**
 *
 * @param queue
 * @returns
 * @__PURE__
 */
export declare function resolveQueue(queue: OverrideOptions["queue"]): Promise<import("../queue/types.js").Queue>;
/**
 *
 * @param incrementalCache
 * @returns
 * @__PURE__
 */
export declare function resolveIncrementalCache(incrementalCache: OverrideOptions["incrementalCache"]): Promise<import("../cache/incremental/types.js").IncrementalCache>;
/**
 * @param imageLoader
 * @returns
 * @__PURE__
 */
export declare function resolveImageLoader(imageLoader: LazyLoadedOverride<ImageLoader> | string): Promise<ImageLoader>;
