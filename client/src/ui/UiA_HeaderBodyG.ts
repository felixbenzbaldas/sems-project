import type {Entity} from "@/Entity";
import {notNullUndefined} from "@/utils";

export class UiA_HeaderBodyG {

    constructor(private entity : Entity) {
    }

    async install() {
        let object = this.entity.uiA.getObject();
        if (object.collapsible) {
            if (object.testRunA) {
                if (object.testRunA.resultG_success) {
                    this.entity.uiA.collapsed = true;
                } else {
                    this.entity.uiA.collapsed = false;
                }
            } else {
                this.entity.uiA.collapsed = true;
            }
        }
        if (object.isTest) {
            await this.entity.uiA.testG.update();
            await this.entity.uiA.headerG.update();
            this.entity.uiA.htmlElement.appendChild(this.entity.uiA.headerG.htmlElement);
            await this.entity.uiA.bodyG.update();
            this.entity.uiA.htmlElement.appendChild(this.entity.uiA.bodyG.htmlElement);
        } else if (object.testRunA) {
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
        if (await this.showBody()) {
            if (!this.isUiListInstalled()) {
                await this.entity.uiA.listG.update();
            }
            await this.entity.uiA.listG.update_addedListItem(position);
        }
        await this.entity.uiA.headerG.updateBodyIcon();
    }

    async update_removedListItem(position: number) {
        if (await this.showBody()) {
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

    async hasBodyContent() : Promise<boolean> {
        if (this.getObject().testRunA) {
            return this.entity.uiA.testRunG.hasBodyContent();
        } else if (this.getObject().isTest) {
            return notNullUndefined(this.getObject().test_result);
        } else {
            if (await this.entity.uiA.hasContextAsSubitem()) {
                return true;
            } else {
                return this.getObject().listA && this.getObject().listA.jsList.length > 0;
            }
        }
    }

    getObject() : Entity {
        return this.entity.uiA.getObject();
    }

    bodyIsVisible() : boolean {
        return this.entity.uiA.bodyG.htmlElement.style.display !== 'none';
    }
}