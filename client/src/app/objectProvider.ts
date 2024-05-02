import {SemsAddress} from "./SemsAddress";
import {SemsObject} from "./SemsObject";
import {SemsHouse} from "./SemsHouse";

export class ObjectProvider {

    constructor(private housesMap : Map<string, SemsHouse>) {
    }

    get(semsAddress: SemsAddress) : Promise<SemsObject> {
        return this.housesMap.get(semsAddress.getHouse()).getObjectByName(semsAddress.getName());
    }
}