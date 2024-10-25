import {notNullUndefined, nullUndefined} from "@/utils";
import type {Entity} from "@/Entity";

export class UiA_HeaderBodyG {

    constructor(private entity : Entity) {
    }

    async update() {
        if (this.entity.uiA.getObject().isTest) {
            await this.entity.uiA.testG.update();
            this.entity.uiA.headerG.update();
            await this.entity.uiA.bodyG.update();
            this.entity.uiA.htmlElement.appendChild(this.entity.uiA.headerG.htmlElement);
            this.entity.uiA.htmlElement.appendChild(this.entity.uiA.bodyG.htmlElement);
        } else if (this.isTextWithList()) {
            this.entity.uiA.headerG.update();
            await this.entity.uiA.bodyG.update();
            this.entity.uiA.htmlElement.appendChild(this.entity.uiA.headerG.htmlElement);
            this.entity.uiA.htmlElement.appendChild(this.entity.uiA.bodyG.htmlElement);
        } else if (this.isPlainText()) {
            this.entity.uiA.headerG.update();
            await this.entity.uiA.bodyG.update();
            this.entity.uiA.htmlElement.appendChild(this.entity.uiA.headerG.htmlElement);
            this.entity.uiA.htmlElement.appendChild(this.entity.uiA.bodyG.htmlElement);
        } else if (this.entity.uiA.getObject().testRunA) {
            this.entity.uiA.headerG.update();
            await this.entity.uiA.bodyG.update();
            this.entity.uiA.htmlElement.appendChild(this.entity.uiA.headerG.htmlElement);
            this.entity.uiA.htmlElement.appendChild(this.entity.uiA.bodyG.htmlElement);
        }
    }

    isPlainText() {
        return notNullUndefined(this.entity.uiA.getObject().text) && !this.entity.uiA.getObject().listA;
    }

    isTextWithList() {
        return notNullUndefined(this.entity.uiA.getObject().text) && this.entity.uiA.getObject().listA;
    }
}