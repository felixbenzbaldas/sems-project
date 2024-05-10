import {HttpRequest, Method} from "./HttpRequest";
import {Http} from "./Http";
import {Location} from "./Location";
import {House} from "./House";
import {Object} from "./Object";
import {lastValueFrom, of} from "rxjs";
import {ObjectProvider} from "./ObjectProvider";
import {HouseProviderImpl} from "./HouseProvider";
import {AddressUtil} from "./AddressUtil";

const baseUrl = 'https://my-server.io';
describe('client', () => {

    it('can create object', async () => {
        let capturedHttpRequest: HttpRequest;
        let http = {} as Http;
        http.request = jest.fn().mockImplementation((httpRequest: HttpRequest) => {
            capturedHttpRequest = httpRequest;
            return lastValueFrom(of({objectName: 'a'}));
        });
        let location = new Location(baseUrl);
        let house = new House(http, AddressUtil.parse('1'), location);

        let object: Object = await house.createObject();

        expect(http.request).toHaveBeenCalled();
        expect(capturedHttpRequest.url).toEqual(baseUrl + '/objects');
        expect(capturedHttpRequest.method).toEqual(Method.POST);
        expect(capturedHttpRequest.queryParams.keys()).toContain('house');
        expect(capturedHttpRequest.queryParams.get('house')).toEqual('1');
        expect(object.getAddress()).toEqual(AddressUtil.parse('1-a'));
    });

    it('can get object by address', async () => {
        let capturedHttpRequest: HttpRequest;
        let http = {} as Http;
        http.request = jest.fn().mockImplementation((httpRequest: HttpRequest) => {
            capturedHttpRequest = httpRequest;
            return lastValueFrom(of({}));
        });
        let location: Location = new Location(baseUrl);
        let house = new House(http, AddressUtil.parse('1'), location);
        let houseProvider = new HouseProviderImpl();
        houseProvider.take(house);
        let objectProvider = new ObjectProvider(houseProvider);

        let object: Object = await objectProvider.get(AddressUtil.parse('1-a'));

        expect(object.getAddress()).toEqual(AddressUtil.parse('1-a'));
        expect(http.request).toHaveBeenCalled();
        expect(capturedHttpRequest.url).toEqual(baseUrl + '/objects/1-a');
        expect(capturedHttpRequest.method).toEqual(Method.GET);
    });

    it('can set text', async () => {
        let http = {} as Http;
        http.request = jest.fn().mockImplementation((httpRequest: HttpRequest) => {
            return lastValueFrom(of({objectName: 'a'}));
        });
        let location = new Location(baseUrl);
        let house = new House(http, AddressUtil.parse('1'), location);
        let object: Object = await house.createObject();
        let capturedHttpRequest: HttpRequest;
        http.request = jest.fn().mockImplementation((httpRequest: HttpRequest) => {
            capturedHttpRequest = httpRequest;
            return new Promise<void>(resolve => {
                resolve();
            });
        });

        await object.getText().setValue('foo');

        expect(http.request).toHaveBeenCalled();
        expect(capturedHttpRequest.url).toEqual(baseUrl + '/objects/1-a/text');
        expect(capturedHttpRequest.method).toEqual(Method.PUT);
        expect(capturedHttpRequest.body).toEqual('foo');
        expect(object.getText().getValue()).toEqual('foo');
    });
});