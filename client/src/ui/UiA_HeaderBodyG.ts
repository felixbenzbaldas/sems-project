import type {Entity} from "@/Entity";

export class UiA_HeaderBodyG {

    constructor(private entity : Entity) {
    }

    async update() {
        if (this.entity.uiA.getObject().collapsible) {
            this.entity.uiA.collapsed = true;
        }
        if (this.entity.uiA.getObject().isTest) {
            await this.entity.uiA.testG.update();
            this.entity.uiA.headerG.update();
            await this.entity.uiA.bodyG.update();
            this.entity.uiA.htmlElement.appendChild(this.entity.uiA.headerG.htmlElement);
            this.entity.uiA.htmlElement.appendChild(this.entity.uiA.bodyG.htmlElement);
        } else if (this.entity.uiA.getObject().testRunA) {
            await this.entity.uiA.testRunG.update();
            this.entity.uiA.headerG.update();
            await this.entity.uiA.bodyG.update();
            this.entity.uiA.htmlElement.appendChild(this.entity.uiA.headerG.htmlElement);
            this.entity.uiA.htmlElement.appendChild(this.entity.uiA.bodyG.htmlElement);
        } else {
            this.entity.uiA.headerG.update();
            await this.entity.uiA.bodyG.update();
            this.entity.uiA.htmlElement.appendChild(this.entity.uiA.headerG.htmlElement);
            this.entity.uiA.htmlElement.appendChild(this.entity.uiA.bodyG.htmlElement);
        }
    }

    getRawText() : string {
        return this.entity.uiA.headerG.getRawText() + this.entity.uiA.bodyG.getRawText();
    }
}