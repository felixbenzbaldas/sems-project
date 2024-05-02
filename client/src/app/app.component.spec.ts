import {SemsHouse} from "./SemsHouse";
import {SemsObjectImpl} from "./SemsObjectImpl";
import {WebAdapter} from "./WebAdapter";
import {SemsLocation} from "./SemsLocation";
import {lastValueFrom, of} from "rxjs";
import {SemsAddress} from "./SemsAddress";
import {SemsObject} from "./SemsObject";
import {SemsObjectType} from "./SemsObjectType";
import {ObjectProvider} from "./objectProvider";

describe('app', () => {

    it('can create SemsObject from json', () => {
        let jsonSemsObject = {
            "id": "1-abc",
            "details": ["1-345"],
            "text": "Beispiel",
            "context": null,
            "isPrivate": false,
            "defaultExpanded": true
        };
        let webAdapter: WebAdapter = new WebAdapter();

        let semsObject: SemsObject = webAdapter.createSemsObjectFromJson(jsonSemsObject);

        expect(semsObject.getSemsAddress()).toEqual(SemsAddress.parse("1-abc"));
        expect(semsObject.getType()).toBe(SemsObjectType.TEXT_WITH_DETAILS);

        expect(semsObject.getText().getValue()).toEqual("Beispiel");
    });

    // TODO Details-Klasse einführen (analog SemsText)
    it('can add detail', async () => {
        let semsObject: SemsObject = new SemsObjectImpl();
        let addressOfDetail = new SemsAddress();

        await semsObject.addDetail(addressOfDetail);

        expect(semsObject.getDetails()[0]).toBe(addressOfDetail);
    });

    it('can create remote SemsObject', async () => {
        let createdSemsObject: SemsObject = SemsObjectImpl.create(SemsAddress.parse("1-abc"));
        let semsLocationMock = {} as SemsLocation;
        semsLocationMock.createSemsObject = jest.fn().mockImplementation(
            (semsHouse: SemsHouse) => {
                return lastValueFrom(of(createdSemsObject));
            });
        let semsHouse = new SemsHouse(semsLocationMock);

        let semsObject = await semsHouse.createSemsObject();

        expect(semsObject).toBeTruthy();
        expect(semsLocationMock.createSemsObject).toHaveBeenCalledWith(semsHouse);
    });

    it('can observe SemsObject', done => {
        let semsObject: SemsObject = new SemsObjectImpl();
        semsObject.subscribe({
            next: value => {
                try {
                    expect(value).toEqual("addedDetail");
                    done();
                } catch (error) {
                    done(error);
                }
            }
        });
        semsObject.addDetail(new SemsAddress());
    });

    it('can parse SemsAddress', () => {
        let addressString = "1-abc";

        let semsAddress = SemsAddress.parse(addressString);

        expect(semsAddress.getHouse()).toEqual("1");
        expect(semsAddress.getName()).toEqual("abc");
    });

    it('can get object by address from ObjectProvider', async () => {
        let semsAddress = SemsAddress.parse("1-abc");
        let semsHouseMock = {} as SemsHouse;
        semsHouseMock.getObjectByName = jest.fn().mockImplementation(name => {
            return lastValueFrom(of(new SemsObjectImpl()));
        });
        let housesMap = new Map<string, SemsHouse>([
            ["1", semsHouseMock]
        ]);
        let objectProvider = new ObjectProvider(housesMap);

        let semsObject = await objectProvider.get(semsAddress);

        expect(semsObject).toBeTruthy();
        expect(semsHouseMock.getObjectByName).toHaveBeenCalledWith("abc");
    });

    it('can get unloaded object by name from SemsHouse', async () => {
        let semsObject: SemsObject = new SemsObjectImpl();
        let semsLocationMock = {} as SemsLocation;
        semsLocationMock.getSemsObject = jest.fn().mockImplementation(
            (semsHouse: SemsHouse, name : string) => {
                return lastValueFrom(of(semsObject));
            });
        let semsHouse = new SemsHouse(semsLocationMock);

        let received = await semsHouse.getObjectByName("abc");

        expect(received).toEqual(semsObject);
        expect(semsLocationMock.getSemsObject).toHaveBeenCalledWith(semsHouse, "abc");
    });

    it('should store remote object after creation', async () => {
        let semsObjectStub: SemsObject = {} as SemsObject;
        semsObjectStub.getSemsAddress = jest.fn().mockImplementation(() => SemsAddress.parse("1-abc"));
        let semsLocationMock = {} as SemsLocation;
        semsLocationMock.createSemsObject = jest.fn().mockImplementation(
            (semsHouse: SemsHouse) => {
                return lastValueFrom(of(semsObjectStub));
            });
        semsLocationMock.getSemsObject = jest.fn().mockImplementation();
        let semsHouse = new SemsHouse(semsLocationMock);
        await semsHouse.createSemsObject();

        let received = await semsHouse.getObjectByName("abc");

        expect(received).toEqual(semsObjectStub);
        expect(semsLocationMock.getSemsObject).not.toHaveBeenCalled();
    });



});