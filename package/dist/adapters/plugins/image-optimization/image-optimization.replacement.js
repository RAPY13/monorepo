//#override imports
import { 
// @ts-ignore
fetchExternalImage, 
// @ts-ignore
fetchInternalImage, imageOptimizer, } from "next/dist/server/image-optimizer";
import { debug } from "../../logger.js";
//#override optimizeImage
export async function optimizeImage(headers, imageParams, nextConfig, handleRequest) {
    const { isAbsolute, href } = imageParams;
    const imageUpstream = isAbsolute
        ? await fetchExternalImage(href)
        : await fetchInternalImage(href, 
        // @ts-ignore
        { headers }, {}, // res object is not necessary as it's not actually used.
        handleRequest);
    // @ts-ignore
    const result = await imageOptimizer(imageUpstream, imageParams, nextConfig, false);
    debug("optimized result", result);
    return result;
}
//#endOverride
