import { SemsObjectImpl } from "./SemsObjectImpl";
import {SemsObject} from "./SemsObject";

export class WebAdapter {
  createSemsObjectFromJson(json): SemsObject {
    let semsObject = new SemsObjectImpl();

    return semsObject;
  }

}