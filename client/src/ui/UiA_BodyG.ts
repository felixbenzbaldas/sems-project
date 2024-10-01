import type {Entity} from "@/Entity";
import {notNullUndefined} from "@/utils";

export class UiA_BodyG {

    htmlElement : HTMLElement = document.createElement('div');
    content_htmlElement : HTMLElement;

    constructor(private entity: Entity) {
    }

    async update() {
        this.htmlElement.innerHTML = null;
        if (!this.entity.collapsed && this.bodyAvailable()) {
            this.htmlElement.hidden = false;
            await this.content_update();
            this.htmlElement.appendChild(this.content_htmlElement);
            this.htmlElement.style.paddingLeft = '0.8rem';
            this.htmlElement.style.paddingTop = '0.2rem';
            this.htmlElement.style.paddingBottom = '0.2rem';
        } else {
            this.htmlElement.hidden = true;
        }
    }

    async content_update() {
        this.content_htmlElement = document.createElement('div');
        if (this.entity.isTest) {
            this.content_htmlElement.appendChild(this.entity.uiA.testG.bodyContent.uiA.htmlElement);
        } else if (this.entity.list && this.entity.list.jsList.length > 0) {
            this.content_htmlElement = this.entity.uiA.listG.htmlElement;
        }
    }

    bodyAvailable() : boolean {
        return notNullUndefined(this.entity.test_result) ||
            this.entity.list && this.entity.list.jsList.length > 0;
    }

    async expand() {
        await this.update();
    }

    async collapse() {
        await this.update();
    }
}