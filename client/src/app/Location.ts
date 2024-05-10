import {Object} from "./Object";
import {Http} from "./Http";
import {HttpRequest, Method} from "./HttpRequest";
import {ObjectImpl} from "./ObjectImpl";
import {Address} from "./Address";

export class Location {

    private httpAddress : string;

    constructor(private http: Http) {
    }

    createObject(houseName : string): Promise<Object> {
        let httpRequest = new HttpRequest();
        httpRequest.url = this.httpAddress + '/objects';
        httpRequest.queryParams = new Map<string, string>([
            ['house', houseName]
        ]);
        httpRequest.method = Method.POST;
        return this.http.request(httpRequest).then(json => {
           return ObjectImpl.create(Address.parse(json.id));
        });
    }

    getObject(houseName : string, name : string) : Promise<Object> {
        return undefined;
    }

    setHttpAddress(httpAddress: string) {
        this.httpAddress = httpAddress;
    }
}