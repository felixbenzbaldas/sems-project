import { App } from "../App";
import { DEFAULT_EXPANDED, DETAILS, HAS_DETAILS, PROPERTIES, SEMS_ADDRESS, TEXT } from "../Consts";
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

    public static update(jsonObject) {
        console.log("TextObject update | jsonObject = " + JSON.stringify(jsonObject, null, 4));
        console.log(jsonObject[DETAILS].length);
        console.log(jsonObject[PROPERTIES][TEXT]);
        console.log(jsonObject[SEMS_ADDRESS]);
        let address : string = jsonObject[SEMS_ADDRESS];
        App.objProperties.getPropertiesOfObject(address).updateFromJson(jsonObject);
        //
        let detailsData : DetailsData = DetailsData.map.get(address);
        detailsData.setHasDetailsAfterLoading(jsonObject[HAS_DETAILS]);
        detailsData.setDetails(jsonObject[DETAILS]);
    }
}