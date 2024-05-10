import {HttpRequest, Method} from "./HttpRequest";
import {Http} from "./Http";
import {Location} from "./Location";
import {House} from "./House";

describe('client', () => {
    it('can request creation of object', () => {
        let capturedHttpRequest : HttpRequest;
        let http = {} as Http;
        http.request = jest.fn().mockImplementation((httpRequest : HttpRequest) => {
            capturedHttpRequest = httpRequest;
            return undefined;
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
});