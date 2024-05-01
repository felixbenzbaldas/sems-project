import {SemsHouse} from "./SemsHouse";
import {SemsObjectImpl} from "./SemsObjectImpl";
import {WebAdapter} from "./WebAdapter";
import {SemsLocation} from "./SemsLocation";
import {lastValueFrom, of} from "rxjs";
import {SemsAddress} from "./SemsAddress";
import {SemsObject} from "./SemsObject";

describe('app', () => {

  it('can create SemsObject from json', () => {
    let addressString = "1-cmcCvfEhP2";
    let detailAddressString = "1-frfjr456";
    let jsonSemsObject = {
      "id":addressString,
      "details":[detailAddressString],
      "properties":
        {
          "text":"Beispiel",
          "context":null,
          "isPrivate":false,
          "defaultExpanded":true
        }
    };
    let webAdapter : WebAdapter = new WebAdapter();

    let semsObject : SemsObject = webAdapter.createSemsObjectFromJson(jsonSemsObject);

    expect(semsObject).toBeTruthy();
  });

  it('can add detail', async () => {
    let semsObject : SemsObject = new SemsObjectImpl();
    let addressOfDetail = new SemsAddress();

    await semsObject.addDetail(addressOfDetail);

    expect(semsObject.getDetails()[0]).toBe(addressOfDetail);
  });

  it('can create remote SemsObject', async () => {
    let createdSemsObject : SemsObject = new SemsObjectImpl();
    let semsLocationMock = {} as SemsLocation;
    semsLocationMock.createSemsObject = jest.fn().mockImplementation(
        (semsHouse : SemsHouse) => {
          return lastValueFrom(of(createdSemsObject));
    });
    let semsHouse = new SemsHouse(semsLocationMock);

    let semsObject = await semsHouse.createSemsObject();

    expect(semsObject).toBeTruthy();
    expect(semsLocationMock.createSemsObject).toHaveBeenCalledWith(semsHouse);
  });

  it('can observe SemsObject', done  => {
    let semsObject : SemsObject = new SemsObjectImpl();
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

});