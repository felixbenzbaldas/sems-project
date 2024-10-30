import type {Entity} from "@/Entity";
import {notNullUndefined} from "@/utils";

export class AppA_UiA_KeyG {

    map : Map<string, (keyboardEvent : KeyboardEvent) => Promise<void>> = new Map();

    constructor(private entity: Entity) {
        this.map.set('Enter', async keyboardEvent => {
            this.entity.appA.uiA.focused.uiA.textG.save();
            await this.entity.appA.uiA.globalEventG.defaultAction();
        });
        this.map.set('alt+Enter', async keyboardEvent => {
            this.entity.appA.uiA.focused.uiA.textG.save();
            await this.entity.appA.uiA.globalEventG.newSubitem();
        });
        this.map.set('ctrl+f', async keyboardEvent => {
            await this.entity.appA.uiA.globalEventG.toggleCollapsible();
        });
        this.map.set('ctrl+f', async keyboardEvent => {
            await this.entity.appA.uiA.globalEventG.toggleCollapsible();
        });
        this.map.set('ctrl+i', async keyboardEvent => {
            await this.entity.appA.uiA.globalEventG.scaleDown();
        });
        this.map.set('ctrl+k', async keyboardEvent => {
            await this.entity.appA.uiA.globalEventG.scaleUp();
        });
    }

    async keyboardEvent(keyboardEvent: KeyboardEvent) {
        let compareString = this.createCompareString(keyboardEvent);
        if (this.entity.appA.testMode) {
            this.entity.logInfo(compareString);
        }
        if (this.map.has(compareString)) {
            await this.map.get(compareString)(keyboardEvent);
            keyboardEvent.preventDefault();
        }
        let compareString_withoutType = this.createCompareString_withoutType(keyboardEvent);
        if (this.map.has(compareString_withoutType)) {
            if (keyboardEvent.type === 'keyup') {
                await this.map.get(compareString_withoutType)(keyboardEvent);
            } else {
                keyboardEvent.preventDefault();
            }
        }
    }

    createCompareString(keyboardEvent: KeyboardEvent) : string {
        return this.createCompareString_withoutType(keyboardEvent) + ' (' + keyboardEvent.type + ')';
    }

    createCompareString_withoutType(keyboardEvent: KeyboardEvent) : string {
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
        return list.join('+');
    }
}