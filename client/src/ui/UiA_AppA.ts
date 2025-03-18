import type {Entity} from "@/Entity";
import {div, dummyDiv, nullUndefined, textElem} from "@/utils";
import {OutputA} from "@/ui/OutputA";
import {InputA} from "@/ui/InputA";
import {UiA} from "@/ui/UiA";
import type {AppA} from "@/AppA";
import {UiA_AppA_GlobalEventG} from "@/ui/UiA_AppA_GlobalEventG";
import {UiA_AppA_CommandsA} from "@/ui/UiA_AppA_CommandsA";
import type {UiA_RelationshipA} from "@/ui/UiA_RelationshipA";
import {ParameterizedActionA} from "@/ParameterizedActionA";
import type {ListA} from "@/ListA";
import {Parameter} from "@/Parameter";

export class UiA_AppA {

    htmlElement: HTMLElement;

    output : OutputA;
    input : InputA;
    focused : UiA;
    website_scrollableArea : HTMLElement = div();
    statusBar: HTMLElement = div();
    globalEventG: UiA_AppA_GlobalEventG;
    commandsA: UiA_AppA_CommandsA;
    mainColumnUi : UiA;
    presentationModeA_contentUi : UiA;
    webMetaUi : UiA;
    commandsUi: UiA;
    focusStyle_marker: HTMLElement;
    meta_htmlElement: HTMLElement = div();
    supportColumn_freeSpace: Entity;
    supportColumn_freeSpace_ui : UiA;
    supportColumnUi: UiA;

    constructor(public entity: Entity) {
        this.globalEventG = new UiA_AppA_GlobalEventG(entity);
        this.htmlElement = entity.uiA.htmlElement;
    }

    async install(showMeta? : boolean) : Promise<void> {
        let app_uiA = this.getApp().uiA;
        this.commandsA = new UiA_AppA_CommandsA(this.entity);
        this.commandsA.installCommands();
        this.commandsA.installMapForInputPatterns();
        this.htmlElement.style.backgroundColor = app_uiA.theme.backgroundColor;
        this.htmlElement.style.color = app_uiA.theme.fontColor;
        this.htmlElement.style.height = '100%';
        this.htmlElement.style.display = 'flex';
        this.htmlElement.style.flexDirection = 'column';
        this.updateStatusBar();
        this.htmlElement.appendChild(this.statusBar);
        this.htmlElement.appendChild(this.meta_htmlElement);
        if (app_uiA.isWebsite) {
            await this.install_website();
        } else {
            let columnsDiv = div();
            this.htmlElement.appendChild(columnsDiv);
            columnsDiv.style.flexGrow = '2';
            columnsDiv.style.minHeight = '0%'; // this is necessary to prevent this div from overflowing (it is weird ...)
            columnsDiv.style.display = 'flex';
            columnsDiv.appendChild(dummyDiv(15));
            let uiElementsForSupportColumn : Array<UiA> = [];
            if (showMeta) {
                uiElementsForSupportColumn.push(await this.createMeta());
            }
            this.supportColumn_freeSpace = await this.getApp().createList();
            this.supportColumn_freeSpace_ui = await app_uiA.createUiFor(this.supportColumn_freeSpace, true);
            this.supportColumn_freeSpace_ui.useProfileContainer = true;
            uiElementsForSupportColumn.push(this.supportColumn_freeSpace_ui);
            this.supportColumnUi = await this.createColumn(...uiElementsForSupportColumn);
            columnsDiv.appendChild(this.supportColumnUi.htmlElement);
            this.supportColumnUi.context = this.entity.uiA;
            this.supportColumnUi.htmlElement.style.flexBasis = '25rem';
            this.supportColumnUi.htmlElement.style.scrollbarWidth = 'thin';
            this.mainColumnUi = await this.createColumnFor(app_uiA.mainColumnData);
            this.mainColumnUi.context = this.entity.uiA;
            this.mainColumnUi.useProfileContainer = true;
            columnsDiv.appendChild(this.mainColumnUi.htmlElement);
            this.mainColumnUi.htmlElement.style.flexBasis = '40rem';
            columnsDiv.appendChild(dummyDiv(50));
            if (app_uiA.webMeta) {
                let footerDiv = div();
                footerDiv.style.borderTop = 'solid';
                footerDiv.style.borderColor = app_uiA.theme.secondBackgroundColor;
                this.htmlElement.appendChild(footerDiv);
                this.webMetaUi = await this.entity.uiA.createSubUiFor(app_uiA.webMeta);
                footerDiv.appendChild(this.webMetaUi.htmlElement);
            }
        }
    }

