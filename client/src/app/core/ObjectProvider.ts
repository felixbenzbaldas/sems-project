import {Address} from "./Address";
import {Object} from "./Object";
import {House} from "./House";
import {HouseProvider} from "./HouseProvider";
import {AddressUtil} from "./AddressUtil";

export class ObjectProvider {

    constructor(private houseProvider : HouseProvider) {
    }

    get(address: Address) : Promise<Object> {
        return this.houseProvider.get(address.withoutLastPart()).getObjectByName(address.getLastPart());
    }
}