import type {Identity} from "@/Identity";
import {notNullUndefined} from "@/utils";

export class GuiG_ListG {

    private resolvedListItems : Array<Identity>;
    private guisOfListItems : Array<Identity>;
    uiElement : HTMLDivElement = document.createElement('div');

    constructor(private identity : Identity) {
    }

    async unsafeUpdate() {
        await this.resolveListItems();
        await this.updateGuisOfListItems();
        this.uiElement.innerHTML = null;
        for (let gui of this.guisOfListItems) {
            this.uiElement.appendChild(gui.guiG.uiElement);
        }
    }

    private async resolveListItems() {
        this.resolvedListItems = [];
        for (let current of this.identity.list.jsList) {
            let resolved = current.pathA ? await this.identity.resolve(current) : current;
            this.resolvedListItems.push(resolved);
        }
    }

    private async updateGuisOfListItems() {
        this.guisOfListItems = []; // TODO: do not always dismiss old guis
        for (let resolved of this.resolvedListItems) {
            let gui = resolved; // TODO: create extra object for gui
            gui.guiG.editable = this.identity.guiG.editable;
            await gui.guiG.unsafeUpdate();
            this.guisOfListItems.push(gui);
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