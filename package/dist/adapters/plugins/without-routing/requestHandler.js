//#override withRouting
const preprocessResult = {
    internalEvent: internalEvent,
    isExternalRewrite: false,
    origin: false,
    isISR: false,
};
//#endOverride
// We need to export something otherwise when compiled in js it creates an empty export {} inside the override
export default {};
