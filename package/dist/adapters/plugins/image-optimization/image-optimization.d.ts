/// <reference types="node" />
/// <reference types="node" />
import { IncomingMessage, ServerResponse } from "node:http";
import { APIGatewayProxyEventHeaders } from "aws-lambda";
import { NextConfig } from "next/dist/server/config-shared";
import { NextUrlWithParsedQuery } from "next/dist/server/request-meta";
export declare function optimizeImage(headers: APIGatewayProxyEventHeaders, imageParams: any, nextConfig: NextConfig, handleRequest: (newReq: IncomingMessage, newRes: ServerResponse, newParsedUrl: NextUrlWithParsedQuery) => Promise<void>): Promise<{
    buffer: Buffer;
    contentType: string;
    maxAge: number;
}>;
