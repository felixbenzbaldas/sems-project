import type {Entity} from "@/Entity";
import {notNullUndefined} from "@/utils";

export class UiG_ListG {

    uisOfListItems : Array<Entity>;
    htmlElement : HTMLDivElement = document.createElement('div');

    constructor(private entity : Entity) {
    }

    async update() {
        if (this.entity.collapsible) {
            if (!notNullUndefined(this.entity.collapsed)) {
                this.entity.collapsed = true;
            }
        }
        if (!this.entity.collapsed) {
            await this.updateUisOfListItems();
            this.htmlElement.innerHTML = null;
            this.htmlElement.style.display = 'flex';
            this.htmlElement.style.flexWrap = 'wrap';
            this.htmlElement.style.rowGap = '0.25rem';
            for (let ui of this.uisOfListItems) {
                this.htmlElement.appendChild(ui.uiG.htmlElement);
            }
        }
    }

    private async updateUisOfListItems() {
        this.uisOfListItems = []; // TODO: do not always dismiss old uis
        for (let currentResolved of await this.entity.list.getResolvedList()) {
            let currentUi = currentResolved; // TODO: create extra object for currentUi
            currentUi.uiG.editable = this.entity.uiG.editable;
            currentUi.ui_context = this.entity;
            await currentUi.update();
            this.uisOfListItems.push(currentUi);
        }
    }

    getRawText() : string {
        if (notNullUndefined(this.entity.list)) {
            return this.uisOfListItems.map(current => current.uiG.getRawText()).reduce((a, b) => a + b, '');
        } else {
            return '';
        }
    }

    async click(text : string) {
        if (this.entity.list) {
            for (let current of this.uisOfListItems) {
                await current.uiG.click(text);
            }
        }
    }

    countEditableTexts() : number {
        if (this.entity.list) {
            return this.uisOfListItems.map(current => current.uiG.countEditableTexts()).reduce((a, b) => a + b, 0);
        }
    }

    async defaultActionOnSubitem(subitem: Entity) {
        let created = await this.entity.getApp().appA.createText('');
        let position : number = this.uisOfListItems.indexOf(subitem) + 1;
        this.entity.list.jsList.splice(position, 0, this.entity.getPath(created));
        await this.entity.update();
        this.entity.getApp().appA.uiA.focused = this.uisOfListItems.at(position);
    }
}