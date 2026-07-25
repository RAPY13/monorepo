import { InternalEvent, InternalResult } from "../../types/open-next.js";
type MiddlewareOutputEvent = InternalEvent & {
    responseHeaders?: Record<string, string | string[]>;
    externalRewrite?: boolean;
};
export declare function handleMiddleware(internalEvent: InternalEvent): Promise<MiddlewareOutputEvent | InternalResult>;
export {};
