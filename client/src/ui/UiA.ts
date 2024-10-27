import type {Entity} from "@/Entity";
import {notNullUndefined, nullUndefined} from "@/utils";
import {UiA_ListG} from "@/ui/UiA_ListG";
import {UiA_TextG} from "@/ui/UiA_TextG";
import {UiA_BodyG} from "@/ui/UiA_BodyG";
import {UiA_HeaderG} from "@/ui/UiA_HeaderG";
import {UiA_TestG} from "@/ui/UiA_TestG";
import {UiA_HeaderBodyG} from "@/ui/UiA_HeaderBodyG";
import {UiA_TestRunG} from "@/ui/UiA_TestRunG";

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
    headerBodyG: UiA_HeaderBodyG;
    testRunG: UiA_TestRunG;

    constructor(private entity : Entity) {
        this.headerBodyG = new UiA_HeaderBodyG(entity);
        this.listG = new UiA_ListG(entity);
        this.textG = new UiA_TextG(entity);
        this.headerG = new UiA_HeaderG(entity);
        this.bodyG = new UiA_BodyG(entity);
        this.testG = new UiA_TestG(entity);
        this.testRunG = new UiA_TestRunG(entity);
    }

    async update() {
        this.resetHtmlElement();
        if (this.getObject().dangerous_html) {
            this.htmlElement.appendChild(this.getObject().dangerous_html);
        } else if (this.entity.appA?.uiA) {
            await this.entity.appA.uiA.update();
            this.htmlElement.appendChild(this.entity.appA.uiA.htmlElement);
        } else if (this.isHeaderBody()) {
            await this.headerBodyG.update();
        } else if (this.isPlainList()) {
            await this.entity.uiA.listG.update();
            this.entity.uiA.htmlElement.appendChild(this.entity.uiA.listG.htmlElement);
        } else {
            let div = document.createElement('div');
            div.innerText = this.getObject().getDescription();
            this.htmlElement.appendChild(div);
        }
    }

    resetHtmlElement() {
        this.htmlElement.innerHTML = null;
    }

    isHeaderBody() : boolean {
        return this.getObject().isTest ||
            notNullUndefined(this.getObject().action) ||
            notNullUndefined(this.getObject().link) ||
            notNullUndefined(this.getObject().text) ||
            notNullUndefined(this.getObject().testRunA);
    }

    isPlainList() {
        return this.entity.uiA.getObject().listA && !this.isHeaderBody();
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
        if (this.getObject().dangerous_html) {
            return '';
        } else if (this.entity.appA?.uiA) {
            return this.entity.appA.uiA.getRawText();
        } else if (this.isHeaderBody()) {
            return this.headerBodyG.getRawText();
        } else if (this.isPlainList()) {
            return this.listG.getRawText();
        } else {
            return this.getObject().getDescription();
        }
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
            if (!this.collapsed && this.bodyG.hasContent()) {
                await this.listG.click(text);
            }
        } else if (this.getObject().listA) {
            await this.listG.click(text);
        }
    }

    countEditableTexts() : number {
        this.entity.log('countEditableTexts');
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
            await this.ensureExpanded();
            this.entity.getApp().appA.uiA.focus(this.listG.uisOfListItems.at(0));
        }
    }

    async toggleCollapsible() {
        this.getObject().collapsible = !this.getObject().collapsible;
        await this.ensureExpanded();
    }

    async expandOrCollapse() {
        if (this.getObject().collapsible) {
            if (this.collapsed) {
                await this.ensureExpanded();
            } else {
                await this.ensureCollapsed();
            }
        } else {
            this.entity.log('warning: not collapsible!');
        }
    }

    async ensureExpanded() {
        if (this.getObject().listA?.jsList.length > 0) {
            this.collapsed = false;
            this.headerG.updateBodyIcon();
            await this.listG.update();
            await this.bodyG.update();
        }
    }

    async ensureCollapsed() {
        this.collapsed = true;
        this.headerG.updateBodyIcon();
        await this.bodyG.update();
    }
}