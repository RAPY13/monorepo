const handler = async (handler, converter) => async (event, env) => {
    //@ts-expect-error - process is not defined in cloudflare workers
    globalThis.process = { env };
    const internalEvent = await converter.convertFrom(event);
    const response = await handler(internalEvent);
    const result = await converter.convertTo(response);
    return result;
};
export default {
    wrapper: handler,
    name: "cloudflare",
    supportStreaming: true,
};
