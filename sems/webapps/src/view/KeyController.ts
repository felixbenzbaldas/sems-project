import { App } from "../App";
import { EventTypes } from "../EventTypes";
import { KeyEvent } from "../general/KeyEvent";
import { MapWithPrimitiveStringsAsKey } from "../general/MapWithPrimitiveStringsAsKey";
import { WhiteSpaceHandler } from "./SemsText/WhiteSpaceHandler";
import { UserInterfaceObject } from "./UserInterfaceObject";

// Wird für Komponenten mit manuellem Fokus verwendet.
// Empfängt Instanzen von KeyboardEvent (TypeScript-Klasse).
// Löst automatisch KeyEvents aus. Es werden insbesondere auch KeyEvents mit der Sems-Taste ("Sk") automatisch ausgelöst.
// KeyEvents werden ggf. auf EventTypes gemappt.
// Der EventType wird dann am zugeordneten Uio ausgelöst.
export class KeyController {

    private keyActions : MapWithPrimitiveStringsAsKey = new MapWithPrimitiveStringsAsKey();
    private keyEventDefinitions : MapWithPrimitiveStringsAsKey = new MapWithPrimitiveStringsAsKey();
    private uio : UserInterfaceObject;

    private whiteSpaceHandler : WhiteSpaceHandler = new WhiteSpaceHandler();

    private keyDownFunction : Function;
    private keyUpFunction : Function;

    constructor() {
        this.createKeyFunctions();
        let self = this;
        this.whiteSpaceHandler.on_keyDownAndUpDuringWhiteSpaceDown = function(key : string) {
            let keyEvent : KeyEvent = new KeyEvent();
            keyEvent.sk = true;
            keyEvent.key = key;
            self.triggerKeyEvent(keyEvent);
        };
    }

    private setHtmlElement(htmlElement) {
        htmlElement.addEventListener("keydown", this.keyDownFunction);
        htmlElement.addEventListener("keyup", this.keyUpFunction);
    }

    private createKeyFunctions() {
        let self = this;
        this.keyDownFunction = function(ev: KeyboardEvent) {
            let keyEvent = KeyEvent.createFromKeyboardEvent(ev);
            self.triggerKeyEvent(keyEvent);
            self.whiteSpaceHandler.keyDown(ev.key);
        };
        this.keyUpFunction = function(ev: KeyboardEvent) {
            let keyEvent = KeyEvent.createFromKeyboardEvent(ev);
            let compareString = keyEvent.createCompareString();
            if (self.keyActions.has(compareString) || self.keyEventDefinitions.has(compareString) || App.keyMap.has(compareString)) {
                ev.preventDefault();
            }
            self.whiteSpaceHandler.keyUp(ev.key);
        };
    }

    public setKeyAction(keyEvent : string, action : Function) {
        this.keyActions.set(keyEvent, action);
    }

    public addKeyActions(map : MapWithPrimitiveStringsAsKey) {
        for (let key of map.keys()) {
            this.setKeyAction(key, map.get(key));
        }
    }

    public setKeyEventDefinition(keyEvent : KeyEvent, eventType : EventTypes) {
        this.keyEventDefinitions.set(keyEvent, eventType);
    }

    public transmitKeyEventsTo(uio : UserInterfaceObject) {
        this.uio = uio;
    }

    public triggerKeyDown(ev: KeyboardEvent) {
        this.keyDownFunction(ev);
    }

    public triggerKeyUp(ev: KeyboardEvent) {
        this.keyUpFunction(ev);
    }

    private triggerKeyEvent(keyEvent : KeyEvent) {
        let compareString = keyEvent.createCompareString();
        if (this.keyActions.has(compareString)) {
            keyEvent.preventDefault();
            this.keyActions.get(compareString)();
        } else {
            if (this.keyEventDefinitions.has(compareString)) {
                keyEvent.preventDefault();
                this.uio.eventController.triggerEvent(this.keyEventDefinitions.get(compareString), null);
            } else if (App.keyMap.has(compareString)) {
                keyEvent.preventDefault();
                this.uio.eventController.triggerEvent(App.keyMap.get(compareString), null);
            }
        }
    }
}