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
        this.htmlElement.innerHTML = null;
        this.htmlElement.style.display = 'flex';
        this.htmlElement.style.flexWrap = 'wrap';
        this.htmlElement.style.rowGap = '0.25rem';
        await this.updateUisOfListItems();
    }

    private async updateUisOfListItems() {
        this.uisOfListItems = []; // TODO: do not always dismiss old uis
        for (let currentResolved of await this.getObject().listA.getResolvedList()) {
            let currentUi = this.createSubUiFor(currentResolved).entity;
            await currentUi.updateUi();
            this.uisOfListItems.push(currentUi);
            this.htmlElement.appendChild(currentUi.uiA.htmlElement);
        }
    }

    createSubUiFor(listItem : Entity) : UiA {
        if (listItem.appA?.uiA) {
            listItem.uiA.context = this.entity;
            return listItem.uiA;
        } else {
            let ui;
            ui = this.entity.uiA.createSubUiFor(listItem);
            return ui;
        }
    }

    async defaultActionOnSubitem(subitem: Entity) {
        let created = await this.entity.getApp().appA.createText('');
        let position : number = this.uisOfListItems.indexOf(subitem) + 1;
        let listA = this.getObject().listA;
        await listA.insertPathOrDirectAtPosition(created, position);
        if (notNullUndefined(this.getObject().text)) {
            created.context = created.getPath(this.getObject());
        }
        await listA.entity.uis_update_addedListItem(position);
        this.entity.uiA.findAppUi().focus(this.uisOfListItems[position]);
    }

    async pasteNextOnSubitem(subitem: Entity) {
        let position : number = this.uisOfListItems.indexOf(subitem) + 1;
        await this.entity.getApp_typed().uiA.insertClipboardAtPosition(this.getObject(), position);
        this.entity.uiA.findAppUi().focus(this.uisOfListItems[position]);
    }

    getObject() : Entity {
        return this.entity.uiA.getObject();
    }

    async update_addedListItem(position: number) {
        let ui = this.createSubUiFor(await this.getObject().listA.getResolved(position)).entity;
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