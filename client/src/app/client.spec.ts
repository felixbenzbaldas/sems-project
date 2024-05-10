import {HttpRequest, Method} from "./HttpRequest";
import {Http} from "./Http";
import {Location} from "./Location";
import {House} from "./House";
import {Object} from "./Object";
import {Address} from "./Address";
import {lastValueFrom, of} from "rxjs";

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
});