import {Location} from "./Location";
import {Http} from "./Http";
import {HttpRequest, Method} from "./HttpRequest";

describe('Location', () => {
    it('can request object creation', () => {
        let capturedHttpRequest : HttpRequest;
        let http = {} as Http;
        http.request = jest.fn().mockImplementation((httpRequest : HttpRequest) => {
            capturedHttpRequest = httpRequest;
            return undefined;
        });
        let location = new Location(http);
        location.setHttpAddress('http://localhost:8080');

        location.createObject('1');

        expect(http.request).toHaveBeenCalled();
        expect(capturedHttpRequest.url).toEqual('http://localhost:8080/objects');
        expect(capturedHttpRequest.method).toEqual(Method.POST);
        expect(capturedHttpRequest.queryParams.keys()).toContain('house');
        expect(capturedHttpRequest.queryParams.get('house')).toEqual('1');
    });
});