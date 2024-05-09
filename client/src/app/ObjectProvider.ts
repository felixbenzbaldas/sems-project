import {Address} from "./Address";
import {Object} from "./Object";
import {House} from "./House";

export class ObjectProvider {

    constructor(private housesMap : Map<string, House>) {
    }

    get(address: Address) : Promise<Object> {
        return this.housesMap.get(address.getHouse()).getObjectByName(address.getName());
    }
}