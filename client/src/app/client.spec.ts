import {HttpRequest, Method} from "./HttpRequest";
import {Http} from "./Http";
import {Location} from "./Location";
import {House} from "./House";
import {Object} from "./Object";
import {Address} from "./Address";
import {lastValueFrom, of} from "rxjs";
import {ObjectProvider} from "./ObjectProvider";

describe('client', () => {
    it('can request creation of object', () => {
        let capturedHttpRequest: HttpRequest;
        let http = {} as Http;
        http.request = jest.fn().mockImplementation((httpRequest: HttpRequest) => {
            capturedHttpRequest = httpRequest;
            return lastValueFrom(of({id: '1-abc'}));
        });
        let location = new Location(http);
        location.setHttpAddress('http://localhost:8080');
        let house = new House('1', location);

        house.createObject();

        expect(http.request).toHaveBeenCalled();
        expect(capturedHttpRequest.url).toEqual('http://localhost:8080/objects');
        expect(capturedHttpRequest.method).toEqual(Method.POST);
        expect(capturedHttpRequest.queryParams.keys()).toContain('house');
        expect(capturedHttpRequest.queryParams.get('house')).toEqual('1');
    });

    it('can create object', async () => {
        let http = {} as Http;
        http.request = jest.fn().mockImplementation((httpRequest: HttpRequest) => {
            return lastValueFrom(of({id: '2-def'}));
        });
        let location = new Location(http);
        location.setHttpAddress('http://localhost:8080');
        let house = new House('2', location);

        let object: Object = await house.createObject();

        expect(object.getAddress()).toEqual((Address.parse('2-def')));
    });

    it('can get object from address', async () => {
        let capturedHttpRequest: HttpRequest;
        let http = {} as Http;
        http.request = jest.fn().mockImplementation((httpRequest: HttpRequest) => {
            capturedHttpRequest = httpRequest;
            return lastValueFrom(of({id: '3-ghi'}));
        });
        let location : Location = new Location(http);
        location.setHttpAddress('http://localhost:8080');
        let house = new House('3', location);
        let houseProvider = new Map<string, House>([
            ['3', house]
        ]);
        let objectProvider = new ObjectProvider(houseProvider);

        let object : Object = await objectProvider.get(Address.parse('3-ghi'));

        expect(object.getAddress()).toEqual((Address.parse('3-ghi')));
        expect(http.request).toHaveBeenCalled();
        expect(capturedHttpRequest.url).toEqual('http://localhost:8080/objects');
        expect(capturedHttpRequest.method).toEqual(Method.GET);
        expect(capturedHttpRequest.queryParams.keys()).toContain('address');
        expect(capturedHttpRequest.queryParams.get('address')).toEqual('3-ghi');
    });
});