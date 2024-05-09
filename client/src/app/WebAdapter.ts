import {ObjectImpl} from "./ObjectImpl";
import {Object} from "./Object";
import {Text} from "./Text";
import {Address} from "./Address";

export class WebAdapter {
    createObjectFromJson(json): Object {
        let object = ObjectImpl.create(Address.parse(json.id));
        object.setText(new Text(json.text))
        return object;
    }

}