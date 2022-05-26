import { App } from "../App";
import { SEMS_ADDRESS } from "../Consts";
import { EventTypes } from "../EventTypes";
import { SetOfStrings as SetOfPrimitiveStrings } from "../general/SetOfPrimitiveStrings";
import { SemsServer } from "../SemsServer";
import { TextObject } from "./TextObject";

// note:
// loading has finished: this means that the object can be marked as loaded. It is loaded, but maybe it is not already marked as loaded.
// loaded: loading has finished and object is marked as loaded
export class ObjectLoader {
    
    private static loading : SetOfPrimitiveStrings = new SetOfPrimitiveStrings();
    private static loaded: SetOfPrimitiveStrings = new SetOfPrimitiveStrings();

    public static ensureLoaded(address : string, callback : Function) {
        if (ObjectLoader.isLoaded(address)) {
            callback();
        } else {
            ObjectLoader.ensureSemsObjectIsLoading(address);
            App.objEvents.addObserver(address, EventTypes.LOADED, function() {
                callback();
            });
        }
    }

    // assertion: listOfJsonObjects contains all load dependencies
    public static listOfJsonObjectsArrived(listOfJsonObjects : Array<any>) {
        ObjectLoader.installObjects(listOfJsonObjects);
        let newcomer = ObjectLoader.getNewcomer(ObjectLoader.getAddresses(listOfJsonObjects));
        ObjectLoader.setLoaded(newcomer);
        ObjectLoader.triggerLoadedEvent(newcomer);
    }

    private static installObjects(listOfJsonObjects : Array<any>) {
        for (let jsonObject of listOfJsonObjects) {
            if (!ObjectLoader.isLoaded(jsonObject[SEMS_ADDRESS])) {
                TextObject.createTextObjectFromJson(jsonObject);
            }
        }
    }

    private static getAddresses(listOfJsonObjects : Array<any>) {
        let addresses = [];
        for (let jsonObject of listOfJsonObjects) {
            addresses.push(jsonObject[SEMS_ADDRESS]);
        }
        return addresses;
    }

    private static getNewcomer(listOfAddresses : Array<string>) {
        let newcomer = [];
        for (let address of listOfAddresses) {
            if (!ObjectLoader.isLoaded(address)) {
                newcomer.push(address);
            }
        }
        return newcomer;
    }

    private static setLoaded(listOfAddresses : Array<string>) {
        for (let address of listOfAddresses) {
            ObjectLoader.loaded.add(address);
            ObjectLoader.loading.delete(address);
        }
    }

    private static triggerLoadedEvent(listOfAddresses : Array<string>) {
        for (let address of listOfAddresses) {
            App.objEvents.triggerEvent(address, EventTypes.LOADED, null);
        }
    }

    public static isLoaded(semsAddress : string) : boolean {
        return ObjectLoader.loaded.has(semsAddress);
    }

    public static listIsLoaded(listOfAddresses : Array<string>) : boolean {
        listOfAddresses.forEach(function(address) {
            if (!ObjectLoader.isLoaded(address)) {
                return false;
            }
        });
        return true;
    }

    // note: only call if object has not already been loaded
    private static ensureSemsObjectIsLoading(address : string) {
        if (!ObjectLoader.loading.has(address)) {
            ObjectLoader.setLoadingAndThenRequest(address);
        }
    }

    private static setLoadingAndThenRequest(address: string) {
        ObjectLoader.loading.add(address);
        SemsServer.requestSemsObject(address, function(listOfJsonObjects) {
            ObjectLoader.listOfJsonObjectsArrived(listOfJsonObjects);
        });
    }
}