    private async createMeta() : Promise<UiA> {
        this.commandsUi = await this.getApp().uiA.createUiFor(await this.createButtons());
        this.output = await OutputA.create(this.entity);
        this.input = await InputA.create(this.entity);
        let uiList = await this.getApp().uiA.createUiList(this.commandsUi, this.input.getUi().uiA, this.output.getUi().uiA);
        uiList.context = this.entity.uiA;
        return uiList;
    }

    private async install_website() {
        let app_uiA = this.getApp().uiA;
        let contentWrapper = div();
        this.htmlElement.appendChild(this.website_scrollableArea);
        this.website_scrollableArea.style.overflowY = 'scroll';
        this.website_scrollableArea.style.paddingLeft = '0.2rem';
        this.website_scrollableArea.style.paddingRight = '0.2rem';
        this.website_scrollableArea.style.flexGrow = '2';
        let centerWrapper = div();
        this.website_scrollableArea.appendChild(centerWrapper);
        centerWrapper.appendChild(dummyDiv(35));
        centerWrapper.appendChild(contentWrapper);
        centerWrapper.appendChild(dummyDiv(50));
        contentWrapper.style.paddingTop = '3rem';
        this.presentationModeA_contentUi = await this.entity.uiA.createSubUiFor_transmitEditability(app_uiA.presentationModeA_contentData);
        contentWrapper.appendChild(this.presentationModeA_contentUi.htmlElement);
        centerWrapper.style.display = 'flex';
        centerWrapper.style.justifyContent = 'center';
        contentWrapper.style.flexBasis = '35rem';
        contentWrapper.style.flexShrink = '1';
        contentWrapper.style.flexGrow = '0';
        this.website_scrollableArea.appendChild(this.entity.uiA.createPlaceholderArea());
        if (app_uiA.webMeta) {
            this.webMetaUi = await this.entity.uiA.createSubUiFor(app_uiA.webMeta);
            this.website_scrollableArea.appendChild(this.webMetaUi.htmlElement);
        }
    }

    focus(ui : UiA) {
        if (ui !== this.focused) {
            let focusedPrevious = this.focused;
            this.focused = ui;
            if (focusedPrevious) {
                let focusedPrevious_column = focusedPrevious.getColumn();
                if (focusedPrevious_column) {
                    focusedPrevious_column.lastFocused = focusedPrevious;
                }
                focusedPrevious.leaveEditMode();
                focusedPrevious.updateFocusStyle();
            }
            this.focused.updateFocusStyle();
            this.focused.takeCaret();
            this.focused.scrollIntoView();
        }
    }

    signal(text : string) {
        this.statusBar.innerHTML = null;
        let textHtmlElement = textElem(text);
        this.statusBar.appendChild(textHtmlElement);
        textHtmlElement.style.backgroundColor = this.getApp().uiA.theme.highlight;
        textHtmlElement.style.display = 'inline';
        textHtmlElement.style.marginLeft = '0.5rem';
        setTimeout(()=> {
            textHtmlElement.style.backgroundColor = this.getApp().uiA.theme.secondBackgroundColor;
        }, 800);
    }

    ensureContainer_AndUpdateStyle(entity: Entity) {
        if (nullUndefined(entity.containerA)) {
            entity.installContainerA();
        }
        entity.uis_update_containerStyle();
    }

