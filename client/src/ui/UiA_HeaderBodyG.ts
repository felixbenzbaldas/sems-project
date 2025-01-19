import type {Entity} from "@/Entity";
import {notNullUndefined} from "@/utils";

export class UiA_HeaderBodyG {

    constructor(private entity : Entity) {
    }

    async install() {
        let object = this.entity.uiA.getObject();
        if (object.testRunA) {
            await this.entity.uiA.testRunG.install();
            await this.entity.uiA.headerG.update();
            this.entity.uiA.htmlElement.appendChild(this.entity.uiA.headerG.htmlElement);
            await this.entity.uiA.bodyG.update();
            this.entity.uiA.htmlElement.appendChild(this.entity.uiA.bodyG.htmlElement);
            if (!object.testRunA.resultG_success) {
                await this.entity.uiA.ensureExpanded();
            }
        } else {
            await this.entity.uiA.headerG.update();
            this.entity.uiA.htmlElement.appendChild(this.entity.uiA.headerG.htmlElement);
            await this.entity.uiA.bodyG.update();
            this.entity.uiA.htmlElement.appendChild(this.entity.uiA.bodyG.htmlElement);
        }
    }

    async update_addedListItem(position: number) {
        if (this.bodyIsVisible()) {
            await this.entity.uiA.listG.update_addedListItem(position);
        } else {
            await this.entity.uiA.ensureExpanded();
        }
        await this.entity.uiA.headerG.updateBodyIcon();
    }

    async update_removedListItem(position: number) {
        if (await this.hasBodyContent()) {
            await this.entity.uiA.listG.update_removedListItem(position);
        } else {
            await this.entity.uiA.headerG.updateBodyIcon();
            await this.entity.uiA.bodyG.update();
        }
    }

    isUiListInstalled() {
        return notNullUndefined(this.entity.uiA.listG.uisOfListItems);
    }

    async showBody() : Promise<boolean> {
        if (await this.hasBodyContent()) {
            if (this.getObject().collapsible) {
                if (this.entity.uiA.isCollapsed()) {
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

    async hasBodyContent() : Promise<boolean> {
        if (this.getObject().testRunA) {
            return this.entity.uiA.testRunG.hasBodyContent();
        } else if (this.getObject().isTest) {
            return notNullUndefined(this.getObject().test_result);
        } else {
            return await this.entity.uiA.hasContextAsSubitem()  ||
                this.hasAListItem();
        }
    }

    getObject() : Entity {
        return this.entity.uiA.getObject();
    }

    bodyIsVisible() : boolean {
        if (notNullUndefined(this.entity.uiA.bodyG.htmlElement)) {
            return this.entity.uiA.bodyG.htmlElement.style.display !== 'none';
        } else {
            return false;
        }
    }

    hasAListItem() : boolean{
        return this.getObject().listA && this.getObject().listA.jsList.length > 0;
    }
}