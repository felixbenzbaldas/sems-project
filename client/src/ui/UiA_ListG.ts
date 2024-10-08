import type {Entity} from "@/Entity";
import {notNullUndefined} from "@/utils";
import {UiA} from "@/ui/UiA";

export class UiA_ListG {

    uisOfListItems : Array<Entity>;
    htmlElement : HTMLDivElement = document.createElement('div');
    extraObjectForUi: boolean;

    constructor(private entity : Entity) {
    }

    async update() {
        if (this.getObject().collapsible) {
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
                this.htmlElement.appendChild(ui.uiA.htmlElement);
            }
        }
    }

    private async updateUisOfListItems() {
        this.uisOfListItems = []; // TODO: do not always dismiss old uis
        for (let currentResolved of await this.getObject().list.getResolvedList()) {
            let currentUi;
            if (currentResolved.appA?.uiA) {
                currentUi = currentResolved;
            } else {
                if (this.extraObjectForUi) {
                    currentUi = this.entity.getApp().appA.uiA.createUiFor(currentResolved);
                } else {
                    currentUi = currentResolved;
                    currentUi.uiA = new UiA(currentUi);
                }
                currentUi.uiA.editable = this.entity.uiA.editable;
            }
            currentUi.ui_context = this.entity;
            await currentUi.updateUi();
            this.uisOfListItems.push(currentUi);
        }
    }

    getRawText() : string {
        if (notNullUndefined(this.getObject().list)) {
            return this.uisOfListItems.map(current => current.uiA.getRawText()).reduce((a, b) => a + b, '');
        } else {
            return '';
        }
    }

    async click(text : string) {
        if (this.getObject().list) {
            for (let current of this.uisOfListItems) {
                await current.uiA.click(text);
            }
        }
    }

    countEditableTexts() : number {
        if (this.getObject().list) {
            return this.uisOfListItems.map(current => current.uiA.countEditableTexts()).reduce((a, b) => a + b, 0);
        }
    }

    async defaultActionOnSubitem(subitem: Entity) {
        let created = await this.entity.getApp().appA.createText('');
        let position : number = this.uisOfListItems.indexOf(subitem) + 1;
        this.getObject().list.jsList.splice(position, 0, this.getObject().getPath(created));
        await this.entity.updateUi(); // TODO this.getObject().updateUis()
        this.entity.getApp().appA.uiA.focus(this.uisOfListItems.at(position));
    }

    getObject() : Entity {
        return this.entity.uiA.getObject();
    }
}