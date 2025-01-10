import type {Entity} from "@/Entity";
import {notNullUndefined} from "@/utils";

export class UiA_AppA_KeyG {

    map : Map<string, (keyboardEvent : KeyboardEvent) => Promise<void>> = new Map();

    constructor(public entity: Entity) {
        this.map.set('Enter', async keyboardEvent => {
            this.entity.log('Enter');
            // this.entity.uiA.appA.focused.uiA.textG.save();
            await this.entity.uiA.appA.globalEventG.defaultAction();
        });
        this.map.set('alt+Enter', async keyboardEvent => {
            this.entity.uiA.appA.focused.textG.save();
            await this.entity.uiA.appA.globalEventG.newSubitem();
        });
        this.map.set('ctrl+f', async keyboardEvent => {
            await this.entity.uiA.appA.globalEventG.toggleCollapsible();
        });
        this.map.set('ctrl+f', async keyboardEvent => {
            await this.entity.uiA.appA.globalEventG.toggleCollapsible();
        });
        this.map.set('ctrl+e', async keyboardEvent => {
            await this.entity.uiA.appA.globalEventG.scaleDown();
        });
        this.map.set('ctrl+d', async keyboardEvent => {
            await this.entity.uiA.appA.globalEventG.scaleUp();
        });
        this.map.set('ctrl+g', async keyboardEvent => {
            await this.entity.uiA.appA.globalEventG.toggleContext();
        });
        this.map.set('ctrl+shift+X', async keyboardEvent => {
            await this.entity.uiA.appA.globalEventG.cut();
        });
        this.map.set('ctrl+shift+V', async keyboardEvent => {
            await this.entity.uiA.appA.globalEventG.paste();
        });
        this.map.set('F3', async keyboardEvent => {
            await this.entity.uiA.appA.globalEventG.pasteNext();
        });
        this.map.set('ctrl+shift+D', async keyboardEvent => {
            await this.entity.uiA.appA.globalEventG.mark();
        });
        this.map.set('F11', async keyboardEvent => {
            await this.entity.uiA.appA.globalEventG.load();
        });
        this.map.set('ctrl+o', async keyboardEvent => {
            await this.entity.uiA.appA.globalEventG.focusUiContext();
        });
    }

    async keyboardEvent(keyboardEvent: KeyboardEvent) {
        let compareString = this.createCompareString(keyboardEvent);
        if (this.entity.getApp_typed().testMode) {
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