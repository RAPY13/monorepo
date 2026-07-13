import { Plugin } from "esbuild";
import type { DefaultOverrideOptions, ImageLoader, IncludedImageLoader, LazyLoadedOverride, OverrideOptions } from "../types/open-next";
export interface IPluginSettings {
    overrides?: {
        wrapper?: DefaultOverrideOptions<any, any>["wrapper"];
        converter?: DefaultOverrideOptions<any, any>["converter"];
        tagCache?: OverrideOptions["tagCache"];
        queue?: OverrideOptions["queue"];
        incrementalCache?: OverrideOptions["incrementalCache"];
        imageLoader?: LazyLoadedOverride<ImageLoader> | IncludedImageLoader;
    };
    fnName?: string;
}
/**
 * @param opts.overrides - The name of the overrides to use
 * @returns
 */
export declare function openNextResolvePlugin({ overrides, fnName, }: IPluginSettings): Plugin;
