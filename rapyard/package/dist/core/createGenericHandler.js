import { debug } from "../adapters/logger";
import { resolveConverter, resolveWrapper } from "./resolve";
export async function createGenericHandler(handler) {
    //First we load the config
    // @ts-expect-error
    const config = await import("./open-next.config.mjs").then((m) => m.default);
    globalThis.openNextConfig = config;
    const override = config[handler.type]
        ?.override;
    // From the config, we create the adapter
    const adapter = await resolveConverter(override?.converter);
    // Then we create the handler
    const wrapper = await resolveWrapper(override?.wrapper);
    debug("Using wrapper", wrapper.name);
    return wrapper.wrapper(handler.handler, adapter);
}
