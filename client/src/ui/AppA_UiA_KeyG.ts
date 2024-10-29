import type {Entity} from "@/Entity";
import {notNullUndefined} from "@/utils";

export class AppA_UiA_KeyG {

    constructor(private entity: Entity) {
    }

    keyboardEvent(keyboardEvent: KeyboardEvent) {
        this.entity.log(this.createCompareString(keyboardEvent));
    }

    createCompareString(keyboardEvent: KeyboardEvent) {
        let list = [];
        if (keyboardEvent.ctrlKey) {
            list.push("ctrl");
        }
        if (keyboardEvent.shiftKey) {
            list.push("shift");
        }
        if (keyboardEvent.altKey) {
            list.push("alt");
        }
        if (notNullUndefined(keyboardEvent.key)) {
            list.push(keyboardEvent.key);
        }
        return list.join('+') + ' (' + keyboardEvent.type + ')';
    }
}