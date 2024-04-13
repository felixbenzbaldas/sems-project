import { WebAdapter } from "./WebAdapter";
import { SemsObject } from "./SemsObject";

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


});