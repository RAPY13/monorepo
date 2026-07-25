import { BuildOptions as ESBuildOptions } from "esbuild";
import { OpenNextConfig } from "../types/open-next.js";
export type BuildOptions = ReturnType<typeof normalizeOptions>;
export declare function normalizeOptions(config: OpenNextConfig, root: string): {
    openNextVersion: string;
    nextVersion: string;
    appPackageJsonPath: string;
    appPath: string;
    appBuildOutputPath: string;
    appPublicPath: string;
    outputDir: string;
    tempDir: string;
    debug: boolean;
    monorepoRoot: string;
};
export declare function esbuildSync(esbuildOptions: ESBuildOptions, options: BuildOptions): void;
export declare function esbuildAsync(esbuildOptions: ESBuildOptions, options: BuildOptions): Promise<void>;
export declare function removeFiles(root: string, conditionFn: (file: string) => boolean, searchingDir?: string): void;
/**
 * Recursively traverse files in a directory and call `callbackFn` when `conditionFn` returns true
 * @param root - Root directory to search
 * @param conditionFn - Called to determine if `callbackFn` should be called
 * @param callbackFn - Called when `conditionFn` returns true
 * @param searchingDir - Directory to search (used for recursion)
 */
export declare function traverseFiles(root: string, conditionFn: (file: string) => boolean, callbackFn: (filePath: string) => void, searchingDir?: string): void;
export declare function getHtmlPages(dotNextPath: string): Set<string>;
export declare function getBuildId(dotNextPath: string): string;
export declare function getOpenNextVersion(): string;
export declare function getNextVersion(appPath: string): string;
export declare function compareSemver(v1: string, v2: string): number;
export declare function copyOpenNextConfig(tempDir: string, outputPath: string, isEdge?: boolean): void;
export declare function copyEnvFile(appPath: string, packagePath: string, outputPath: string): void;
