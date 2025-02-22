import type {Entity} from "@/Entity";
import {div, notNullUndefined, nullUndefined} from "@/utils";
import {UiA} from "@/ui/UiA";

export class UiA_ListA {

    elements : Array<UiA>;
    htmlElement : HTMLDivElement = div();

    constructor(private entity : Entity) {
        this.htmlElement.style.display = 'flex';
        this.htmlElement.style.flexWrap = 'wrap';
        this.htmlElement.style.rowGap = '0.25rem';
    }

    async update() {
        this.htmlElement.innerHTML = null;
        if (this.entity.uiA.object) {
            await this.updateElementsFromObject();
        }
        for (let ui of this.elements) {
            this.htmlElement.appendChild(ui.htmlElement);
        }
    }

    private async updateElementsFromObject() {
        this.elements = [];
        for (let currentResolved of await this.getObject().listA.getResolvedList()) {
            let currentUi = await this.createSubUiFor(currentResolved);
            this.elements.push(currentUi);
        }
    }

    async createSubUiFor(listItem : Entity) : Promise<UiA> {
        return this.entity.uiA.createSubUiFor_transmitEditability(listItem);
    }

    async defaultActionOnSubitem(subitem: UiA) {
        let created = await subitem.getObject().findContainer().createText('');
        let position : number = this.elements.indexOf(subitem) + 1;
        let listA = this.getObject().listA;
        await listA.insertPathOrDirectAtPosition(created, position);
        if (notNullUndefined(this.getObject().text)) {
            created.context = created.getPath(this.getObject());
        }
        await listA.entity.uis_update_addedListItem(position);
        this.entity.uiA.findAppUi().focus(this.elements[position]);
        this.entity.uiA.findAppUi().focused.enterEditMode();
    }

    async pasteNextOnSubitem(subitem: UiA) {
        let position : number = this.elements.indexOf(subitem) + 1;
        await this.entity.getApp_typed().uiA.insertClipboardAtPosition(this.getObject(), position);
        this.entity.uiA.findAppUi().focus(this.elements[position]);
    }

    getObject() : Entity {
        return this.entity.uiA.getObject();
    }

    async update_addedListItem(position: number) {
        let ui = await this.createSubUiFor(await this.getObject().listA.getResolved(position));
        this.elements.splice(position, 0, ui);
        if (position + 1 === this.elements.length) {
            this.htmlElement.appendChild(ui.htmlElement);
        } else {
            this.htmlElement.insertBefore(ui.htmlElement, this.elements[position + 1].htmlElement);
        }
    }

    async update_removedListItem(position: number) {
        let removedUi : UiA = this.elements.splice(position, 1)[0];
        this.htmlElement.removeChild(removedUi.htmlElement);
    }
}