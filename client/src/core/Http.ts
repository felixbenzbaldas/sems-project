import {HttpRequest} from "./HttpRequest";

export interface Http {
    request(httpRequest : HttpRequest): Promise<any>;
}