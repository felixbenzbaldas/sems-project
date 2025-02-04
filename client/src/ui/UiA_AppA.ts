import type {Entity} from "@/Entity";
import {div, notNullUndefined, nullUndefined, textElem} from "@/utils";
import {OutputA} from "@/ui/OutputA";
import {InputA} from "@/ui/InputA";
import {UiA} from "@/ui/UiA";
import type {AppA} from "@/AppA";
import {UiA_AppA_GlobalEventG} from "@/ui/UiA_AppA_GlobalEventG";
import {UiA_AppA_CommandsA} from "@/ui/UiA_AppA_CommandsA";

export class UiA_AppA {

    htmlElement: HTMLElement = div();

    output : OutputA;
    input : InputA;
    commands: Entity;
    focused : UiA;
    scrollableArea : HTMLElement = div();
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

    async install(showMeta? : boolean, withPlaceholderArea? : boolean) : Promise<void> {
        let app_uiA = this.getApp().uiA;
        this.commandsA = new UiA_AppA_CommandsA(this.entity);
        this.commandsA.installCommands();
        this.commandsA.installMapForInputPatterns();
        if (showMeta) {
            await this.installMeta();
        }
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
        this.htmlElement.appendChild(this.statusBar);
        this.htmlElement.appendChild(this.meta_htmlElement);
        this.htmlElement.appendChild(this.scrollableArea);
        this.scrollableArea.style.overflowY = 'scroll';
        this.scrollableArea.style.paddingLeft = '0.2rem';
        this.scrollableArea.style.paddingRight = '0.2rem';
        this.statusBar.style.backgroundColor = app_uiA.theme.secondBackgroundColor;
        this.statusBar.style.minHeight = '1.2rem';
        this.statusBar.style.maxHeight = '1.2rem';
        this.scrollableArea.appendChild(this.focusStyle_marker);
        let contentWrapper = div();
        if (app_uiA.isWebsite) {
            let centerWrapper = div();
            this.scrollableArea.appendChild(centerWrapper);
            centerWrapper.style.display = 'flex';
            centerWrapper.style.flexDirection = 'column';
            centerWrapper.style.alignItems = 'center';
            centerWrapper.style.marginRight = '70px';
            centerWrapper.appendChild(contentWrapper);
            contentWrapper.style.paddingTop = '3rem';
        } else {
            this.scrollableArea.appendChild(contentWrapper);
        }
        contentWrapper.appendChild(this.contentUi.htmlElement);
        let updateWidth = () => {
            let maxContentWidth = 850;
            let widthOfScrollbar = 30; // estimated
            if (window.innerWidth < maxContentWidth) {
                contentWrapper.style.width = 'unset';
            } else {
                contentWrapper.style.width = maxContentWidth - widthOfScrollbar + 'px';
            }
        };
        updateWidth();
        window.addEventListener('resize', updateWidth);
        if (withPlaceholderArea) {
            this.scrollableArea.appendChild(this.createPlaceholderArea());
        }
        if (app_uiA.webMeta) {
            this.webMetaUi = await this.entity.uiA.createSubUiFor(app_uiA.webMeta);
            this.scrollableArea.appendChild(this.webMetaUi.htmlElement);
        }
    }

    private async installMeta() {
        this.commands = this.createButtons();
        this.commandsUi = await this.entity.uiA.createSubUiFor(this.commands);
        this.output = await OutputA.create(this.entity);
        this.input = await InputA.create(this.entity);
        this.meta_htmlElement.appendChild(this.commandsUi.htmlElement);
        this.meta_htmlElement.appendChild(this.input.getUi().uiA.htmlElement);
        this.meta_htmlElement.appendChild(this.output.getUi().uiA.htmlElement);
        this.meta_htmlElement.appendChild(this.separatorLine());
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

    private separatorLine() : HTMLElement {
        let line: HTMLDivElement = div();
        line.style.marginBottom = '0.5rem';
        line.style.paddingBottom = '0.5rem';
        line.style.borderBottom = 'dashed';
        return line;
    }

    private createPlaceholderArea() : HTMLElement {
        let placeholderAreaDiv = div();
        let updatePlaceholderArea = () => {
            placeholderAreaDiv.style.height = (window.innerHeight - window.innerHeight * 0.15) + 'px';
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
            this.getApp().unboundG.createButton('import', async () => {
                await this.globalEventG.import();
            })
        );
        lowPriorityButtons.collapsible = true;
        return this.getApp().unboundG.createTextWithList('commands',
            this.commandsA.importProfile.entity,
            this.commandsA.exportProfileWithTreeShaking.entity,
            this.commandsA.defaultAction.entity,
            this.commandsA.newSubitem.entity,
            this.commandsA.toggleCollapsible.entity,
            this.getApp().unboundG.createButton('expand/collapse', async () => {
                await this.globalEventG.expandOrCollapse();
            }),
            this.getApp().unboundG.createButton('export', async () => {
                await this.globalEventG.export();
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
}