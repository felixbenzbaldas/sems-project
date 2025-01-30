import {notNullUndefined} from "@/utils";
import type {AccessMode} from "@/ui/AccessMode";

export class InputPattern {
    ctrl : boolean;
    alt : boolean;
    shift : boolean;
    key : string; // TODO private to ensure that it is normalized?
    type : string;
    mode : 'view' | 'edit';

    createCompareString() : string {
        let list = [];
        if (this.ctrl) {
            list.push('ctrl');
        }
        if (this.shift) {
            list.push('shift');
        }
        if (this.alt) {
            list.push('alt');
        }
        if (notNullUndefined(this.key)) {
            list.push(InputPattern.normalize(this.key));
        }
        let compareString = list.join('+');
        if (notNullUndefined(this.type)) {
            compareString += ' ' + this.type + '';
        }
        if (notNullUndefined(this.mode)) {
            compareString += ' ' + this.mode;
        }
        return compareString;
    }

    static createFromKeyboardEvent(keyboardEvent : KeyboardEvent, mode? : AccessMode) : InputPattern {
        let inputPattern = InputPattern.createFromKeyboardEvent_withoutType(keyboardEvent, mode);
        inputPattern.type = keyboardEvent.type;
        return inputPattern;
    }

    static createFromKeyboardEvent_withoutType(keyboardEvent : KeyboardEvent, mode? : AccessMode) : InputPattern {
        let inputPattern = new InputPattern();
        inputPattern.ctrl = keyboardEvent.ctrlKey;
        inputPattern.shift = keyboardEvent.shiftKey;
        inputPattern.alt = keyboardEvent.altKey;
        inputPattern.key = InputPattern.normalize(keyboardEvent.key);
        inputPattern.mode = mode;
        return inputPattern;
    }

    static normalize(key : string) {
        if (notNullUndefined(key)) {
            if (key.length === 1) {
                return key.toLowerCase();
            } else {
                return key;
            }
        }
    }
}