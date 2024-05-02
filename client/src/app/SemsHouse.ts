import {SemsLocation} from "./SemsLocation";
import {SemsObject} from "./SemsObject";
import {lastValueFrom, of} from "rxjs";

export class SemsHouse {

    private loadedObjects : Map<string, SemsObject> = new Map();


    constructor(private semsLocation: SemsLocation) {

    }

    createSemsObject(): Promise<SemsObject> {
        return this.semsLocation.createSemsObject(this).then(object => {
            this.loadedObjects.set(object.getSemsAddress().getName(), object);
            return object;
        });
    }

    getObjectByName(name: string): Promise<SemsObject> {
        if (this.loadedObjects.has(name)) {
            return lastValueFrom(of(this.loadedObjects.get(name)));
        } else {
            return this.semsLocation.getSemsObject(this, name).then(
                object => {
                    this.loadedObjects.set(name, object);
                    return object;
                }
            );
        }
    }
}