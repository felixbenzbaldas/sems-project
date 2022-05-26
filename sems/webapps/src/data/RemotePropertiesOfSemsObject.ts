import { App } from "../App";
import { PROPERTIES, SEMS_ADDRESS } from "../Consts";
import { EventTypes } from "../EventTypes";
import { MapWithPrimitiveStringsAsKey } from "../general/MapWithPrimitiveStringsAsKey";
import { SemsServer } from "../SemsServer";

export class RemotePropertiesOfSemsObject {
    private map : MapWithPrimitiveStringsAsKey  = new MapWithPrimitiveStringsAsKey();
    private semsAddress : string;

    constructor(semsAddress : string) {
        this.semsAddress = semsAddress;
    }

    public static createFromJson(json) : RemotePropertiesOfSemsObject {
        let props = new RemotePropertiesOfSemsObject(json[SEMS_ADDRESS]);
        let propertiesJson = json[PROPERTIES];
        Object.keys(propertiesJson).forEach(function(property){
            props.map.set(property, propertiesJson[property]);
        });
        return props;
    }

    public set(property : string, value) {
        SemsServer.setProperty(this.semsAddress, property, value);
        this.map.set(property, value);
        App.objEvents.triggerEvent(this.semsAddress, EventTypes.PROPERTY_CHANGE, property);
    }

    public get(property) : any {
        return this.map.get(property);
    }

    public keys() : IterableIterator<any> {
        return this.map.keys();
    }

    public clear() {
        this.map = new MapWithPrimitiveStringsAsKey();
    }
}