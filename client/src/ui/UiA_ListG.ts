import type {Entity} from "@/Entity";
import {notNullUndefined, nullUndefined} from "@/utils";
import {UiA} from "@/ui/UiA";

// TODO should be an aspect not a group. Then: entity.uiA.getObject().listA <==> entity.uiA.listA
export class UiA_ListG {

    uisOfListItems : Array<Entity>;
    htmlElement : HTMLDivElement = document.createElement('div');

    constructor(private entity : Entity) {
    }

    async update() {
        if (!this.entity.uiA.collapsed) {
            this.htmlElement.innerHTML = null;
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
        this.getObject().listA.jsList.splice(position, 0, this.getObject().getPath(created));
        await this.getObject().uis_update();
        await this.entity.uiA.ensureExpanded();
        this.entity.getApp().appA.uiA.focus(this.uisOfListItems.at(position));
    }

    async pasteNextOnSubitem(subitem: Entity) {
        let position : number = this.uisOfListItems.indexOf(subitem) + 1;
        await this.insertObjectAtPosition(this.entity.getApp().appA.uiA.clipboard, position);
        await this.getObject().uis_update();
        this.entity.getApp().appA.uiA.focus(this.uisOfListItems.at(position));
    }

    getObject() : Entity {
        return this.entity.uiA.getObject();
    }

    // note: always creates extra object for ui
    async insertObjectAtPosition(object: Entity, position: number) : Promise<Entity> {
        await this.getObject().listA.insertObjectAtPosition(object, position);
        let ui = this.entity.getApp().appA.uiA.createUiFor(object);
        if (notNullUndefined(this.uisOfListItems)) { // TODO
            this.uisOfListItems.splice(position, 0, ui);
        }
        ui.uiA.context = this.entity;
        return ui;
    }

    async update_addedListItem(position: number) {
        let ui = this.createUiFor(await this.getObject().listA.getResolved(position));
        this.uisOfListItems.splice(position, 0, ui);
        // TODO update ui
        // TODO update html
    }
}