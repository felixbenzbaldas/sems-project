import type {Entity} from "@/Entity";
import {notNullUndefined} from "@/utils";
import type {UiA} from "@/ui/UiA";

export class UiA_BodyG {

    htmlElement : HTMLElement = document.createElement('div');
    content_htmlElement : HTMLElement;

    constructor(private entity: Entity) {
    }

    async update() {
        this.htmlElement.innerHTML = null;
        if (!this.entity.uiA.collapsed && this.hasContent()) {
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
        } else if (this.getObject().listA && !this.getObject().testRunA) {
            await this.getUiA().listG.update();
            this.content_htmlElement = this.getUiA().listG.htmlElement;
        } else if (this.getObject().testRunA) {
            this.content_htmlElement = this.getUiA().testRunG.bodyContent.uiA.htmlElement;
        }
    }

    hasContent() : boolean {
        if (this.getObject().testRunA) {
            return this.getUiA().testRunG.hasBodyContent();
        } else if (this.getObject().isTest) {
            return notNullUndefined(this.getObject().test_result);
        } else {
            return this.getObject().listA && this.getObject().listA.jsList.length > 0;
        }
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