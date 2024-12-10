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
            this.htmlElement.style.height = '100%';
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
            if (!this.collapsed && await this.headerBodyG.hasBodyContent()) {
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
            await listA.insertPathOrDirectAtPosition(created, position);
            created.context = created.getPath(this.getObject());
            await listA.entity.uis_update_addedListItem(position);
            await this.ensureExpanded();
            this.entity.getApp().appA.uiA.focus(this.entity.uiA.listG.uisOfListItems.at(position));
        }
    }

    async mark() {
        let appUi = this.entity.getApp_typed().uiA;
        this.textG.save();
        appUi.clipboard = this.getObject();
        appUi.clipboard_lostContext = false;
        appUi.signal('marked: ' + appUi.clipboard.getShortDescription());
    }

    async cut() {
        let appUi = this.entity.getApp_typed().uiA;
        this.textG.save();
        let obj = this.getObject();
        appUi.clipboard = obj;
        let uiContext = this.context;
        let uiListItems = uiContext.uiA.listG.uisOfListItems;
        let position = uiListItems.indexOf(this.entity);
        let contextObj = uiContext.getObject();
        if (this.objectHasContext() && await this.inContext()) {
            obj.context = null;
            appUi.clipboard_lostContext = true;
            await obj.uis_update_context();
        } else {
            appUi.clipboard_lostContext = false;
        }
        contextObj.listA.jsList.splice(position, 1);
        await contextObj.uis_update_removedListItem(position);
        if (contextObj.listA.jsList.length > 0) {
            let focusPosition = Math.min(uiListItems.length - 1, position);
            appUi.focus(uiListItems[focusPosition]);
        } else {
            appUi.focus(uiContext);
        }
    }

    async paste() {
        if (this.entity.appA?.uiA) {
            await this.entity.appA.uiA.paste();
        } else {
            if (!this.getObject().listA) {
                this.getObject().installListA();
            }
            let appUi = this.entity.getApp_typed().uiA;
            let position = 0;
            await appUi.insertClipboardAtPosition(this.getObject(), position);
            await this.ensureExpanded();
            appUi.focus(this.entity.uiA.listG.uisOfListItems.at(position));
        }
    }

    async toggleCollapsible() {
        this.getObject().collapsible = !this.getObject().collapsible;
        await this.getObject().uis_update_collapsible();
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
        if (!this.headerBodyG.bodyIsVisible()) {
            this.collapsed = false;
            await this.headerG.updateBodyIcon();
            await this.bodyG.update();
        }
    }

    async ensureCollapsed() {
        this.collapsed = true;
        await this.headerG.updateBodyIcon();
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
        await this.textG.update();
    }

    async update_collapsible() {
        await this.headerG.updateCursorStyle();
        await this.headerG.updateBodyIcon();
        if (!this.getObject().collapsible) {
            await this.ensureExpanded();
        }
    }

    async update_context() {
        await this.headerG.updateContextIcon();
        await this.headerG.updateBodyIcon();
        await this.headerG.updateCursorStyle();
        if (this.headerBodyG.bodyIsVisible()) {
            if (await this.headerBodyG.hasBodyContent()) {
                await this.bodyG.updateContextAsSubitem();
            } else {
                await this.ensureCollapsed();
            }
        } else {
            if (await this.headerBodyG.showBody()) {
                await this.ensureExpanded();
            }
        }
    }

    showContainerMark() {
        if (this.entity.getApp().appA.environment.url?.hostname === 'localhost') {
            return this.getObject().containerMark();
        } else {
            return false;
        }
    }

    objectHasContext() : boolean {
        return notNullUndefined(this.getObject().context);
    }

    // check objectHasContext() before calling this method
    async inContext() : Promise<boolean> {
        if (notNullUndefined(this.context)) {
            return this.context.uiA.getObject() === await this.getObject().context.pathA.resolve();
        } else {
            return false;
        }
    }

    async hasContextAsSubitem() : Promise<boolean> {
        return this.objectHasContext() && !await this.inContext();
    }

    async toggleContext() {
        if (this.getObject().context) {
            this.getObject().context = undefined;
        } else {
            this.getObject().context = this.getObject().getPath(this.context.uiA.getObject());
        }
        await this.getObject().uis_update_context();
    }

    async pasteNext() {
        await this.context.uiA.pasteNextOnSubitem(this.entity);
    }

    getUrl() : string {
        let app = this.entity.getApp_typed();
        let pathAsString = app.entity.getPath(this.getObject()).pathA.asString();
        return app.environment.url.origin + '/?path=' + pathAsString;
    }

    async showMeta() {
        this.bodyG.showMeta();
    }

    metaIsDisplayed() {
        return this.bodyG.content_meta_htmlElement.innerHTML !== '';
    }
}