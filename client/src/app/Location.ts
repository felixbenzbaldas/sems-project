import {House} from "./House";
import {Object} from "./Object";

export class Location {

    createObject(house: House): Promise<Object> {
        return undefined;
    }

    getObject(house : House, name : string) : Promise<Object> {
        return undefined;
    }
}