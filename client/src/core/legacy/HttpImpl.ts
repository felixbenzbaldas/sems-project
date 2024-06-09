import type {Http} from "@/core/legacy/Http";
import type {HttpRequest} from "@/core/legacy/HttpRequest";

export class HttpImpl implements Http {
    request(httpRequest: HttpRequest): Promise<any> {
        return null;
    }

}
