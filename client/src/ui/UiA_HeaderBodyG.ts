import type {Entity} from "@/Entity";
import {notNullUndefined} from "@/utils";

export class UiA_HeaderBodyG {

    constructor(private entity : Entity) {
    }

    async install() {
        let object = this.entity.uiA.getObject();
        if (object.testRunA) {
            await this.entity.uiA.testRunG.install();
            await this.entity.uiA.headerG.install();
            this.entity.uiA.htmlElement.appendChild(this.entity.uiA.headerG.htmlElement);
            await this.entity.uiA.bodyG.install();
            this.entity.uiA.htmlElement.appendChild(this.entity.uiA.bodyG.htmlElement);
            if (!object.testRunA.resultG_success) {
                await this.entity.uiA.ensureExpanded();
            }
        } else {
            await this.entity.uiA.headerG.install();
            this.entity.uiA.htmlElement.appendChild(this.entity.uiA.headerG.htmlElement);
            await this.entity.uiA.bodyG.install();
            this.entity.uiA.htmlElement.appendChild(this.entity.uiA.bodyG.htmlElement);
        }
    }

    async update_addedListItem(position: number) {
        if (this.bodyIsVisible()) {
            if (this.entity.uiA.listA) {
                await this.entity.uiA.listA.update_addedListItem(position);
            } else {
                await this.entity.uiA.bodyG.content_update();
            }
        }
        await this.entity.uiA.headerG.updateBodyIcon();
        await this.entity.uiA.headerG.updateCursorStyle();
    }

    async update_removedListItem(position: number) {
        if (await this.hasBodyContent()) {
            if (this.bodyIsVisible()) {
                await this.entity.uiA.listA.update_removedListItem(position);
            }
        } else {
            await this.entity.uiA.headerG.updateBodyIcon();
            await this.entity.uiA.headerG.updateCursorStyle();
            await this.entity.uiA.bodyG.ensureCollapsed();
        }
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

    async getRawTextOfBody(level: number) {
        let text : string = '';
        let listOfChildren = await this.entity.uiA.getListOfChildren();
        let textsOfChildren = [];
        for (let i = 0; i < listOfChildren.length; i++) {
            textsOfChildren.push(await listOfChildren[i].textG.getRawTextOfTree(level));
        }
        return textsOfChildren.join('\n');
    }
}