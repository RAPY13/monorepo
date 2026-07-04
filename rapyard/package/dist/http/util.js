export const parseHeaders = (headers) => {
    const result = {};
    if (!headers) {
        return result;
    }
    for (const [key, value] of Object.entries(headers)) {
        if (value === undefined) {
            continue;
        }
        else {
            result[key] = convertHeader(value);
        }
    }
    return result;
};
export const convertHeader = (header) => {
    if (typeof header === "string") {
        return header;
    }
    else if (Array.isArray(header)) {
        return header.join(",");
    }
    else {
        return String(header);
    }
};
export function parseCookies(cookies) {
    if (!cookies)
        return;
    if (typeof cookies === "string") {
        return cookies.split(/(?<!Expires=\w+),/i).map((c) => c.trim());
    }
    return cookies;
}
