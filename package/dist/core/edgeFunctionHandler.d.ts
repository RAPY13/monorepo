/// <reference types="node" />
import type { OutgoingHttpHeaders } from "http";
interface RequestData {
    geo?: {
        city?: string;
        country?: string;
        region?: string;
        latitude?: string;
        longitude?: string;
    };
    headers: OutgoingHttpHeaders;
    ip?: string;
    method: string;
    nextConfig?: {
        basePath?: string;
        i18n?: any;
        trailingSlash?: boolean;
    };
    page?: {
        name?: string;
        params?: {
            [key: string]: string | string[];
        };
    };
    url: string;
    body?: ReadableStream<Uint8Array>;
    signal: AbortSignal;
}
interface Entries {
    [k: string]: {
        default: (props: {
            page: string;
            request: RequestData;
        }) => Promise<{
            response: Response;
            waitUntil: Promise<void>;
        }>;
    };
}
declare global {
    var _ENTRIES: Entries;
    var _ROUTES: EdgeRoute[];
    var __storage__: Map<unknown, unknown>;
    var AsyncContext: any;
    var AsyncLocalStorage: any;
}
export interface EdgeRoute {
    name: string;
    page: string;
    regex: string[];
}
type EdgeRequest = Omit<RequestData, "page">;
export default function edgeFunctionHandler(request: EdgeRequest): Promise<Response>;
export {};