    async createButtons() : Promise<Entity> {
        let lowPriorityButtons = this.getApp().unboundG.createTextWithList('mehr',
            this.getApp().unboundG.createButton('export app', async () => {
                await this.globalEventG.exportApp();
            }),
            this.getApp().unboundG.createButton('import from old json', async () => {
                await this.globalEventG.importOldJson();
            }),
            this.getApp().unboundG.createButton('script: set context for all objects in container', async () => {
                await this.globalEventG.script_setContextForAllObjectsInContainer();
            }),
            this.getApp().unboundG.createButton('set link', async () => {
                await this.globalEventG.setLink();
            }),
            this.getApp().unboundG.createButton('ensure container', async () => {
                await this.globalEventG.ensureContainer();
            }),
            this.getApp().unboundG.createButton('export', async () => {
                await this.globalEventG.export();
            }),
            this.getApp().unboundG.createButton('import', async () => {
                await this.globalEventG.import();
            })
        );
        lowPriorityButtons.collapsible = true;
        let createTextObjectWithName = this.getApp().unboundG.createText('create text-object with name');
        createTextObjectWithName.parameterizedActionA = new ParameterizedActionA(createTextObjectWithName);
        createTextObjectWithName.collapsible = true;
        createTextObjectWithName.parameterizedActionA.parameters.push(
            new Parameter('name', 'stringValue'),
            new Parameter('container', 'entity'));
        createTextObjectWithName.codeG_jsFunction = async (args : Entity) => {
            let name = (await args.get('name')).text;
            let container = (await args.get('container')).containerA;
            let createdObject = await container.createBoundEntity(name);
            createdObject.text = '';
            return createdObject;
        }
        return this.getApp().unboundG.createTextWithList('commands',
            this.commandsA.importProfile.entity,
            this.commandsA.exportProfile.entity,
            this.commandsA.clear.entity,
            this.commandsA.defaultAction.entity,
            this.commandsA.newSubitem.entity,
            this.commandsA.toggleCollapsible.entity,
            this.getApp().unboundG.createButton('expand/collapse', async () => {
                await this.globalEventG.expandOrCollapse();
            }),
            this.commandsA.mark.entity,
            this.commandsA.cut.entity,
            this.commandsA.deepCopy.entity,
            this.commandsA.paste.entity,
            this.commandsA.pasteNext.entity,
            this.getApp().unboundG.createButton('focus root', async () => {
                await this.globalEventG.focusRoot();
            }),
            this.commandsA.toggleContext.entity,
            this.commandsA.shakeTree.entity,
            this.commandsA.exportRawText.entity,
            createTextObjectWithName,
            lowPriorityButtons
        );
    }

    isActive() : boolean {
        if (this.getApp().environment?.activeAppUi) {
            return this.getApp().environment.activeAppUi === this;
        } else {
            return true;
        }
    }

    getApp() : AppA {
        return this.entity.getApp();
    }

    ensureActive() {
        if (this.getApp().environment) {
            this.getApp().environment.ensureActive(this);
        }
    }

    async clear() {
        await this.getApp().profileG.clearLastRemoved();
        let roots = [];
        let profile = this.getApp().profileG.getProfile();
        roots.push(profile);
        roots.push(...await this.getApp().uiA.mainColumnData.listA.getResolvedList());
        let before = profile.containerA.countWithNestedEntities();
        await this.getApp().shakeTree_withMultipleRoots(roots, profile.containerA);
        let deletions = before - profile.containerA.countWithNestedEntities();
        this.signal('cleared (' + deletions + ' deletions)');
    }

    async createColumnFor(object : Entity) {
        let ui = this.entity.getApp().uiA.prepareUiFor(object);
        ui.editable = this.entity.uiA.editable;
        ui.isColumn = true;
        await ui.install();
        return ui;
    }

    async createColumn(...uiElements : Array<UiA>) : Promise<UiA> {
        let entity = this.getApp().createEntityWithApp();
        entity.uiA = new UiA(entity);
        entity.uiA.installListA();
        let list = entity.uiA.listA;
        for (let ui of uiElements) {
            ui.context = entity.uiA;
        }
        list.elements = [...uiElements];
        entity.uiA.isColumn = true;
        await entity.uiA.install();
        return entity.uiA;
    }

    updateStatusBar() {
        this.statusBar.style.backgroundColor = this.getApp().uiA.theme.secondBackgroundColor;
        this.statusBar.style.flexBasis = '1.3rem';
        this.statusBar.style.flexShrink = '0';
        if (this.getApp().uiA.isWebsite) {
            this.statusBar.style.display = 'none';
        } else {
            this.statusBar.style.display = 'default';
        }
    }
}