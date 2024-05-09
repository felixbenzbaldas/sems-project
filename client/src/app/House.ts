import {Location} from "./Location";
import {Object} from "./Object";
import {lastValueFrom, of} from "rxjs";

export class House {

    private loadedObjects : Map<string, Object> = new Map();


    constructor(private name : string, private location: Location) {

    }

    createObject(): Promise<Object> {
        return this.location.createObject(this.name).then(object => {
            this.loadedObjects.set(object.getAddress().getName(), object);
            return object;
        });
    }

    getObjectByName(objectName: string): Promise<Object> {
        if (this.loadedObjects.has(objectName)) {
            return lastValueFrom(of(this.loadedObjects.get(objectName)));
        } else {
            return this.location.getObject(this.name, objectName).then(
                object => {
                    this.loadedObjects.set(objectName, object);
                    return object;
                }
            );
        }
    }
}