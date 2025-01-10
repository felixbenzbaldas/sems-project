import type {Entity} from "@/Entity";
import {notNullUndefined, nullUndefined} from "@/utils";
import {UiA} from "@/ui/UiA";

// TODO should be an aspect not a group. Then: entity.uiA.getObject().listA <==> entity.uiA.listA
export class UiA_ListG {

    uisOfListItems : Array<UiA>;
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
            let currentUi = this.createSubUiFor(currentResolved);
            await currentUi.update();
            this.uisOfListItems.push(currentUi);
            this.htmlElement.appendChild(currentUi.htmlElement);
        }
    }

    createSubUiFor(listItem : Entity) : UiA {
        return this.entity.uiA.createSubUiFor(listItem);
    }

    async defaultActionOnSubitem(subitem: UiA) {
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

    async pasteNextOnSubitem(subitem: UiA) {
        let position : number = this.uisOfListItems.indexOf(subitem) + 1;
        await this.entity.getApp_typed().uiA.insertClipboardAtPosition(this.getObject(), position);
        this.entity.uiA.findAppUi().focus(this.uisOfListItems[position]);
    }

    getObject() : Entity {
        return this.entity.uiA.getObject();
    }

    async update_addedListItem(position: number) {
        let ui = this.createSubUiFor(await this.getObject().listA.getResolved(position));
        this.uisOfListItems.splice(position, 0, ui);
        await ui.update();
        if (position + 1 === this.uisOfListItems.length) {
            this.htmlElement.appendChild(ui.htmlElement);
        } else {
            this.htmlElement.insertBefore(ui.htmlElement, this.uisOfListItems[position + 1].htmlElement);
        }
    }

    async update_removedListItem(position: number) {
        let removedUi : UiA = this.uisOfListItems.splice(position, 1)[0];
        this.htmlElement.removeChild(removedUi.htmlElement);
    }
}