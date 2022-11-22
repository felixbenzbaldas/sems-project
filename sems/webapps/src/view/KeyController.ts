import { App } from "../App";
import { KeyEvent } from "../general/KeyEvent";
import { MapWithPrimitiveStringsAsKey } from "../general/MapWithPrimitiveStringsAsKey";
import { UserInterfaceObject } from "./UserInterfaceObject";

// Wird für Komponenten mit manuellem Fokus verwendet.
// Empfängt Instanzen von KeyboardEvent (TypeScript-Klasse).
// Löst automatisch KeyEvents aus. Es werden insbesondere auch KeyEvents mit der Sems-Taste ("Sk") automatisch ausgelöst.
// KeyEvents werden ggf. auf EventTypes gemappt.
// Der EventType wird dann am zugeordneten Uio ausgelöst.
export class KeyController {

    private keyActions : MapWithPrimitiveStringsAsKey = new MapWithPrimitiveStringsAsKey();
    private uio : UserInterfaceObject;

    public setKeyAction(keyEvent : string, action : Function) {
        this.keyActions.set(keyEvent, action);
    }

    public addKeyActions(map : MapWithPrimitiveStringsAsKey) {
        for (let key of map.keys()) {
            this.setKeyAction(key, map.get(key));
        }
    }

    public transmitKeyEventsTo(uio : UserInterfaceObject) {
        this.uio = uio;
    }

    public triggerKeyDown(ev: KeyboardEvent) {
        this.triggerKeyEvent(KeyEvent.createFromKeyboardEvent(ev));
    }

    private triggerKeyEvent(keyEvent : KeyEvent) {
        let compareString = keyEvent.createCompareString();
        if (this.keyActions.has(compareString)) {
            keyEvent.preventDefault();
            this.keyActions.get(compareString)();
        } else {
            if (App.keyMap.has(compareString)) {
                keyEvent.preventDefault();
                this.uio.eventController.triggerEvent(App.keyMap.get(compareString), null);
            }
            if (App.keyMap_normalMode.has(compareString)) {
                keyEvent.preventDefault();
                this.uio.eventController.triggerEvent(App.keyMap_normalMode.get(compareString), null);
            }
        }
    }
}