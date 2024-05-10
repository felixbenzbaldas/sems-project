import {Object} from "./Object";
import {Http} from "./Http";
import {HttpRequest, Method} from "./HttpRequest";
import {lastValueFrom, of} from "rxjs";
import {Address} from "./Address";
import {ObjectImpl} from "./ObjectImpl";

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
        this.http.request(httpRequest);
        return lastValueFrom(of(ObjectImpl.create(Address.parse('1-abc'))));
    }

    getObject(houseName : string, name : string) : Promise<Object> {
        return undefined;
    }

    setHttpAddress(httpAddress: string) {
        this.httpAddress = httpAddress;
    }
}