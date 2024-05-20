
export enum Method {
    POST,
    GET,
    PUT,
}
export class HttpRequest {
    url: string;
    queryParams: Map<string, string>;
    method: Method;
    body: string;
}