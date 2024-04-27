import {SemsHouse} from "./SemsHouse";
import {SemsObject} from "./SemsObject";
import {WebAdapter} from "./WebAdapter";
import {SemsLocation} from "./SemsLocation";
import {lastValueFrom, of} from "rxjs";

describe('app', () => {

  it('can create SemsObject from json', () => {
    let jsonSemsObject = {
      "id":"1-cmcCvfEhP2",
      "details":[],
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
    let semsObject = new SemsObject();
    let detail = new SemsObject();

    await semsObject.addDetail(detail);

    expect(semsObject.getDetails()[0]).toEqual(detail);
  });

  it('can create remote SemsObject', async () => {
    let createdSemsObject = new SemsObject();
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
    let semsObject = new SemsObject();
    semsObject.subscribe({
      next: value => {
        try {
          expect(value).toBe("addedDetail");
          done();
        } catch (error) {
          done(error);
        }
      }
    });
    semsObject.addDetail(new SemsObject());
  });

});