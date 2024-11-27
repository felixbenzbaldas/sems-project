import type {Entity} from "@/Entity";
import {notNullUndefined} from "@/utils";
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

    constructor(public entity : Entity) {
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
        if (this.getObject().codeG_html) {
            this.htmlElement.appendChild(this.getObject().codeG_html);
        } else if (this.entity.appA?.uiA) {
            await this.entity.appA.uiA.update();
            this.htmlElement.appendChild(this.entity.appA.uiA.htmlElement);
        } else if (this.isHeaderBody()) {
            await this.headerBodyG.install();
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
        if (this.getObject().codeG_html) {
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
        } else if (this.getObject().testRunA) {
            await this.testRunG.bodyContent.uiA.click(text);
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
            let position = 0;
            let listA = this.getObject().listA;
            await listA.insertObjectAtPosition(created, position);
            await listA.entity.uis_update_addedListItem(position);
            await this.ensureExpanded();
            this.entity.getApp().appA.uiA.focus(this.entity.uiA.listG.uisOfListItems.at(position));
        }
    }

    async cut() {
        this.textG.save();
        let obj = this.getObject();
        this.entity.getApp().appA.uiA.clipboard = obj;
        let uiContext = this.context;
        let uiListItems = uiContext.uiA.listG.uisOfListItems;
        let position = uiListItems.indexOf(this.entity);
        let contextObj = uiContext.getObject();
        if (notNullUndefined(obj.context)) {
            if (await obj.resolve(obj.context) === contextObj) {
                obj.context = null;
                obj.uis_update_context();
            }
        }
        contextObj.listA.jsList.splice(position, 1);
        await contextObj.uis_update_removedListItem(position);
        if (contextObj.listA.jsList.length > 0) {
            let focusPosition = Math.min(uiListItems.length - 1, position);
            this.entity.getApp_typed().uiA.focus(uiListItems[focusPosition]);
        } else {
            this.entity.getApp_typed().uiA.focus(uiContext);
        }
    }

    async paste() {
        if (this.entity.appA?.uiA) {
            await this.entity.appA.uiA.paste();
        } else {
            if (!this.getObject().listA) {
                this.getObject().installListA();
            }
            let position = 0;
            let listA = this.getObject().listA;
            await listA.insertObjectAtPosition(this.entity.getApp().appA.uiA.clipboard, position);
            await listA.entity.uis_update_addedListItem(position);
            await this.ensureExpanded();
            this.entity.getApp().appA.uiA.focus(this.entity.uiA.listG.uisOfListItems.at(position));
        }
    }

    async toggleCollapsible() {
        this.getObject().collapsible = !this.getObject().collapsible;
        this.headerG.updateCursorStyle();
        this.headerG.updateBodyIcon();
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

    async update_addedListItem(position: number) {
        if (this.isHeaderBody()) {
            await this.headerBodyG.update_addedListItem(position);
        } else if (this.isPlainList()) {
            await this.listG.update_addedListItem(position);
        }
    }

    async update_removedListItem(position: number) {
        if (this.isHeaderBody()) {
            await this.headerBodyG.update_removedListItem(position);
        } else if (this.isPlainList()) {
            await this.listG.update_removedListItem(position);
        }
    }

    async update_text() {
        this.textG.update();
    }

    async update_context() {
        await this.headerG.updateContextIcon();
    }

    showContainerMark() {
        return this.getObject().containerMark();
    }
}