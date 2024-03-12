import { EventController } from "./EventController";
import { MapWithPrimitiveStringsAsKey } from "./MapWithPrimitiveStringsAsKey";

export class Events {
    private map : Identity_EventController_Map = new Identity_EventController_Map();
    public addObserver(identity, eventType, observer: Function) {
        this.map.get(identity).addObserver(eventType, observer);
    }
    public removeObserver(identity, eventType, observer : Function) {
        this.map.get(identity).removeObserver(eventType, observer);
    }
    public triggerEvent(identity, eventType, eventObject) {
        this.map.get(identity).triggerEvent(eventType, eventObject);
    }
}

class Identity_EventController_Map {
	private map = new MapWithPrimitiveStringsAsKey();
	public get(identity) : EventController {
		if (!this.map.has(identity)) {
			this.map.set(identity, new EventController(identity));
		}
		return this.map.get(identity);
	}
}