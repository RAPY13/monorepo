export type PublicFiles = {
    files: string[];
};
export declare function build(openNextConfigPath?: string, nodeExternals?: string): Promise<void>;
/***************************/
/***************************/
export declare function compileCache(format?: "cjs" | "esm"): string;
