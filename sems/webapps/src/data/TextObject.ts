import { App } from "../App";
import { DEFAULT_EXPANDED, DETAILS, HAS_DETAILS, SEMS_ADDRESS } from "../Consts";
import { DetailsData } from "./DetailsData";

export class TextObject {
    
    public static createTextObjectFromJson(jsonObject) {
        let address : string = jsonObject[SEMS_ADDRESS];
        App.objProperties.createFromJson(jsonObject);
        //
        let details : Array<string> = null;
        if (App.objProperties.get(address, DEFAULT_EXPANDED)) {
            details = jsonObject[DETAILS];
        }
        //
        let detailsData = new DetailsData(address, jsonObject[HAS_DETAILS],
            details);
        DetailsData.map.set(address, detailsData);
    }
}