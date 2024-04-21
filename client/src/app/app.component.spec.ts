import { SemsObject } from "./SemsObject";
import { WebAdapter } from "./WebAdapter";

describe('app', () => {

  it('test create SemsObject from json', () => {
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

  it('test add detail', async () => {
    let semsObject = new SemsObject();
    let response = await semsObject.addDetail(new SemsObject());
    expect(response).toBe("1-fj46jrfirt");
  });

});