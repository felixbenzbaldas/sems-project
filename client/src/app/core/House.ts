import {Location} from "./Location";
import {Object} from "./Object";
import {lastValueFrom, of} from "rxjs";
import {Http} from "./Http";
import {HttpRequest, Method} from "./HttpRequest";
import {ObjectImpl} from "./ObjectImpl";
import {Address, AddressImpl} from "./Address";
import {AddressUtil} from "./AddressUtil";

export class House {

    private loadedObjects : Map<string, Object> = new Map();

    constructor(private http : Http, private address : Address, private location: Location) {
    }

    createObject(): Promise<Object> {
        let httpRequest = new HttpRequest();
        httpRequest.url = this.location.getHttpAddress() + '/objects';
        httpRequest.queryParams = new Map<string, string>([
            ['house', AddressUtil.createString(this.address)]
        ]);
        httpRequest.method = Method.POST;
        return this.http.request(httpRequest).then(json => {
            let object = new ObjectImpl(this, json.objectName);
            this.loadedObjects.set(object.getName(), object);
            return object;
        });
    }

    getObjectByName(objectName: string): Promise<Object> {
        if (this.loadedObjects.has(objectName)) {
            return lastValueFrom(of(this.loadedObjects.get(objectName)));
        } else {
            let httpRequest = new HttpRequest();
            let address = this.getAddress().append(objectName);
            httpRequest.url = this.location.getHttpAddress() + '/objects/' + AddressUtil.createString(address);
            httpRequest.method = Method.GET;
            return this.http.request(httpRequest).then(json => {
                let object = new ObjectImpl(this, objectName);
                this.loadedObjects.set(objectName, object);
                return object;
            });
        }
    }

    setStringProperty(objectName: string, propertyName: string, value: string) {
        let httpRequest = new HttpRequest();
        let address = this.getAddress().append(objectName);
        httpRequest.url = this.location.getHttpAddress() + '/objects/' + AddressUtil.createString(address) + '/'
            + propertyName;
        httpRequest.method = Method.PUT;
        httpRequest.body = value;
        return this.http.request(httpRequest);
    }

    getAddress() : Address {
        return this.address;
    }
}