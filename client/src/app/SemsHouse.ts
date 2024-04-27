import {SemsObject} from "./SemsObject";
import {SemsLocation} from "./SemsLocation";

export class SemsHouse {
    

    constructor(private semsLocation : SemsLocation) {
        
    }

    createSemsObject(): Promise<SemsObject> {
        return this.semsLocation.createSemsObject(this);
    }
}