import type {Entity} from "@/Entity";
import {div, notNullUndefined, nullUndefined} from "@/utils";
import {UiA_ListA} from "@/ui/UiA_ListA";
import {UiA_TextG} from "@/ui/UiA_TextG";
import {UiA_BodyG} from "@/ui/UiA_BodyG";
import {UiA_HeaderG} from "@/ui/UiA_HeaderG";
import {UiA_HeaderBodyG} from "@/ui/UiA_HeaderBodyG";
import {UiA_TestRunG} from "@/ui/UiA_TestRunG";
import {UiA_AppA} from "@/ui/UiA_AppA";
import {UiA_ImageA} from "@/ui/UiA_ImageA";

export class UiA {

    editable: boolean;
    htmlElement : HTMLElement = div();
    listA: UiA_ListA;
    installListA() {
        this.listA = new UiA_ListA(this.entity);
    }
    textG : UiA_TextG;
    headerG : UiA_HeaderG;
    bodyG: UiA_BodyG;
    object: Entity;
    context: UiA;
    headerBodyG: UiA_HeaderBodyG;
    testRunG: UiA_TestRunG;
    appA : UiA_AppA;
    imageA : UiA_ImageA;
    async installImageA() {
        this.imageA = new UiA_ImageA(this.entity);
        await this.imageA.install();
    }
    editMode : boolean;

    constructor(public entity : Entity) {
        this.reset();
    }

    async update(source? : boolean) {
        this.reset();
        await this.install(source);
    }

    async install(source? : boolean) {
        this.htmlElement.classList.add('UI');
        if (this.wouldProvokeEndlessRecursion()) {
            this.fullWidth();
            let warningText = 'This item cannot be displayed. It contains itself. ' +
                'The rendering would result in an endless recursion. ' +
                'Do you want to make it collapsible to solve the problem?';
            let data = this.entity.getApp_typed().unboundG.createList(
                this.entity.getApp_typed().unboundG.createText(warningText),
                this.entity.getApp_typed().unboundG.createButton('make collapsible', async () => {
                    this.getObject().collapsible = true;
                    await this.getObject().uis_update_collapsible();
                    await this.update();
                })
            );
            let ui = await this.createSubUiFor(data);
            this.htmlElement.appendChild(ui.htmlElement);
        } else {
            if (this.getObject().text?.startsWith('#img') && !source) {
                await this.installImageA();
                this.htmlElement.appendChild(this.imageA.htmlElement);
            } else if (this.getObject().codeG_html) {
                this.fullWidth();
                this.htmlElement.appendChild(this.getObject().codeG_html);
            } else if (this.getObject().appA) {
                this.htmlElement.innerText = "type: application";
            } else if (this.isHeaderBody()) {
                await this.headerBodyG.install();
            } else if (this.isPlainList()) {
                this.fullWidth();
                this.installListA();
                await this.listA.update();
                this.htmlElement.appendChild(this.listA.htmlElement);
            } else {
                this.fullWidth();
                let divElement = div();
                divElement.innerText = this.getObject().getDescription();
                this.htmlElement.appendChild(divElement);
            }
        }
    }

    wouldProvokeEndlessRecursion() : boolean {
        return !this.getObject().collapsible
            && notNullUndefined(this.context)
            && this.context.nonCollapsibleChainContains(this.getObject());
    }

    nonCollapsibleChainContains(toCheck : Entity) : boolean {
        if (this.getObject().collapsible) {
            return false;
        } else {
            if (this.getObject() == toCheck) {
                return true;
            } else {
                if (this.context) {
                    return this.context.nonCollapsibleChainContains(toCheck);
                } else {
                    return false;
                }
            }
        }
    }

    fullWidth() {
        this.htmlElement.style.minWidth = '100%';
    }

    reset() {
        this.resetHtmlElement();
        this.headerBodyG = new UiA_HeaderBodyG(this.entity);
        this.textG = new UiA_TextG(this.entity);
        this.headerG = new UiA_HeaderG(this.entity);
        this.bodyG = new UiA_BodyG(this.entity);
        this.testRunG = new UiA_TestRunG(this.entity);
    }

    resetHtmlElement() {
        this.htmlElement.innerHTML = null;
    }

    isHeaderBody() : boolean {
        return notNullUndefined(this.getObject().action) ||
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
        return this.object;
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
        await this.listA.defaultActionOnSubitem(subitem);
    }

    async pasteNextOnSubitem(subitem: UiA) {
        await this.listA.pasteNextOnSubitem(subitem);
    }

