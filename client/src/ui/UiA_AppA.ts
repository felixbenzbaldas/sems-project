import type {Entity} from "@/Entity";
import {div, dummyDiv, notNullUndefined, nullUndefined, textElem} from "@/utils";
import {OutputA} from "@/ui/OutputA";
import {InputA} from "@/ui/InputA";
import {UiA} from "@/ui/UiA";
import type {AppA} from "@/AppA";
import {UiA_AppA_GlobalEventG} from "@/ui/UiA_AppA_GlobalEventG";
import {UiA_AppA_CommandsA} from "@/ui/UiA_AppA_CommandsA";
import {UiA_ListA} from "@/ui/UiA_ListA";

export class UiA_AppA {

    htmlElement: HTMLElement = div();

    output : OutputA;
    input : InputA;
    focused : UiA;
    website_scrollableArea : HTMLElement = div();
    statusBar: HTMLDivElement = div();
    globalEventG: UiA_AppA_GlobalEventG;
    commandsA: UiA_AppA_CommandsA;
    contentUi : UiA;
    webMetaUi : UiA;
    commandsUi: UiA;
    focusStyle_marker: HTMLElement;
    meta_htmlElement: HTMLElement = div();

    constructor(public entity: Entity) {
        this.globalEventG = new UiA_AppA_GlobalEventG(entity);
        this.focusStyle_marker = this.focusStyle_createMarker();
    }

    async install(showMeta? : boolean) : Promise<void> {
        let app_uiA = this.getApp().uiA;
        this.commandsA = new UiA_AppA_CommandsA(this.entity);
        this.commandsA.installCommands();
        this.commandsA.installMapForInputPatterns();
        this.contentUi = await this.entity.uiA.createSubUiFor_transmitEditability(app_uiA.content);
        if (!app_uiA.isWebsite) {
            this.focused = this.entity.uiA;
        }
        this.focusStyle_update();
        this.htmlElement.style.backgroundColor = app_uiA.theme.backgroundColor;
        this.htmlElement.style.color = app_uiA.theme.fontColor;
        this.htmlElement.style.height = '100%';
        this.htmlElement.style.display = 'flex';
        this.htmlElement.style.flexDirection = 'column';
        if (!app_uiA.isWebsite) {
            this.htmlElement.appendChild(this.statusBar);
            this.statusBar.style.backgroundColor = app_uiA.theme.secondBackgroundColor;
            this.statusBar.style.minHeight = '1.2rem';
            this.statusBar.style.maxHeight = '1.2rem';
        }
        this.htmlElement.appendChild(this.meta_htmlElement);
        if (app_uiA.isWebsite) {
            await this.install_website();
        } else {
            let columnsDiv = div();
            this.htmlElement.appendChild(columnsDiv);
            columnsDiv.style.flexGrow = '2';
            columnsDiv.style.minHeight = '0%'; // this is necessary to prevent this div from overflowing (it is weird ...)
            columnsDiv.style.display = 'flex';
            columnsDiv.appendChild(dummyDiv(30));
            let supportColumnDiv = div();
            supportColumnDiv.style.height = '100%';
            supportColumnDiv.style.overflowY = 'scroll';
            supportColumnDiv.style.overflowX = 'hidden';
            supportColumnDiv.style.flexBasis = '15rem';
            supportColumnDiv.style.scrollbarWidth = 'thin';
            columnsDiv.appendChild(supportColumnDiv);
            if (showMeta) {
                supportColumnDiv.appendChild(await this.createMeta());
            }
            let focusColumnDiv = div();
            columnsDiv.appendChild(focusColumnDiv);
            focusColumnDiv.style.height = '100%';
            focusColumnDiv.style.overflowY = 'scroll';
            focusColumnDiv.style.flexBasis = '40rem';
            focusColumnDiv.appendChild(this.contentUi.htmlElement);
            focusColumnDiv.appendChild(this.createPlaceholderArea());
            columnsDiv.appendChild(dummyDiv(50));
        }
    }

    private async createMeta() : Promise<HTMLElement> {
        this.commandsUi = await this.getApp().uiA.createUiFor(this.createButtons());
        this.output = await OutputA.create(this.entity);
        this.input = await InputA.create(this.entity);
        let uiList = await this.getApp().uiA.createUiList(this.commandsUi, this.input.getUi().uiA, this.output.getUi().uiA);
        uiList.context = this.entity.uiA;
        return uiList.htmlElement;
    }

