import {House} from "./House";
import {AddressUtil} from "./AddressUtil";
import type {Address} from "@/core/Address";

export interface HouseProvider {
    get(houseAddress : Address) : House;
}

export class HouseProviderImpl implements HouseProvider {

    private map : Map<string, House> = new Map<string, House>();

    take(house : House) {
        this.map.set(AddressUtil.createString(house.getAddress()), house);
    }

    get(houseAddress : Address) {
        return this.map.get(AddressUtil.createString(houseAddress));
    }
}