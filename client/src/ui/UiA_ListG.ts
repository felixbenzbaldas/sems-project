import type {Entity} from "@/Entity";
import {clearElement, notNullUndefined} from "@/utils";
import {UiA} from "@/ui/UiA";

// TODO should be an aspect not a group. Then: entity.uiA.getObject().listA <==> entity.uiA.listA
export class UiA_ListG {

    uisOfListItems : Array<Entity>;
    htmlElement : HTMLDivElement = document.createElement('div');

    constructor(private entity : Entity) {
    }

    async update() {
        if (!this.entity.uiA.collapsed) {
            clearElement(this.htmlElement);
            this.htmlElement.style.display = 'flex';
            this.htmlElement.style.flexWrap = 'wrap';
            this.htmlElement.style.rowGap = '0.25rem';
            await this.updateUisOfListItems();
        }
    }

    private async updateUisOfListItems() {
        this.uisOfListItems = []; // TODO: do not always dismiss old uis
        for (let currentResolved of await this.getObject().listA.getResolvedList()) {
            let currentUi = this.createUiFor(currentResolved);
            await currentUi.updateUi();
            this.uisOfListItems.push(currentUi);
            this.htmlElement.appendChild(currentUi.uiA.htmlElement);
        }
    }

    createUiFor(listItem : Entity) : Entity {
        if (listItem.appA?.uiA) {
            listItem.uiA.context = this.entity;
            return listItem;
        } else {
            let ui;
            ui = this.entity.getApp().appA.uiA.createUiFor(listItem);
            ui.uiA.editable = this.entity.uiA.editable;
            ui.uiA.context = this.entity;
            return ui;
        }
    }

    getRawText() : string {
        if (notNullUndefined(this.getObject().listA)) {
            return this.uisOfListItems.map(current => current.uiA.getRawText()).reduce((a, b) => a + b, '');
        } else {
            return '';
        }
    }

    async click(text : string) {
        if (this.getObject().listA) {
            for (let current of this.uisOfListItems) {
                await current.uiA.click(text);
            }
        }
    }

    countEditableTexts() : number {
        if (this.getObject().listA) {
            return this.uisOfListItems.map(current => current.uiA.countEditableTexts()).reduce((a, b) => a + b, 0);
        }
    }

    async defaultActionOnSubitem(subitem: Entity) {
        let created = await this.entity.getApp().appA.createText('');
        let position : number = this.uisOfListItems.indexOf(subitem) + 1;
        let listA = this.getObject().listA;
        await listA.insertObjectAtPosition(created, position);
        await listA.entity.uis_update_addedListItem(position);
        this.entity.getApp().appA.uiA.focus(this.uisOfListItems.at(position));
    }

    async pasteNextOnSubitem(subitem: Entity) {
        let position : number = this.uisOfListItems.indexOf(subitem) + 1;
        let listA = this.getObject().listA;
        await listA.insertObjectAtPosition(this.entity.getApp().appA.uiA.clipboard, position);
        await listA.entity.uis_update_addedListItem(position);
        this.entity.getApp().appA.uiA.focus(this.uisOfListItems.at(position));
    }

    getObject() : Entity {
        return this.entity.uiA.getObject();
    }

    async update_addedListItem(position: number) {
        let ui = this.createUiFor(await this.getObject().listA.getResolved(position));
        this.uisOfListItems.splice(position, 0, ui);
        await ui.uiA.update();
        if (position + 1 === this.uisOfListItems.length) {
            this.htmlElement.appendChild(ui.uiA.htmlElement);
        } else {
            this.htmlElement.insertBefore(ui.uiA.htmlElement, this.uisOfListItems[position + 1].uiA.htmlElement);
        }
    }

    async update_removedListItem(position: number) {
        let removedUi : Entity = this.uisOfListItems.splice(position, 1)[0];
        this.htmlElement.removeChild(removedUi.uiA.htmlElement);
    }
}