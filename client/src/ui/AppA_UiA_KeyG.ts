import type {Entity} from "@/Entity";
import {notNullUndefined} from "@/utils";

export class AppA_UiA_KeyG {

    map : Map<string, (keyboardEvent : KeyboardEvent) => Promise<void>> = new Map();

    constructor(private entity: Entity) {
        this.map.set('Enter (keyup)', async keyboardEvent => {
            this.entity.appA.uiA.focused.uiA.textG.save();
            await this.entity.appA.uiA.globalEventG.defaultAction();
        });
        this.map.set('alt+Enter (keyup)', async keyboardEvent => {
            this.entity.appA.uiA.focused.uiA.textG.save();
            await this.entity.appA.uiA.globalEventG.newSubitem();
        });
        this.map.set('ctrl+f (keydown)', async keyboardEvent => {
            keyboardEvent.preventDefault();
        });
        this.map.set('ctrl+f (keyup)', async keyboardEvent => {
            await this.entity.appA.uiA.globalEventG.toggleCollapsible();
        });
        this.map.set('ctrl+f (keyup)', async keyboardEvent => {
            await this.entity.appA.uiA.globalEventG.toggleCollapsible();
        });
        this.map.set('ctrl+i (keydown)', async keyboardEvent => {
            keyboardEvent.preventDefault();
        });
        this.map.set('ctrl+i (keyup)', async keyboardEvent => {
            await this.entity.appA.uiA.globalEventG.scaleDown();
        });
        this.map.set('ctrl+k (keydown)', async keyboardEvent => {
            keyboardEvent.preventDefault();
        });
        this.map.set('ctrl+k (keyup)', async keyboardEvent => {
            await this.entity.appA.uiA.globalEventG.scaleUp();
        });
    }

    async keyboardEvent(keyboardEvent: KeyboardEvent) {
        let keyCompareString = this.createCompareString(keyboardEvent);
        if (this.entity.appA.testMode) {
            this.entity.logInfo(keyCompareString);
        }
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