export enum NodeJSErrorCode {
    ENOENT = 'ENOENT'
}

export interface NodeJSError extends Error {
    code: string;
}

export function isNodeJsError(error: unknown): error is NodeJSError {
    return (error as NodeJSError).code !== undefined;
}