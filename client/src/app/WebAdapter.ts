import {SemsObjectImpl} from "./SemsObjectImpl";
import {SemsObject} from "./SemsObject";
import {SemsText} from "./SemsText";

export class WebAdapter {
    createSemsObjectFromJson(json): SemsObject {
        let semsObject = SemsObjectImpl.create(json.id);
        semsObject.setText(new SemsText(json.text))
        return semsObject;
    }

}