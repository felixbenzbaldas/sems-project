import {notNullUndefined} from "@/utils";

export class InputPattern {
    ctrl : boolean;
    alt : boolean;
    shift : boolean;
    key : string;
    type : string;

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
            list.push(this.key);
        }
        if (notNullUndefined(this.type)) {
            list.push(' (' + this.type + ')');
        }
        return list.join('+');
    }

    static createFromKeyboardEvent(keyboardEvent : KeyboardEvent) : InputPattern {
        let inputPattern = InputPattern.createFromKeyboardEvent_withoutType(keyboardEvent);
        inputPattern.type = keyboardEvent.type;
        return inputPattern;
    }

    static createFromKeyboardEvent_withoutType(keyboardEvent : KeyboardEvent) : InputPattern {
        let inputPattern = new InputPattern();
        inputPattern.ctrl = keyboardEvent.ctrlKey;
        inputPattern.shift = keyboardEvent.shiftKey;
        inputPattern.alt = keyboardEvent.altKey;
        inputPattern.key = keyboardEvent.key;
        return inputPattern;
    }
}