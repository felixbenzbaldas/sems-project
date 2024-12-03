import type {Entity} from "@/Entity";
import {notNullUndefined, textElem} from "@/utils";
import type {UiA} from "@/ui/UiA";

// TODO the body aspect should only exist if showBody === true
export class UiA_BodyG {

    htmlElement : HTMLElement = document.createElement('div');
    content_htmlElement : HTMLElement;

    constructor(private entity: Entity) {
    }

    async update() {
        this.htmlElement.innerHTML = null;
        if (!this.entity.uiA.collapsed && await this.getUiA().headerBodyG.hasBodyContent()) {
            this.htmlElement.style.display = 'block';
            await this.content_update();
            this.htmlElement.appendChild(this.content_htmlElement);
            this.htmlElement.style.paddingLeft = '0.8rem';
            this.htmlElement.style.paddingTop = '0.2rem';
            this.htmlElement.style.paddingBottom = '0.2rem';
        } else {
            this.htmlElement.style.display = 'none';
        }
    }

    async content_update() {
        this.content_htmlElement = document.createElement('div');
        if (this.getObject().isTest) {
            this.content_htmlElement.appendChild(this.getUiA().testG.bodyContent.uiA.htmlElement);
        } else if (this.getObject().testRunA) {
            this.content_htmlElement = this.getUiA().testRunG.bodyContent.uiA.htmlElement;
        } else {
            if (await this.getUiA().hasContextAsSubitem()) {
                this.content_htmlElement.appendChild(await this.createContextAsSubitem());
            }
            if (this.getObject().listA && !this.getObject().testRunA) {
                await this.getUiA().listG.update();
                this.content_htmlElement.appendChild(this.getUiA().listG.htmlElement);
            }
        }
    }

    async createContextAsSubitem() : Promise<HTMLElement> {
        let contextObj = await this.getObject().deprecated_resolve(this.getObject().context);
        let contextAsSubitem = this.entity.getApp_typed().unboundG.createTextWithList('[context]', contextObj);
        contextAsSubitem.collapsible = true;
        contextAsSubitem.editable = false;
        let ui = this.entity.getApp_typed().uiA.createUiFor_typed(contextAsSubitem);
        ui.editable = this.getUiA().editable;
        await ui.update()
        ui.htmlElement.style.marginBottom = '0.1rem';
        ui.headerG.htmlElement.style.color = 'grey';
        return ui.htmlElement;
    }

    getUiA() : UiA {
        return this.entity.uiA;
    }

    getObject() : Entity {
        if (this.getUiA().object) {
            return this.getUiA().object;
        } else {
            return this.entity;
        }
    }

    getRawText() : string {
        if (this.getObject().isTest) {
            return this.getUiA().testG.bodyContent.uiA.getRawText();
        } else if (this.getObject().listA && !this.getObject().testRunA) {
            if (this.getUiA().collapsed) {
                return '';
            } else {
                return this.getUiA().listG.getRawText();
            }
        } else if (this.getObject().testRunA) {
            if (this.getUiA().testRunG.bodyContent) {
                return this.getUiA().testRunG.bodyContent.uiA.getRawText();
            }
        }
        return '';
    }
}