export function debug(...args) {
    if (globalThis.openNextDebug) {
        console.log(...args);
    }
}
export function warn(...args) {
    console.warn(...args);
}
const DOWNPLAYED_ERROR_LOGS = [
    {
        clientName: "S3Client",
        commandName: "GetObjectCommand",
        errorName: "NoSuchKey",
    },
];
const isDownplayedErrorLog = (errorLog) => DOWNPLAYED_ERROR_LOGS.some((downplayedInput) => downplayedInput.clientName === errorLog?.clientName &&
    downplayedInput.commandName === errorLog?.commandName &&
    (downplayedInput.errorName === errorLog?.error?.name ||
        downplayedInput.errorName === errorLog?.error?.Code));
export function error(...args) {
    // we try to catch errors from the aws-sdk client and downplay some of them
    if (args.some((arg) => isDownplayedErrorLog(arg))) {
        debug(...args);
    }
    else if (args.some((arg) => arg.__openNextInternal)) {
        // In case of an internal error, we log it with the appropriate log level
        const error = args.find((arg) => arg.__openNextInternal);
        if (error.logLevel === 0) {
            debug(...args);
            return;
        }
        else if (error.logLevel === 1) {
            warn(...args);
            return;
        }
        else {
            console.error(...args);
            return;
        }
    }
    else {
        console.error(...args);
    }
}
export const awsLogger = {
    trace: () => { },
    debug: () => { },
    info: debug,
    warn,
    error,
};
