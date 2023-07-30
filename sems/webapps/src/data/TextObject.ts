import { App } from "../App";
import { DEFAULT_EXPANDED, DETAILS, HAS_DETAILS, PROPERTIES, SEMS_ADDRESS, TEXT } from "../Consts";
import { DetailsData } from "./DetailsData";

export class TextObject {
    
    public static createTextObjectFromJson(jsonObject) {
        App.objProperties.createFromJson(jsonObject);
        DetailsData.createFromJson(jsonObject);
    }

    // not used at the moment
    public static update(jsonObject) {
        let address : string = jsonObject[SEMS_ADDRESS];
        App.objProperties.getPropertiesOfObject(address).updateFromJson(jsonObject);
        //
        let detailsData : DetailsData = DetailsData.map.get(address);
        detailsData.setHasDetailsAfterLoading(jsonObject[HAS_DETAILS]);
        detailsData.setDetails(jsonObject[DETAILS]);
    }
}