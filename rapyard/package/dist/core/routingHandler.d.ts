import { InternalEvent, InternalResult, Origin } from "../types/open-next";
export interface MiddlewareOutputEvent {
    internalEvent: InternalEvent;
    isExternalRewrite: boolean;
    origin: Origin | false;
    isISR: boolean;
}
export default function routingHandler(event: InternalEvent): Promise<InternalResult | MiddlewareOutputEvent>;
