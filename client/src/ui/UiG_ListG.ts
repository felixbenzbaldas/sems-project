import type {Entity} from "@/Entity";
import {notNullUndefined} from "@/utils";

export class UiG_ListG {

    guisOfListItems : Array<Entity>;
    uiElement : HTMLDivElement = document.createElement('div');

    constructor(private entity : Entity) {
    }

    async unsafeUpdate() {
        if (this.entity.collapsible) {
            if (!notNullUndefined(this.entity.collapsed)) {
                this.entity.collapsed = true;
            }
        }
        if (!this.entity.collapsed) {
            await this.updateGuisOfListItems();
            this.uiElement.innerHTML = null;
            this.uiElement.style.display = 'flex';
            this.uiElement.style.flexWrap = 'wrap';
            this.uiElement.style.rowGap = '0.25rem';
            for (let gui of this.guisOfListItems) {
                this.uiElement.appendChild(gui.uiG.uiElement);
            }
        }
    }

    private async updateGuisOfListItems() {
        this.guisOfListItems = []; // TODO: do not always dismiss old guis
        for (let currentResolved of await this.entity.list.getResolvedList()) {
            let currentGui = currentResolved; // TODO: create extra object for currentGui
            currentGui.uiG.editable = this.entity.uiG.editable;
            currentGui.ui_context = this.entity;
            await currentGui.update();
            this.guisOfListItems.push(currentGui);
        }
    }

    getRawText() : string {
        if (notNullUndefined(this.entity.list)) {
            return this.guisOfListItems.map(current => current.uiG.getRawText()).reduce((a, b) => a + b, '');
        } else {
            return '';
        }
    }

    async click(text : string) {
        if (this.entity.list) {
            for (let current of this.guisOfListItems) {
                await current.uiG.click(text);
            }
        }
    }

    countEditableTexts() : number {
        if (this.entity.list) {
            return this.guisOfListItems.map(current => current.uiG.countEditableTexts()).reduce((a, b) => a + b, 0);
        }
    }

    async defaultActionOnSubitem(subitem: Entity) {
        let created = await this.entity.getApp().appA.createText('');
        let position : number = this.guisOfListItems.indexOf(subitem) + 1;
        this.entity.list.jsList.splice(position, 0, this.entity.getPath(created));
        await this.entity.update();
        this.entity.getApp().appA.ui.focused = this.guisOfListItems.at(position);
    }
}