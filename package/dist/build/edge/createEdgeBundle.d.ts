import { MiddlewareInfo } from "../../types/next-types";
import { IncludedConverter, OverrideOptions, SplittedFunctionOptions } from "../../types/open-next";
import { BuildOptions } from "../helper.js";
interface BuildEdgeBundleOptions {
    appBuildOutputPath: string;
    middlewareInfo: MiddlewareInfo;
    entrypoint: string;
    outfile: string;
    options: BuildOptions;
    overrides?: OverrideOptions;
    defaultConverter?: IncludedConverter;
    additionalInject?: string;
    includeCache?: boolean;
}
export declare function buildEdgeBundle({ appBuildOutputPath, middlewareInfo, entrypoint, outfile, options, defaultConverter, overrides, additionalInject, includeCache, }: BuildEdgeBundleOptions): Promise<void>;
export declare function copyMiddlewareAssetsAndWasm({}: {}): void;
export declare function generateEdgeBundle(name: string, options: BuildOptions, fnOptions: SplittedFunctionOptions): Promise<void>;
export {};
