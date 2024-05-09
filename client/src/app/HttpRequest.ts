
export enum Method {
    POST,
    GET
}
export class HttpRequest {
    url: string;
    queryParams: Map<string, string>;
    method: Method;
}