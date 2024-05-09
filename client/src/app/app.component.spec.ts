import {House} from "./House";
import {ObjectImpl} from "./ObjectImpl";
import {WebAdapter} from "./WebAdapter";
import {Location} from "./Location";
import {lastValueFrom, of} from "rxjs";
import {Address} from "./Address";
import {Object} from "./Object";
import {ObjectType} from "./ObjectType";
import {ObjectProvider} from "./ObjectProvider";

describe('app', () => {

    it('can create Object from json', () => {
        let jsonObject = {
            "id": "1-abc",
            "details": ["1-345"],
            "text": "Beispiel",
            "context": null,
            "isPrivate": false,
            "defaultExpanded": true
        };
        let webAdapter: WebAdapter = new WebAdapter();

        let object: Object = webAdapter.createObjectFromJson(jsonObject);

        expect(object.getAddress()).toEqual(Address.parse("1-abc"));
        expect(object.getType()).toBe(ObjectType.TEXT_WITH_DETAILS);

        expect(object.getText().getValue()).toEqual("Beispiel");
    });

    // TODO Details-Klasse einführen (analog Text)
    it('can add detail', async () => {
        let object: Object = new ObjectImpl();
        let addressOfDetail = new Address();

        await object.addDetail(addressOfDetail);

        expect(object.getDetails()[0]).toBe(addressOfDetail);
    });

    it('can create remote Object', async () => {
        let createdObject: Object = ObjectImpl.create(Address.parse("1-abc"));
        let locationMock = {} as Location;
        locationMock.createObject = jest.fn().mockImplementation(
            (house: House) => {
                return lastValueFrom(of(createdObject));
            });
        let house = new House(locationMock);

        let object = await house.createObject();

        expect(object).toBeTruthy();
        expect(locationMock.createObject).toHaveBeenCalledWith(house);
    });

    it('can observe Object', done => {
        let object: Object = new ObjectImpl();
        object.subscribe({
            next: value => {
                try {
                    expect(value).toEqual("addedDetail");
                    done();
                } catch (error) {
                    done(error);
                }
            }
        });
        object.addDetail(new Address());
    });

    it('can parse Address', () => {
        let addressString = "1-abc";

        let address = Address.parse(addressString);

        expect(address.getHouse()).toEqual("1");
        expect(address.getName()).toEqual("abc");
    });

    it('can get object by address from ObjectProvider', async () => {
        let address = Address.parse("1-abc");
        let houseMock = {} as House;
        houseMock.getObjectByName = jest.fn().mockImplementation(name => {
            return lastValueFrom(of(new ObjectImpl()));
        });
        let housesMap = new Map<string, House>([
            ["1", houseMock]
        ]);
        let objectProvider = new ObjectProvider(housesMap);

        let object = await objectProvider.get(address);

        expect(object).toBeTruthy();
        expect(houseMock.getObjectByName).toHaveBeenCalledWith("abc");
    });

    it('can get unloaded object by name from House', async () => {
        let object: Object = new ObjectImpl();
        let locationMock = {} as Location;
        locationMock.getObject = jest.fn().mockImplementation(
            (house: House, name : string) => {
                return lastValueFrom(of(object));
            });
        let house = new House(locationMock);

        let received = await house.getObjectByName("abc");

        expect(received).toEqual(object);
        expect(locationMock.getObject).toHaveBeenCalledWith(house, "abc");
    });

    it('should store remote object after creation', async () => {
        let objectStub: Object = {} as Object;
        objectStub.getAddress = jest.fn().mockImplementation(() => Address.parse("1-abc"));
        let locationMock = {} as Location;
        locationMock.createObject = jest.fn().mockImplementation(
            (house: House) => {
                return lastValueFrom(of(objectStub));
            });
        locationMock.getObject = jest.fn().mockImplementation();
        let house = new House(locationMock);
        await house.createObject();

        let received = await house.getObjectByName("abc");

        expect(received).toEqual(objectStub);
        expect(locationMock.getObject).not.toHaveBeenCalled();
    });

    it('should store remote object after loading', async () => {
        let objectStub: Object = {} as Object;
        objectStub.getAddress = jest.fn().mockImplementation(() => Address.parse("1-abc"));
        let locationMock = {} as Location;
        locationMock.getObject = jest.fn().mockImplementation(
            (house : House, name : string) => {
                return lastValueFrom(of(objectStub));
            }
        );
        let house = new House(locationMock);
        await house.getObjectByName("abc"); // loading

        let received = await house.getObjectByName("abc");

        expect(received).toEqual(objectStub);
        expect(locationMock.getObject).toHaveBeenCalledTimes(1);
    });


    // it('can change text of remote object', async () => {
    //     expect(locationMock.setPropertyOfObject).toHaveBeenCalledWith("1", "abc", 1, "text", "changed");
    // });

});