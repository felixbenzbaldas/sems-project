import type {Entity} from "@/Entity";
import {notNullUndefined} from "@/utils";

export class UiA_HeaderBodyG {

    constructor(private entity : Entity) {
    }

    async install() {
        let object = this.getUiA().getObject();
        if (object.testRunA) {
            await this.getUiA().testRunG.install();
            await this.getUiA().headerG.install();
            this.getUiA().htmlElement.appendChild(this.getUiA().headerG.htmlElement);
            await this.getUiA().bodyG.install();
            this.getUiA().htmlElement.appendChild(this.getUiA().bodyG.htmlElement);
            if (!object.testRunA.resultG_success) {
                await this.getUiA().ensureExpanded();
            }
        } else {
            if (object.relationshipA) {
                this.getUiA().installRelationshipA();
                await this.getUiA().relationshipA.update();
            }
            await this.getUiA().headerG.install();
            this.getUiA().htmlElement.appendChild(this.getUiA().headerG.htmlElement);
            await this.getUiA().bodyG.install();
            this.getUiA().htmlElement.appendChild(this.getUiA().bodyG.htmlElement);
        }
    }

    async update_addedListItem(position: number) {
        if (this.bodyIsVisible()) {
            if (this.getUiA().listA) {
                await this.getUiA().listA.update_addedListItem(position);
            } else {
                await this.getUiA().bodyG.content_update();
            }
        }
        await this.getUiA().headerG.updateBodyIcon();
        await this.getUiA().headerG.updateCursorStyle();
    }

    async update_removedListItem(position: number) {
        if (await this.hasBodyContent()) {
            if (this.bodyIsVisible()) {
                await this.getUiA().listA.update_removedListItem(position);
            }
        } else {
            await this.getUiA().headerG.updateBodyIcon();
            await this.getUiA().headerG.updateCursorStyle();
            await this.getUiA().bodyG.ensureCollapsed();
        }
    }

    async showBody() : Promise<boolean> {
        if (await this.hasBodyContent()) {
            if (this.getObject().collapsible) {
                if (this.getUiA().isCollapsed()) {
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
        if (this.getObject().relationshipA) {
            return true;
        } else if (this.getObject().testRunA) {
            return this.getUiA().testRunG.hasBodyContent();
        } else {
            return await this.getUiA().hasContextAsSubitem()  ||
                this.hasAListItem();
        }
    }

    getObject() : Entity {
        return this.getUiA().getObject();
    }

    bodyIsVisible() : boolean {
        if (notNullUndefined(this.getUiA().bodyG.htmlElement)) {
            return this.getUiA().bodyG.htmlElement.style.display !== 'none';
        } else {
            return false;
        }
    }

    hasAListItem() : boolean{
        return this.getObject().listA && this.getObject().listA.jsList.length > 0;
    }

    async getRawTextOfBody(level: number) {
        let text : string = '';
        let listOfChildren = await this.getUiA().getListOfChildren();
        let textsOfChildren = [];
        for (let i = 0; i < listOfChildren.length; i++) {
            textsOfChildren.push(await listOfChildren[i].textG.getRawText(level));
        }
        if (level === 1) {
            return textsOfChildren.join('\n\n');
        } else {
            return textsOfChildren.join('\n');
        }
    }

    getUiA() {
        return this.entity.uiA;
    }
}