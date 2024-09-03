import type {Identity} from "@/Identity";
import {notNullUndefined} from "@/utils";

export class GuiG_ListG {

    guisOfListItems : Array<Identity>;
    uiElement : HTMLDivElement = document.createElement('div');

    constructor(private identity : Identity) {
    }

    async unsafeUpdate() {
        await this.updateGuisOfListItems();
        this.uiElement.innerHTML = null;
        this.uiElement.style.display = 'flex';
        this.uiElement.style.flexWrap = 'wrap';
        this.uiElement.style.rowGap = '0.25rem';
        for (let gui of this.guisOfListItems) {
            this.uiElement.appendChild(gui.guiG.uiElement);
        }
    }

    private async updateGuisOfListItems() {
        this.guisOfListItems = []; // TODO: do not always dismiss old guis
        for (let currentResolved of await this.identity.list.getResolvedList()) {
            let currentGui = currentResolved; // TODO: create extra object for currentGui
            currentGui.guiG.editable = this.identity.guiG.editable;
            await currentGui.update();
            this.guisOfListItems.push(currentGui);
        }
    }

    getRawText() : string {
        if (notNullUndefined(this.identity.list)) {
            return this.guisOfListItems.map(current => current.guiG.getRawText()).reduce((a, b) => a + b, '');
        } else {
            return '';
        }
    }

    async click(text : string) {
        if (this.identity.list) {
            for (let current of this.guisOfListItems) {
                await current.guiG.click(text);
            }
        }
    }

    countEditableTexts() : number {
        if (this.identity.list) {
            return this.guisOfListItems.map(current => current.guiG.countEditableTexts()).reduce((a, b) => a + b, 0);
        }
    }
}