    private async install_website() {
        let app_uiA = this.getApp().uiA;
        let contentWrapper = div();
        this.htmlElement.appendChild(this.website_scrollableArea);
        this.website_scrollableArea.style.overflowY = 'scroll';
        this.website_scrollableArea.style.paddingLeft = '0.2rem';
        this.website_scrollableArea.style.paddingRight = '0.2rem';
        this.website_scrollableArea.appendChild(this.focusStyle_marker);
        let centerWrapper = div();
        this.website_scrollableArea.appendChild(centerWrapper);
        centerWrapper.appendChild(dummyDiv(35));
        centerWrapper.appendChild(contentWrapper);
        centerWrapper.appendChild(dummyDiv(50));
        contentWrapper.style.paddingTop = '3rem';
        contentWrapper.appendChild(this.contentUi.htmlElement);
        centerWrapper.style.display = 'flex';
        centerWrapper.style.justifyContent = 'center';
        contentWrapper.style.flexBasis = '35rem';
        contentWrapper.style.flexShrink = '1';
        contentWrapper.style.flexGrow = '0';
        this.website_scrollableArea.appendChild(this.createPlaceholderArea());
        if (app_uiA.webMeta) {
            this.webMetaUi = await this.entity.uiA.createSubUiFor(app_uiA.webMeta);
            this.website_scrollableArea.appendChild(this.webMetaUi.htmlElement);
        }
    }

    getObject() : Entity {
        return this.entity.uiA.getObject();
    }

    async newSubitem() {
        let created = await this.getObject().findContainer().createText('');
        let position = 0;
        let listA = this.getObject().appA.uiA.content.listA;
        await listA.insertObjectAtPosition(created, position);
        await this.getObject().appA.uiA.content.uis_update_addedListItem(position);
        this.focus(this.contentUi.listA.uisOfListItems[position]);
        this.focused.enterEditMode();
    }

    async paste() {
        let position = 0;
        let listA = this.getObject().appA.uiA.content.listA;
        await listA.insertObjectAtPosition(this.getObject().appA.uiA.clipboard, position);
        await this.contentUi.update_addedListItem(position);
        this.focus(this.contentUi.listA.uisOfListItems[position]);
    }

    focus(ui : UiA) {
        if (ui !== this.focused) {
            let focusedPrevious = this.focused;
            this.focused = ui;
            if (focusedPrevious) {
                focusedPrevious.leaveEditMode();
                focusedPrevious.updateFocusStyle();
            }
            this.focused.updateFocusStyle();
            this.focused.takeCaret();
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

    private createPlaceholderArea() : HTMLElement {
        let placeholderAreaDiv = div();
        let updatePlaceholderArea = () => {
            placeholderAreaDiv.style.height = (window.innerHeight * 0.85) + 'px';
        };
        updatePlaceholderArea();
        window.addEventListener('resize', event => {
            updatePlaceholderArea();
        });
        return placeholderAreaDiv;
    }

    private focusStyle_createMarker() : HTMLElement {
        let divElement = div();
        divElement.style.height = '0.2rem';
        return divElement;
    }

    focusStyle_update() {
        if (this.focused === this.entity.uiA && this.isActive()) {
            this.focusStyle_marker.style.backgroundColor = this.getApp().uiA.theme.focusBorderColor_viewMode;
        } else {
            this.focusStyle_marker.style.backgroundColor = this.getApp().uiA.theme.backgroundColor;
        }
    }

    ensureContainer_AndUpdateStyle(entity: Entity) {
        if (nullUndefined(entity.containerA)) {
            entity.installContainerA();
        }
        entity.uis_update_containerStyle();
    }

    createButtons() : Entity {
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
        return this.entity.getApp_typed();
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
        roots.push(...await this.getApp().uiA.content.listA.getResolvedList());
        let before = profile.containerA.countWithNestedEntities();
        await this.getApp().shakeTree_withMultipleRoots(roots, profile.containerA);
        let deletions = before - profile.containerA.countWithNestedEntities();
        this.signal('cleared (' + deletions + ' deletions)');
    }
}