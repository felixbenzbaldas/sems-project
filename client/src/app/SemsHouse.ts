import {SemsLocation} from "./SemsLocation";
import {SemsObject} from "./SemsObject";

export class SemsHouse {


    constructor(private semsLocation: SemsLocation) {

    }

    createSemsObject(): Promise<SemsObject> {
        return this.semsLocation.createSemsObject(this);
    }
}