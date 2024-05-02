import {SemsObjectImpl} from "./SemsObjectImpl";
import {SemsObject} from "./SemsObject";
import {SemsText} from "./SemsText";
import {SemsAddress} from "./SemsAddress";

export class WebAdapter {
    createSemsObjectFromJson(json): SemsObject {
        let semsObject = SemsObjectImpl.create(SemsAddress.parse(json.id));
        semsObject.setText(new SemsText(json.text))
        return semsObject;
    }

}