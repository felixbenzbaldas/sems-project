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
import type {ContainerA} from "@/ContainerA";
import {UiA_RelationshipA} from "@/ui/RelationshipA";

export class UiA {

    editable: boolean;
    htmlElement : HTMLElement = div();
    listA: UiA_ListA;
    withoutObjectG_collapsible: boolean;
    installListA() {
        this.listA = new UiA_ListA(this.entity);
    }
    relationshipA: UiA_RelationshipA;
    installRelationshipA() {
        this.relationshipA = new UiA_RelationshipA(this.entity);
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
    isColumn : boolean;
    lastFocused : UiA;
    useProfileContainer : boolean;

    constructor(public entity : Entity) {
        this.headerBodyG = new UiA_HeaderBodyG(this.entity);
        this.textG = new UiA_TextG(this.entity);
        this.headerG = new UiA_HeaderG(this.entity);
        this.bodyG = new UiA_BodyG(this.entity);
        this.testRunG = new UiA_TestRunG(this.entity);
        this.htmlElement.classList.add('UI');
    }

    async install(source? : boolean) {
        if (nullUndefined(this.object)) {
            if (this.relationshipA) {
                await this.headerBodyG.installWithoutObject();
            } else if (this.listA) {
                await this.listA.update();
                this.htmlElement.appendChild(this.listA.htmlElement);
                if (this.isColumn) {
                    this.columnA_setStyle();
                    this.htmlElement.appendChild(this.createPlaceholderArea());
                }
            }
        } else {
            await this.withObjectA_install(source);
        }
    }

    async withObjectA_update(source? : boolean) {
        this.withObjectA_reset();
        await this.withObjectA_install(source);
    }

    async withObjectA_install(source? : boolean) {
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
                    await this.withObjectA_update();
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
                this.installListA();
                await this.listA.update();
                this.htmlElement.appendChild(this.listA.htmlElement);
                if (this.isColumn) {
                    this.columnA_setStyle();
                    this.htmlElement.appendChild(this.createPlaceholderArea());
                } else {
                    this.fullWidth();
                }
            } else {
                this.fullWidth();
                let divElement = div();
                divElement.innerText = this.getObject().getDescription();
                this.htmlElement.appendChild(divElement);
            }
        }
    }

    columnA_setStyle() {
        this.htmlElement.style.height = '100%';
        this.htmlElement.style.overflowY = 'scroll';
        this.htmlElement.style.overflowX = 'hidden';
    }

    createPlaceholderArea() : HTMLElement {
        let placeholderArea = div();
        placeholderArea.style.height = '85%';
        return placeholderArea;
    }

    wouldProvokeEndlessRecursion() : boolean {
        return !this.getObject().collapsible
            && notNullUndefined(this.context)
            && this.context.nonCollapsibleChainContains(this.getObject());
    }

    nonCollapsibleChainContains(toCheck : Entity) : boolean {
        if (nullUndefined(this.object)) {
            return false;
        } else {
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
    }

    fullWidth() {
        this.htmlElement.style.minWidth = '100%';
    }

    withObjectA_reset() {
        this.resetHtmlElement();
        // TODO use aspects not groups?
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
        if (this.object) {
            return notNullUndefined(this.getObject().codeG_jsFunction) ||
                notNullUndefined(this.getObject().link) ||
                notNullUndefined(this.getObject().text) ||
                notNullUndefined(this.getObject().testRunA);
        } else {
            return !this.listA;
        }
    }

    isPlainList() {
        if (this.object) {
            return this.entity.uiA.getObject().listA && !this.isHeaderBody();
        } else {
            return true; // TODO
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

    getObject() : Entity {
        return this.object;
    }

    updateFocusStyle() {
        if (this.isHeaderBody()) {
            this.headerG.focusStyle_update();
        } else {
            if (this.hasFocus() && this.findAppUi().isActive()) {
                this.htmlElement.style.border = 'solid';
                this.htmlElement.style.borderColor = this.entity.getApp_typed().uiA.theme.focusBorderColor_viewMode;
            } else {
                this.htmlElement.style.border = 'none';
            }
        }
    }

    takeCaret() {
        if (notNullUndefined(this.object) && notNullUndefined(this.object.text)) {
            this.textG.takeCaret();
        }
    }

    hasFocus() {
        return this.findAppUi()?.focused === this;
    }

    async defaultAction() {
        if (this.isColumn) {
            await this.newSubitem();
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
        if (!this.getObject().listA) {
            this.getObject().installListA();
        }
        let created = await this.findContainerForNewSubitem().createText('');
        let position = 0;
        let listA = this.getObject().listA;
        await listA.insertPathOrDirectAtPosition(created, position);
        if (notNullUndefined(this.getObject().text)) {
            created.context = created.getPath(this.getObject());
        }
        await listA.entity.uis_update_addedListItem(position);
        if (!this.isPlainList()) {
            await this.ensureExpanded();
        }
        this.findAppUi().focus(this.entity.uiA.listA.elements[position]);
        this.findAppUi().focused.enterEditMode();
    }

    findContainerForNewSubitem() : ContainerA {
        if (this.useProfileContainer) {
            return this.entity.getApp_typed().profileG.getProfile().containerA;
        } else {
            return this.getObject().findContainer();
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
        appA_uiA.clipboard = this.getObject();
        appA_uiA.clipboard_lostContext = this.objectHasContext() && await this.inContext();
        await this.remove();
    }

    async remove() {
        if (nullUndefined(this.getObject().link)) {
            this.textG.save(); // important!
        }
        let obj = this.getObject();
        await this.entity.getApp_typed().profileG.addToLastRemoved(obj);
        let uiContext = this.context;
        let uiListItems = uiContext.listA.elements;
        let position = uiListItems.indexOf(this);
        let uiContextObj = uiContext.getObject();
        if (this.objectHasContext() && await this.inContext()) {
            obj.context = null;
            await obj.uis_update_context();
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
        if (this.textG.getText() === '' && !await this.headerBodyG.hasBodyContent()) {
            await this.context.pasteNextOnSubitem(this);
            await this.remove();
        } else {
            if (!this.getObject().listA) {
                this.getObject().installListA();
            }
            let appUi = this.entity.getApp_typed().uiA;
            let position = 0;
            await appUi.insertClipboardAtPosition(this.getObject(), position);
            await this.ensureExpanded();
            this.findAppUi().focus(this.entity.uiA.listA.elements[position]);
        }
    }

    async toggleCollapsible() {
        this.getObject().collapsible = !this.getObject().collapsible;
        await this.getObject().uis_update_collapsible();
    }

    async expandOrCollapse() {
        if (this.isCollapsible()) {
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
        if (this.object) {
            this.editMode = false;
            this.headerG.focusStyle_update();
            this.headerG.updateCursorStyle();
            this.textG.htmlElement.contentEditable = 'false';
        }
    }

    async getListOfChildren() : Promise<Array<UiA>> {
        if (this.isHeaderBody()) {
            return this.bodyG.getListOfChildren();
        } else if (this.isPlainList()) {
            return this.listA.elements;
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

    getColumn() : UiA {
        if (this.isColumn) {
            return this;
        } else if (this.context) {
            return this.context.getColumn();
        } else {
            return undefined;
        }
    }

    columnA_takeFocus() {
        if (this.lastFocused) {
            this.lastFocused.focus();
        } else {
            if (this.listA.elements.length > 0) {
                this.listA.elements[0].focus();
            } else {
                this.focus();
            }
        }
    }

    scrollIntoView() {
        let rect = this.getMainArea().getBoundingClientRect();
        let scrollableRect = this.getScrollableRect();
        if (rect.top < scrollableRect.top) {
            this.scrollTo('start');
        } else if (rect.bottom > scrollableRect.bottom) {
            this.scrollTo('end');
        }
    }

    getScrollableRect() {
        if (this.entity.getApp_typed().uiA.isWebsite) {
            return this.findAppUi().website_scrollableArea.getBoundingClientRect();
        } else {
            return this.getColumn().htmlElement.getBoundingClientRect();
        }
    }

    scrollTo(position: 'start' | 'end') {
        this.getMainArea().scrollIntoView({
            block: position,
            behavior: 'smooth'
        });
    }

    getMainArea() : HTMLElement {
        if (this.isHeaderBody()) {
            return this.headerG.htmlElement;
        } else {
            return this.htmlElement;
        }
    }

    isCollapsible() : boolean {
        if (this.object) {
            return this.object.collapsible;
        } else {
            return this.withoutObjectG_collapsible;
        }
    }

}