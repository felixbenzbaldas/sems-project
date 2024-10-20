import type {Entity} from "@/Entity";
import {notNullUndefined, nullUndefined} from "@/utils";
import {UiA} from "@/ui/UiA";

export class UiA_ListG {

    uisOfListItems : Array<Entity>;
    htmlElement : HTMLDivElement = document.createElement('div');

    constructor(private entity : Entity) {
    }

    async update() {
        if (this.getObject().collapsible) {
            if (nullUndefined(this.entity.uiA.collapsed)) {
                this.entity.uiA.collapsed = true;
            }
        }
        if (!this.entity.uiA.collapsed) {
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
        for (let currentResolved of await this.getObject().listA.getResolvedList()) {
            let currentUi;
            if (currentResolved.appA?.uiA) {
                currentUi = currentResolved;
            } else {
                currentUi = this.entity.getApp().appA.uiA.createUiFor(currentResolved);
                currentUi.uiA.editable = this.entity.uiA.editable;
            }
            currentUi.uiA.context = this.entity;
            await currentUi.updateUi();
            this.uisOfListItems.push(currentUi);
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
}