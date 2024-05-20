import type {Http} from "@/core/Http";
import type {HttpRequest} from "@/core/HttpRequest";

export class HttpImpl implements Http {
    request(httpRequest: HttpRequest): Promise<any> {
        return null;
    }

}
