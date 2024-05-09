import {Location} from "./Location";
import {Object} from "./Object";
import {lastValueFrom, of} from "rxjs";

export class House {

    private loadedObjects : Map<string, Object> = new Map();


    constructor(private location: Location) {

    }

    createObject(): Promise<Object> {
        return this.location.createObject(this).then(object => {
            this.loadedObjects.set(object.getAddress().getName(), object);
            return object;
        });
    }

    getObjectByName(name: string): Promise<Object> {
        if (this.loadedObjects.has(name)) {
            return lastValueFrom(of(this.loadedObjects.get(name)));
        } else {
            return this.location.getObject(this, name).then(
                object => {
                    this.loadedObjects.set(name, object);
                    return object;
                }
            );
        }
    }
}