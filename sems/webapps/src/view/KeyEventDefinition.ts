import { EventTypes } from "../EventTypes";
import { KeyEvent } from "../general/KeyEvent";
import { MapWithPrimitiveStringsAsKey } from "../general/MapWithPrimitiveStringsAsKey";


// Diese Klasse wird benutzt, um das Mapping von KeyEvents auf EventTypes zu erstellen.
// Hier wird einem KeyEvent also eine logische Bedeutung zugeordnet.
export class KeyEventDefinition {
    private keyMap : MapWithPrimitiveStringsAsKey;

    public createKeyMap() : MapWithPrimitiveStringsAsKey {
        this.keyMap = new MapWithPrimitiveStringsAsKey();
        this.addMapping(EventTypes.FOCUS_PREV, function(keyEvent : KeyEvent) {
            keyEvent.sk = true;
            keyEvent.key = "i";
        });
        // this.addMapping(EventTypes.FOCUS_PREV_TOP_LEVEL_OBJECT, function(keyEvent : KeyEvent) {
        //     keyEvent.sk = true;
        //     keyEvent.key = "XXX";
        // });
        // this.addMapping(EventTypes.FOCUS_NEXT_TOP_LEVEL_OBJECT, function(keyEvent : KeyEvent) {
        //     keyEvent.sk = true;
        //     keyEvent.key = "XXX";
        // });
        this.addMapping(EventTypes.FOCUS_PREV_COLUMN, function(keyEvent : KeyEvent) {
            keyEvent.sk = true;
            keyEvent.key = "p";
        });
        this.addMapping(EventTypes.FOCUS_NEXT_COLUMN, function(keyEvent : KeyEvent) {
            keyEvent.sk = true;
            keyEvent.key = "ö";
        });
        this.addMapping(EventTypes.FOCUS_NEXT, function(keyEvent : KeyEvent) {
            keyEvent.sk = true;
            keyEvent.key = "k";
        });
        this.addMapping(EventTypes.JUMP_BACKWARD, function(keyEvent : KeyEvent) {
            keyEvent.sk = true;
            keyEvent.key = "8";
        });
        this.addMapping(EventTypes.JUMP_FORWARD, function(keyEvent : KeyEvent) {
            keyEvent.sk = true;
            keyEvent.key = ",";
        });
        this.addMapping(EventTypes.FOCUS_PREV, function(keyEvent : KeyEvent) {
            keyEvent.ctrl = true;
            keyEvent.key = "ArrowUp";
        });
        this.addMapping(EventTypes.FOCUS_NEXT, function(keyEvent : KeyEvent) {
            keyEvent.ctrl = true;
            keyEvent.key = "ArrowDown";
        });
        this.addMapping(EventTypes.SCALE_DOWN, function(keyEvent : KeyEvent) {
            keyEvent.ctrl = true;
            keyEvent.shift = true;
            keyEvent.key = "ArrowUp";
        });
        this.addMapping(EventTypes.SCALE_UP, function(keyEvent : KeyEvent) {
            keyEvent.ctrl = true;
            keyEvent.shift = true;
            keyEvent.key = "ArrowDown";
        });
        this.addMapping(EventTypes.NEW_SUBITEM, function(keyEvent : KeyEvent) {
            keyEvent.sk = true;
            keyEvent.key = "Enter";
        });
        this.addMapping(EventTypes.SCALE_DOWN, function(keyEvent : KeyEvent) {
            keyEvent.sk = true;
            keyEvent.key = "e";
        });
        this.addMapping(EventTypes.SCALE_UP, function(keyEvent : KeyEvent) {
            keyEvent.sk = true;
            keyEvent.key = "d";
        });
        this.addMapping(EventTypes.OPEN_OVERVIEW, function(keyEvent : KeyEvent) {
            keyEvent.sk = true;
            keyEvent.key = "g";
        });
        this.addMapping(EventTypes.CUT, function(keyEvent : KeyEvent) {
            keyEvent.sk = true;
            keyEvent.key = "x";
        });
        this.addMapping(EventTypes.COPY, function(keyEvent : KeyEvent) {
            keyEvent.sk = true
            keyEvent.key = "c";
        });
        this.addMapping(EventTypes.PASTE, function(keyEvent : KeyEvent) {
            keyEvent.sk = true;
            keyEvent.key = "v";
        });
        this.addMapping(EventTypes.DELETE, function(keyEvent : KeyEvent) {
            keyEvent.sk = true;
            keyEvent.key = "Backspace";
        });
        this.addMapping(EventTypes.NEW_COLUMN_PREV, function(keyEvent : KeyEvent) {
            keyEvent.alt = true;
            keyEvent.key = "p";
        });
        this.addMapping(EventTypes.NEW_COLUMN_NEXT, function(keyEvent : KeyEvent) {
            keyEvent.alt = true;
            keyEvent.key = "ö";
        });
        this.addMapping(EventTypes.MOVE_COLUMN_PREV, function(keyEvent : KeyEvent) {
            keyEvent.ctrl = true;
            keyEvent.shift = true;
            keyEvent.key = "Ü";
        });
        this.addMapping(EventTypes.MOVE_COLUMN_NEXT, function(keyEvent : KeyEvent) {
            keyEvent.ctrl = true;
            keyEvent.shift = true;
            keyEvent.key = "Ö";
        });
        this.addMapping(EventTypes.GO_TO_END_OF_LIST, function(keyEvent : KeyEvent) {
            keyEvent.sk = true;
            keyEvent.key = "l";
        });
        this.addMapping(EventTypes.FOCUS_VIEW_CONTEXT, function(keyEvent : KeyEvent) {
            keyEvent.sk = true;
            keyEvent.key = "o";
        });
        this.addMapping(EventTypes.REPLACE_TOP_LEVEL_OBJECT, function(keyEvent : KeyEvent) {
            keyEvent.sk = true;
            keyEvent.key = "a";
        });
        this.addMapping(EventTypes.DO_NOTHING, function(keyEvent : KeyEvent) {
            keyEvent.ctrl = true;
            keyEvent.key = "-";
        });
        this.addMapping(EventTypes.DO_NOTHING, function(keyEvent : KeyEvent) {
            keyEvent.ctrl = true;
            keyEvent.key = "m";
        });
        return this.keyMap;
    }
    
    public createKeyMap_normalMode() : MapWithPrimitiveStringsAsKey {
        this.keyMap = new MapWithPrimitiveStringsAsKey();
        this.addMapping(EventTypes.OPEN, function(keyEvent : KeyEvent) {
            keyEvent.key = "q";
        });
        return this.keyMap;
    }
    
    private addMapping(event : any, defineKeyEvent : Function) {
        let keyEvent = new KeyEvent();
        defineKeyEvent(keyEvent);
        this.keyMap.set(keyEvent.createCompareString(), event);
    };
}