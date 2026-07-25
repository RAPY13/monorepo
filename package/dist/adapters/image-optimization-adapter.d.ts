import { StreamCreator } from "../http/openNextResponse.js";
import { InternalEvent, InternalResult } from "../types/open-next.js";
export declare const handler: (...args: any[]) => any;
export declare function defaultHandler(event: InternalEvent, streamCreator?: StreamCreator): Promise<InternalResult>;
