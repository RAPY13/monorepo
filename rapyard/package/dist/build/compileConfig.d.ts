import { OpenNextConfig } from "../types/open-next.js";
export declare function compileOpenNextConfigNode(tempDir: string, openNextConfigPath?: string, nodeExternals?: string): string;
export declare function compileOpenNextConfigEdge(tempDir: string, config: OpenNextConfig, openNextConfigPath?: string): void;
