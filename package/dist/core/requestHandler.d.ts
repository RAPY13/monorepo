import { StreamCreator } from "../http/index.js";
import { InternalEvent, InternalResult } from "../types/open-next";
export declare function openNextHandler(internalEvent: InternalEvent, responseStreaming?: StreamCreator): Promise<InternalResult>;
