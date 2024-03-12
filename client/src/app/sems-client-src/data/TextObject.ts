import { App } from "../App";
import { DEFAULT_EXPANDED, DETAILS, HAS_DETAILS, PROPERTIES, SEMS_ADDRESS, TEXT } from "../Consts";
import { DetailsData } from "./DetailsData";

export class TextObject {
    
    public static createTextObjectFromJson(jsonObject) {
        App.objProperties.createFromJson(jsonObject);
        DetailsData.createFromJson(jsonObject);
    }

}