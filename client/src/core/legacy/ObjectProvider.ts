import type {HouseProvider} from "@/core/legacy/HouseProvider";
import type {Address} from "@/core/legacy/Address";

export class ObjectProvider {

    constructor(private houseProvider : HouseProvider) {
    }

    get(address: Address) : Promise<Object> {
        return this.houseProvider.get(address.withoutLastPart()).getObjectByName(address.getLastPart());
    }
}