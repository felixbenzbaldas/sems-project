import {Address} from "./Address";
import {Object} from "./Object";
import {House} from "./House";
import {HouseProvider} from "./HouseProvider";

export class ObjectProvider {

    constructor(private houseProvider : HouseProvider) {
    }

    get(address: Address) : Promise<Object> {
        return this.houseProvider.get(address.getHouse()).getObjectByName(address.getName());
    }
}