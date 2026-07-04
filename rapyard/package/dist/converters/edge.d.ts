import { Converter, InternalEvent, InternalResult } from "../types/open-next";
import { MiddlewareOutputEvent } from "../core/routingHandler";
declare const converter: Converter<InternalEvent, InternalResult | ({
    type: "middleware";
} & MiddlewareOutputEvent)>;
export default converter;
