import type { InternalEvent, InternalResult, WrapperHandler } from "../types/open-next";
import { MiddlewareOutputEvent } from "../core/routingHandler";
declare const _default: {
    wrapper: WrapperHandler<InternalEvent, InternalResult | ({
        type: "middleware";
    } & MiddlewareOutputEvent)>;
    name: string;
    supportStreaming: boolean;
};
export default _default;
