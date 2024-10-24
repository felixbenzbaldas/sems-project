import type {Entity} from "@/Entity";
import {notNullUndefined} from "@/utils";
import {UiA_ListG} from "@/ui/UiA_ListG";
import {UiA_TextG} from "@/ui/UiA_TextG";
import {UiA_BodyG} from "@/ui/UiA_BodyG";
import {UiA_HeaderG} from "@/ui/UiA_HeaderG";
import {UiA_TestG} from "@/ui/UiA_TestG";
import {ListA} from "@/ListA";

export class UiA {

    editable: boolean;
    htmlElement : HTMLElement = document.createElement('div');
    listG: UiA_ListG;
    textG : UiA_TextG;
    headerG : UiA_HeaderG;
    bodyG: UiA_BodyG;
    testG: UiA_TestG;
    object: Entity;
    context: Entity;
    collapsed: boolean;

    constructor(private entity : Entity) {
        this.listG = new UiA_ListG(entity);
        this.textG = new UiA_TextG(entity);
        this.headerG = new UiA_HeaderG(entity);
        this.bodyG = new UiA_BodyG(entity);
        this.testG = new UiA_TestG(entity);
    }

    async update() {
        if (!this.getObject().hidden && !this.getObject().dangerous_html) {
            if (this.entity.appA?.uiA) {
                await this.entity.appA.uiA.update();
            } else {
                if (this.getObject().isTest) {
                    await this.testG.update();
                }
                if (this.getObject().listA) {
                    await this.listG.update();
                }
                if (notNullUndefined(this.getObject().text)) {
                    this.textG.update();
                }
                this.headerG.update();
                await this.bodyG.update();
            }
        }
        await this.updateUiElement();
        this.entity.log('ui_updated');
    }

    private async updateUiElement() {
        this.htmlElement.innerHTML = null;
        if (!this.getObject().hidden) {
            if (this.entity.appA?.uiA) {
                this.htmlElement.appendChild(this.entity.appA.uiA.htmlElement);
            } else if (this.headerG.headerAvailable()) {
                this.htmlElement.appendChild(this.headerG.htmlElement);
                this.htmlElement.appendChild(this.bodyG.htmlElement);
            } else if (this.getObject().listA && this.collapsed != true) {
                this.htmlElement.appendChild(this.listG.htmlElement);
            } else if (this.getObject().dangerous_html) {
                this.htmlElement.appendChild(this.getObject().dangerous_html);
            } else {
                let div = document.createElement('div');
                div.innerText = this.getObject().getDescription();
                this.htmlElement.appendChild(div);
            }
        }
    }

    isEditable() {
        if (notNullUndefined(this.editable)) {
            if (notNullUndefined(this.getObject().editable)) {
                if (this.editable == true) {
                    return this.getObject().editable;
                } else {
                    return false;
                }
            } else {
                return this.editable;
            }
        } else {
            if (notNullUndefined(this.getObject().editable)) {
                return this.getObject().editable;
            } else {
                return false;
            }
        }
    }

    getRawText() : string {
        this.entity.log('getRawText');
        if (!this.getObject().hidden) {
            if (this.entity.appA?.uiA) {
                return this.entity.appA.uiA.getRawText();
            } else if (notNullUndefined(this.getObject().link)) {
                return this.headerG.link_getText();
            } else if (notNullUndefined(this.getObject().testRunG_resultG_success)) {
                return this.getObject().testRunG_test.name;
            } else {
                if (this.getObject().isTest) {
                    return this.testG.getRawText();
                } else {
                    let rawText = '';
                    if (notNullUndefined(this.getObject().text)) {
                        rawText += this.getObject().text;
                    }
                    if (this.getObject().listA && this.collapsed != true) {
                        rawText += this.listG.getRawText();
                    }
                    return rawText;
                }
            }
        }
        return '';
    }

    getObject() : Entity {
        if (this.object) {
            return this.object;
        } else {
            return this.entity;
        }
    }

    async click(text : string) {
        this.entity.log('click ' + text);
        if (!this.getObject().hidden) {
            if (this.entity.appA?.uiA) {
                await this.entity.appA.uiA.click(text);
            } else if (this.getObject().isTest) {
                await this.testG.click(text);
            } else if (this.getObject().action) {
                if (this.getObject().text.includes(text)) {
                    await this.getObject().action();
                }
            } else if (notNullUndefined(this.getObject().text)) {
                if (this.getObject().text.includes(text)) {
                    if (this.isEditable()) {
                        this.entity.getApp().appA.uiA.focus(this.entity);
                    } else {
                        await this.headerG.clickEvent();
                    }
                }
                if (!this.collapsed && this.bodyG.bodyAvailable()) {
                    await this.listG.click(text);
                }
            } else if (this.getObject().listA) {
                await this.listG.click(text);
            }
        }
    }

    countEditableTexts() : number {
        this.entity.log('countEditableTexts');
        if (!this.getObject().hidden) {
            if (this.entity.appA?.uiA) {
                return this.entity.appA.uiA.countEditableTexts();
            } else {
                let counter = 0;
                if (notNullUndefined(this.getObject().text)) {
                    if (this.isEditable()) {
                        counter++;
                    }
                }
                if (this.getObject().listA && !this.collapsed) {
                    counter += this.listG.countEditableTexts();
                }
                return counter;
            }
        }
        return 0;
    }

    updateFocusStyle() {
        if (this.entity.appA?.uiA) {
            this.entity.appA.uiA.focusStyle_update();
        } else {
            this.headerG.focusStyle_update();
        }
    }

    takeCaret() {
        if (!this.entity.appA) {
            if (notNullUndefined(this.getObject().text)) {
                this.textG.takeCaret();
            }
        }
    }

    hasFocus() {
        return this.entity.getApp().appA.uiA.focused === this.entity;
    }

    async defaultAction() {
        if (this.entity.appA?.uiA) {
            await this.entity.appA.uiA.newSubitem();
        } else if (this.entity.action) {
            throw 'not implemented yet';
        } else {
            await this.context.uiA.defaultActionOnSubitem(this.entity);
        }
    }

    async defaultActionOnSubitem(subitem : Entity) {
        await this.listG.defaultActionOnSubitem(subitem);
    }

    async pasteNextOnSubitem(subitem: Entity) {
        await this.listG.pasteNextOnSubitem(subitem);
    }

    async newSubitem() {
        this.entity.log('newSubitem');
        if (this.entity.appA?.uiA) {
            await this.entity.appA.uiA.newSubitem();
        } else {
            if (!this.getObject().listA) {
                this.getObject().installListA();
            }
            let created = await this.entity.getApp().appA.createText('');
            await this.listG.insertObjectAtPosition(created, 0);
            await this.update(); // TODO update in insertObjectAtPosition (without deleting old uis)
                                 // TODO update all uis
            this.entity.getApp().appA.uiA.focus(this.listG.uisOfListItems.at(0));
        }
    }

    async toggleCollapsible() {
        this.getObject().collapsible = !this.getObject().collapsible;
        this.collapsed = false;
        await this.update();
    }

    async expandOrCollapse() {
        if (this.getObject().collapsible) {
            if (this.collapsed) {
                await this.expand();
            } else {
                await this.collapse();
            }
        } else {
            this.entity.log('warning: not collapsible!');
        }
    }

    async expand() {
        if (this.getObject().listA?.jsList.length > 0) {
            this.collapsed = false;
            this.headerG.updateBodyIcon();
            await this.listG.update();
            await this.bodyG.expand();
        }
    }

    async collapse() {
        this.collapsed = true;
        this.headerG.updateBodyIcon();
        await this.bodyG.collapse();
    }
}