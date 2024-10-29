import type {Entity} from "@/Entity";
import {notNullUndefined} from "@/utils";

export class AppA_UiA_KeyG {

    map : Map<string, (keyboardEvent : KeyboardEvent) => Promise<void>> = new Map();

    constructor(private entity: Entity) {
        this.map.set('Enter (keyup)', async keyboardEvent => {
            await this.entity.appA.uiA.globalEventG.defaultAction();
        });
    }

    async keyboardEvent(keyboardEvent: KeyboardEvent) {
        let keyCompareString = this.createCompareString(keyboardEvent);
        this.entity.log(keyCompareString);
        if (this.map.has(keyCompareString)) {
            await this.map.get(keyCompareString)(keyboardEvent);
        }
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