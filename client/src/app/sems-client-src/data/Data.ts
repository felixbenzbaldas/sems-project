import { App } from "../App";
import { SemsServer } from "../SemsServer";
import { DetailsData } from "./DetailsData";
import { RemotePropertiesOfSemsObject } from "./RemotePropertiesOfSemsObject";

export class Data {
    public static clear(semsAddress : string, callback : Function) {
        let props : RemotePropertiesOfSemsObject = App.objProperties.getPropertiesOfObject(semsAddress);
        props.clear();
        DetailsData.map.get(semsAddress).clear();
        SemsServer.clear(semsAddress, callback);
    }
}