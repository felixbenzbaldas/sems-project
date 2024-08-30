import type {Identity} from "@/Identity";
import {notNullUndefined} from "@/utils";

export class GuiG_ListG {

    private resolvedListItems : Array<Identity>;
    uiElement : HTMLDivElement = document.createElement('div');

    constructor(private identity : Identity) {
    }

    async update() {
        this.uiElement.innerHTML = null;
        this.resolvedListItems = [];
        for (let current of this.identity.list.jsList) {
            let resolved = current.pathA ? await this.identity.resolve(current) : current;
            this.resolvedListItems.push(resolved);
            resolved.guiG.editable = this.identity.guiG.isEditable();
            this.uiElement.appendChild(await resolved.guiG.getUpdatedUiElement());
        }
    }

    getRawText() : string {
        if (notNullUndefined(this.identity.list)) {
            return this.resolvedListItems.map(current => current.guiG.getRawText()).reduce((a, b) => a + b, '');
        } else {
            return '';
        }
    }

    async click(text : string) {
        if (this.identity.list) {
            for (let current of this.resolvedListItems) {
                await current.guiG.click(text);
            }
        }
    }

    countEditableTexts() : number {
        if (this.identity.list) {
            return this.resolvedListItems.map(current => current.guiG.countEditableTexts()).reduce((a, b) => a + b, 0);
        }
    }
}