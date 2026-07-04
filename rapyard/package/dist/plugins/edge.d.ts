import { Plugin } from "esbuild";
import { MiddlewareInfo } from "../types/next-types.js";
export interface IPluginSettings {
    nextDir: string;
    edgeFunctionHandlerPath?: string;
    middlewareInfo: MiddlewareInfo;
    isInCloudfare?: boolean;
}
/**
 * @param opts.nextDir - The path to the .next directory
 * @param opts.edgeFunctionHandlerPath - The path to the edgeFunctionHandler.js file that we'll use to bundle the routing
 * @param opts.entryFiles - The entry files that we'll inject into the edgeFunctionHandler.js file
 * @returns
 */
export declare function openNextEdgePlugins({ nextDir, edgeFunctionHandlerPath, middlewareInfo, isInCloudfare, }: IPluginSettings): Plugin;
