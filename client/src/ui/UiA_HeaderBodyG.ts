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
            await this.entity.uiA.headerG.update();
            this.entity.uiA.htmlElement.appendChild(this.entity.uiA.headerG.htmlElement);
            await this.entity.uiA.bodyG.update();
            this.entity.uiA.htmlElement.appendChild(this.entity.uiA.bodyG.htmlElement);
        } else if (this.entity.uiA.getObject().testRunA) {
            await this.entity.uiA.testRunG.update();
            await this.entity.uiA.headerG.update();
            this.entity.uiA.htmlElement.appendChild(this.entity.uiA.headerG.htmlElement);
            await this.entity.uiA.bodyG.update();
            this.entity.uiA.htmlElement.appendChild(this.entity.uiA.bodyG.htmlElement);
        } else {
            await this.entity.uiA.headerG.update();
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

    async update_removedListItem(position: number) {
        if (this.showBody()) {
            await this.entity.uiA.listG.update_removedListItem(position);
        } else {
            this.entity.uiA.headerG.updateBodyIcon();
            await this.entity.uiA.bodyG.update();
        }
    }

    isUiListInstalled() {
        return notNullUndefined(this.entity.uiA.listG.uisOfListItems);
    }

    showBody() : boolean {
        if (this.hasBodyContent()) {
            if (this.getObject().collapsible) {
                if (this.entity.uiA.collapsed) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    hasBodyContent() : boolean {
        if (this.getObject().testRunA) {
            return this.entity.uiA.testRunG.hasBodyContent();
        } else if (this.getObject().isTest) {
            return notNullUndefined(this.getObject().test_result);
        } else {
            return this.getObject().listA && this.getObject().listA.jsList.length > 0;
        }
    }

    getObject() : Entity {
        return this.entity.uiA.getObject();
    }
}