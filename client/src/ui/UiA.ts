import type {Entity} from "@/Entity";
import {notNullUndefined, nullUndefined} from "@/utils";
import {UiA_ListG} from "@/ui/UiA_ListG";
import {UiA_TextG} from "@/ui/UiA_TextG";
import {UiA_BodyG} from "@/ui/UiA_BodyG";
import {UiA_HeaderG} from "@/ui/UiA_HeaderG";
import {UiA_TestG} from "@/ui/UiA_TestG";
import {UiA_HeaderBodyG} from "@/ui/UiA_HeaderBodyG";
import {UiA_TestRunG} from "@/ui/UiA_TestRunG";
import {UiA_AppA} from "@/ui/UiA_AppA";

export class UiA {

    editable: boolean;
    htmlElement : HTMLElement = document.createElement('div');
    listG: UiA_ListG;
    textG : UiA_TextG;
    headerG : UiA_HeaderG;
    bodyG: UiA_BodyG;
    testG: UiA_TestG;
    object: Entity;
    context: UiA;
    headerBodyG: UiA_HeaderBodyG;
    testRunG: UiA_TestRunG;
    appA : UiA_AppA;

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
        } else if (this.getObject().appA) {
            this.htmlElement.innerText = "type: application";
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

    getObject() : Entity {
        if (this.object) {
            return this.object;
        } else {
            return this.entity;
        }
    }

    updateFocusStyle() {
        if (this.appA) {
            this.appA.focusStyle_update();
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
        return this.findAppUi()?.focused === this;
    }

    async defaultAction() {
        if (this.appA) {
            await this.appA.newSubitem();
        } else {
            await this.context.defaultActionOnSubitem(this);
        }
    }

    async defaultActionOnSubitem(subitem : UiA) {
        await this.listG.defaultActionOnSubitem(subitem);
    }

    async pasteNextOnSubitem(subitem: UiA) {
        await this.listG.pasteNextOnSubitem(subitem);
    }

    async newSubitem() {
        this.entity.log('newSubitem');
        if (this.appA) {
            await this.appA.newSubitem();
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
            this.findAppUi().focus(this.entity.uiA.listG.uisOfListItems.at(position));
        }
    }

    async mark() {
        let appUi = this.entity.getApp_typed().uiA;
        this.textG.save();
        appUi.clipboard = this.getObject();
        appUi.clipboard_lostContext = false; // important!
        this.findAppUi().signal('marked: ' + appUi.clipboard.getShortDescription());
    }

    async cut() {
        let appA_uiA = this.entity.getApp_typed().uiA;
        if (nullUndefined(this.getObject().link)) {
            this.textG.save(); // important!
        }
        let obj = this.getObject();
        appA_uiA.clipboard = obj;
        let uiContext = this.context;
        let uiListItems = uiContext.listG.uisOfListItems;
        let position = uiListItems.indexOf(this);
        let uiContextObj = uiContext.getObject();
        if (this.objectHasContext() && await this.inContext()) {
            obj.context = null;
            appA_uiA.clipboard_lostContext = true;
            await obj.uis_update_context();
        } else {
            appA_uiA.clipboard_lostContext = false; // important!
        }
        uiContextObj.listA.jsList.splice(position, 1);
        await uiContextObj.uis_update_removedListItem(position);
        if (uiContextObj.listA.jsList.length > 0) {
            let focusPosition = Math.min(uiListItems.length - 1, position);
            this.findAppUi().focus(uiListItems[focusPosition]);
        } else {
            this.findAppUi().focus(uiContext);
        }
    }

    async paste() {
        if (!this.getObject().listA) {
            this.getObject().installListA();
        }
        let appUi = this.entity.getApp_typed().uiA;
        let position = 0;
        await appUi.insertClipboardAtPosition(this.getObject(), position);
        await this.ensureExpanded();
        this.findAppUi().focus(this.entity.uiA.listG.uisOfListItems[position]);
    }

    async toggleCollapsible() {
        this.getObject().collapsible = !this.getObject().collapsible;
        await this.getObject().uis_update_collapsible();
    }

    async expandOrCollapse() {
        if (this.getObject().collapsible) {
            if (this.isCollapsed()) {
                if (await this.headerBodyG.hasBodyContent()) {
                    await this.expandWithAnimation();
                }
            } else {
                this.collapseWithAnimation();
            }
        } else {
            this.entity.log('warning: not collapsible!');
        }
    }

    collapseWithAnimation() {
        let promise = this.bodyG.collapseWithAnimation();
        promise.then(async () => {
            await this.headerG.updateBodyIcon();
        });
    }

    async expandWithAnimation() {
        let promise = this.bodyG.expandWithAnimation();
        await this.headerG.updateBodyIcon();
    }

    async ensureExpanded() {
        if (!this.headerBodyG.bodyIsVisible()) {
            await this.bodyG.displayBody();
            await this.headerG.updateBodyIcon();
        }
    }

    async ensureCollapsed() {
        await this.bodyG.ensureCollapsed();
        await this.headerG.updateBodyIcon();
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
            if (await this.hasContextAsSubitem()) {
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
            return this.context.getObject() === await this.getObject().context.resolve();
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
            this.getObject().context = this.getObject().getPath(this.context.getObject());
        }
        await this.getObject().uis_update_context();
    }

    async pasteNext() {
        await this.context.pasteNextOnSubitem(this);
    }

    async showMeta() {
        await this.ensureExpanded();
        await this.bodyG.showMeta();
        await this.headerG.updateBodyIcon();
    }

    async hideMeta() {
        this.bodyG.hideMeta();
        if (!await this.headerBodyG.hasBodyContent()) {
            await this.ensureCollapsed();
        }
    }

    metaIsDisplayed() {
        return this.headerBodyG.bodyIsVisible() && this.bodyG.content_meta_htmlElement.innerHTML !== '';
    }

    async setLink() {
        let input = this.findAppUi().input;
        this.getObject().link = input.get();
        await input.clear();
        await this.getObject().uis_update();
    }

    async shakeTree() {
        let obj = this.getObject();
        if (obj.containerA) {
            let before = obj.containerA.countWithNestedEntities();
            await obj.containerA.shakeTree();
            this.findAppUi().signal('shaked the tree (deleted ' + (before - obj.containerA.countWithNestedEntities()) + ' entities)');
        } else {
            this.findAppUi().signal('not a container');
        }
    }

    isCollapsed() : boolean {
        return !this.headerBodyG.bodyIsVisible();
    }

    findAppUi() : UiA_AppA {
        if (this.appA) {
            return this.appA;
        } else if (this.context) {
            return this.context.findAppUi();
        } else {
            return undefined;
        }
    }

    createSubUiFor_transmitEditability(object: Entity) : UiA {
        let ui = this.entity.getApp_typed().uiA.createUiFor_typed(object);
        ui.context = this;
        ui.editable = this.editable;
        return ui;
    }

    createSubUiFor(object: Entity) : UiA {
        let ui = this.entity.getApp_typed().uiA.createUiFor_typed(object);
        ui.context = this;
        return ui;
    }
}