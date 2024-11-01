import type {Entity} from "@/Entity";
import {notNullUndefined} from "@/utils";

export class UiA_HeaderBodyG {

    constructor(private entity : Entity) {
    }

    async install() {
        if (this.entity.uiA.getObject().collapsible) {
            this.entity.uiA.collapsed = true;
        }
        if (this.entity.uiA.getObject().isTest) {
            await this.entity.uiA.testG.update();
            this.entity.uiA.headerG.update();
            this.entity.uiA.htmlElement.appendChild(this.entity.uiA.headerG.htmlElement);
            await this.entity.uiA.bodyG.update();
            this.entity.uiA.htmlElement.appendChild(this.entity.uiA.bodyG.htmlElement);
        } else if (this.entity.uiA.getObject().testRunA) {
            await this.entity.uiA.testRunG.update();
            this.entity.uiA.headerG.update();
            this.entity.uiA.htmlElement.appendChild(this.entity.uiA.headerG.htmlElement);
            await this.entity.uiA.bodyG.update();
            this.entity.uiA.htmlElement.appendChild(this.entity.uiA.bodyG.htmlElement);
        } else {
            this.entity.uiA.headerG.update();
            this.entity.uiA.htmlElement.appendChild(this.entity.uiA.headerG.htmlElement);
            await this.entity.uiA.bodyG.update();
            this.entity.uiA.htmlElement.appendChild(this.entity.uiA.bodyG.htmlElement);
        }
    }

    getRawText() : string {
        return this.entity.uiA.headerG.getRawText() + this.entity.uiA.bodyG.getRawText();
    }

    async update_addedListItem(position: number) {
        if (this.showBody()) {
            if (!this.isUiListInstalled()) {
                await this.entity.uiA.listG.update();
            }
            await this.entity.uiA.listG.update_addedListItem(position);
        }
        this.entity.uiA.headerG.updateBodyIcon();
    }

    isUiListInstalled() {
        return notNullUndefined(this.entity.uiA.listG.uisOfListItems);
    }

    showBody() : boolean {
        if (this.entity.uiA.getObject().collapsible) {
            if (this.entity.uiA.collapsed) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }
}