    async newSubitem() {
        this.entity.log('newSubitem');
        if (this.appA) {
            await this.appA.newSubitem();
        } else {
            if (!this.getObject().listA) {
                this.getObject().installListA();
            }
            let created = await this.getObject().findContainer().createText('');
            let position = 0;
            let listA = this.getObject().listA;
            await listA.insertPathOrDirectAtPosition(created, position);
            created.context = created.getPath(this.getObject());
            await listA.entity.uis_update_addedListItem(position);
            await this.ensureExpanded();
            this.findAppUi().focus(this.entity.uiA.listA.uisOfListItems[position]);
            this.findAppUi().focused.enterEditMode();
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
        await this.entity.getApp_typed().profileG.addToLastRemoved(obj);
        appA_uiA.clipboard = obj;
        let uiContext = this.context;
        let uiListItems = uiContext.listA.uisOfListItems;
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
        this.findAppUi().focus(this.entity.uiA.listA.uisOfListItems[position]);
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
            await this.listA.update_addedListItem(position);
        }
    }

    async update_removedListItem(position: number) {
        if (this.isHeaderBody()) {
            await this.headerBodyG.update_removedListItem(position);
        } else if (this.isPlainList()) {
            await this.listA.update_removedListItem(position);
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
            let deletions = before - obj.containerA.countWithNestedEntities();
            this.findAppUi().signal('shaked the tree (deleted ' + deletions + ' entities)');
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

    async createSubUiFor_transmitEditability(object: Entity) : Promise<UiA> {
        let ui = this.entity.getApp_typed().uiA.prepareUiFor(object);
        ui.context = this;
        ui.editable = this.editable;
        await ui.install();
        return ui;
    }

    async createSubUiFor(object: Entity) : Promise<UiA> {
        let ui = this.entity.getApp_typed().uiA.prepareUiFor(object);
        ui.context = this;
        await ui.install();
        return ui;
    }

    enterEditMode() {
        this.editMode = true;
        this.headerG.focusStyle_update();
        this.headerG.updateCursorStyle();
        this.textG.htmlElement.contentEditable = 'true';
        this.textG.takeCaret();
    }

    leaveEditMode() {
        this.editMode = false;
        this.headerG.focusStyle_update();
        this.headerG.updateCursorStyle();
        this.textG.htmlElement.contentEditable = 'false';
    }

    async getListOfChildren() : Promise<Array<UiA>> {
        if (this.isHeaderBody()) {
            return this.bodyG.getListOfChildren();
        } else if (this.isPlainList()) {
            return this.listA.uisOfListItems;
        }
    }

    async focusNext() {
        let next = await this.getNext();
        if (next != null) {
            next.focus();
        }
    }

    async getNext() : Promise<UiA> {
        let listOfChildren = await this.getListOfChildren();
        if (listOfChildren.length > 0) {
            return listOfChildren[0];
        } else {
            return this.getNext_skippingChildren();
        }
    }

    // returns the next ui skipping the children of this
    async getNext_skippingChildren() : Promise<UiA> {
        if (nullUndefined(this.context)) {
            return undefined;
        } else {
            let parent = this.context;
            let childrenOfParent : Array<UiA> = await parent.getListOfChildren();
            let position = childrenOfParent.indexOf(this);
            if (position + 1 < childrenOfParent.length) {
                return childrenOfParent[position + 1];
            } else {
                return parent.getNext_skippingChildren();
            }
        }
    }

    focus() {
        this.findAppUi().focus(this);
    }

    async focusPrevious() {
        let previous = await this.getPrevious();
        if (notNullUndefined(previous)) {
            previous.focus();
        }
    }

    async getPrevious() : Promise<UiA> {
        if (nullUndefined(this.context)) {
            return undefined;
        } else {
            return await this.context.getPreviousOfChild(this);
        }
    }

    async getPreviousOfChild(child : UiA) {
        let children : Array<UiA> = await this.getListOfChildren();
        let position = children.indexOf(child);
        if (position > 0) {
            return children[position - 1].getLast();
        } else {
            return this;
        }
    }

    // Returns the last ui that belongs to this. If no child is available, then this is returned.
    async getLast() : Promise<UiA> {
        let children : Array<UiA> = await this.getListOfChildren();
        if (children.length > 0) {
            return children[children.length - 1].getLast();
        } else {
            return this;
        }
    }

    async toEndOfList() {
        let children : Array<UiA> = await this.getListOfChildren();
        if (children.length > 0) {
            children.at(-1).focus();
        } else if (this.context) {
            let childrenOfParent = await this.context.getListOfChildren();
            if (this === childrenOfParent.at(-1)) {
                await this.defaultAction();
            } else {
                childrenOfParent.at(-1).focus();
            }
        }
    }

    save() {
        this.textG.save();
    }
}