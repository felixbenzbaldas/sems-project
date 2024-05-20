import type {HouseProvider} from "@/core/HouseProvider";
import type {Address} from "@/core/Address";

export class ObjectProvider {

    constructor(private houseProvider : HouseProvider) {
    }

    get(address: Address) : Promise<Object> {
        return this.houseProvider.get(address.withoutLastPart()).getObjectByName(address.getLastPart());
    }
}