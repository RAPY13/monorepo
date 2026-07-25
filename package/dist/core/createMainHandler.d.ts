/// <reference types="node" />
import type { AsyncLocalStorage } from "node:async_hooks";
import { DetachedPromiseRunner } from "../utils/promise";
import type { IncrementalCache } from "../cache/incremental/types";
import type { Queue } from "../queue/types";
declare global {
    var queue: Queue;
    var incrementalCache: IncrementalCache;
    var fnName: string | undefined;
    var serverId: string;
    var __als: AsyncLocalStorage<{
        requestId: string;
        pendingPromiseRunner: DetachedPromiseRunner;
        isISRRevalidation?: boolean;
    }>;
}
export declare function createMainHandler(): Promise<(...args: any[]) => any>;
