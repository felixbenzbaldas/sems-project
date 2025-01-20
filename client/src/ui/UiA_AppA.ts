import type {Entity} from "@/Entity";
import {div, nullUndefined, textElem} from "@/utils";
import {OutputA} from "@/ui/OutputA";
import {InputA} from "@/ui/InputA";
import {UiA} from "@/ui/UiA";
import type {AppA} from "@/AppA";
import {UiA_AppA_GlobalEventG} from "@/ui/UiA_AppA_GlobalEventG";
import {UiA_AppA_KeyG} from "@/ui/UiA_AppA_KeyG";

export class UiA_AppA {

    htmlElement: HTMLElement = div();

    output : OutputA;
    input : InputA;
    commands: Entity;
    focused : UiA;
    scrollableArea : HTMLElement = div();
    statusBar: HTMLDivElement = div();
    globalEventG: UiA_AppA_GlobalEventG;
    keyG: UiA_AppA_KeyG;
    contentUi : UiA;
    webMetaUi : UiA;
    commandsUi: UiA;
    focusStyle_marker: HTMLElement;
    isInstalled : boolean;
    meta_htmlElement: HTMLElement = div();

    constructor(public entity: Entity) {
        this.globalEventG = new UiA_AppA_GlobalEventG(entity);
        this.keyG = new UiA_AppA_KeyG(entity);
        this.focused = this.entity.uiA;
        this.focusStyle_marker = this.focusStyle_createMarker();
    }

    async install(showMeta? : boolean, withPlaceholderArea? : boolean) : Promise<void> {
        let app_uiA = this.getApp().uiA;
        if (showMeta) {
            await this.installMeta();
        }
        this.contentUi = await this.entity.uiA.createSubUiFor_transmitEditability(app_uiA.content);
        this.focusStyle_update();
        this.htmlElement.style.backgroundColor = app_uiA.theme.backgroundColor;
        this.htmlElement.style.color = app_uiA.theme.fontColor;
        this.htmlElement.style.height = '100%';
        this.htmlElement.style.display = 'flex';
        this.htmlElement.style.flexDirection = 'column';
        this.htmlElement.appendChild(this.statusBar);
        this.htmlElement.appendChild(this.scrollableArea);
        this.scrollableArea.style.overflowY = 'scroll';
        this.scrollableArea.style.paddingLeft = '0.2rem';
        this.scrollableArea.style.paddingRight = '0.2rem';
        this.statusBar.style.backgroundColor = app_uiA.theme.secondBackgroundColor;
        this.statusBar.style.minHeight = '1.2rem';
        this.statusBar.style.maxHeight = '1.2rem';
        this.scrollableArea.appendChild(this.meta_htmlElement);
        this.scrollableArea.appendChild(this.focusStyle_marker);
        let contentWrapper = div();
        this.scrollableArea.appendChild(contentWrapper);
        contentWrapper.appendChild(this.contentUi.htmlElement);
        let updateWidth = () => {
            let maxContentWidth = 600;
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
        this.commands = this.createCommands();
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
        this.focus(this.contentUi.listG.uisOfListItems[position]);
    }

    async paste() {
        let position = 0;
        let listA = this.getObject().appA.uiA.content.listA;
        await listA.insertObjectAtPosition(this.getObject().appA.uiA.clipboard, position);
        await this.contentUi.update_addedListItem(position);
        this.focus(this.contentUi.listG.uisOfListItems[position]);
    }

    focus(ui : UiA) {
        let focusedPrevious = this.focused;
        this.focused = ui;
        if (focusedPrevious) {
            focusedPrevious.updateFocusStyle();
        }
        this.focused.updateFocusStyle();
        this.focused.takeCaret();
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
            this.focusStyle_marker.style.backgroundColor = this.getApp().uiA.theme.focusBorderColor;
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

    createCommands() : Entity {
        let lowPriorityCommands = this.getApp().unboundG.createTextWithList('mehr',
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
        lowPriorityCommands.collapsible = true;
        return this.getApp().unboundG.createTextWithList('commands',
            this.getApp().unboundG.createButton('default action', async () => {
                await this.globalEventG.defaultAction();
            }),
            this.getApp().unboundG.createButton('new subitem', async () => {
                await this.globalEventG.newSubitem();
            }),
            this.getApp().unboundG.createButton('toggle collapsible', async () => {
                await this.globalEventG.toggleCollapsible();
            }),
            this.getApp().unboundG.createButton('expand/collapse', async () => {
                await this.globalEventG.expandOrCollapse();
            }),
            this.getApp().unboundG.createButton('export', async () => {
                await this.globalEventG.export();
            }),
            this.getApp().unboundG.createButton('load', async () => {
                await this.globalEventG.load();
            }),
            this.getApp().unboundG.createButton('mark', async () => {
                await this.globalEventG.mark();
            }),
            this.getApp().unboundG.createButton('cut', async () => {
                await this.globalEventG.cut();
            }),
            this.getApp().unboundG.createButton('deep copy (marked object will be copied into focused container)', async () => {
                await this.globalEventG.deepCopy();
            }),
            this.getApp().unboundG.createButton('paste', async () => {
                await this.globalEventG.paste();
            }),
            this.getApp().unboundG.createButton('paste next', async () => {
                await this.globalEventG.pasteNext();
            }),
            this.getApp().unboundG.createButton('focus root', async () => {
                await this.globalEventG.focusRoot();
            }),
            this.getApp().unboundG.createButton('toggle context', async () => {
                await this.globalEventG.toggleContext();
            }),
            this.getApp().unboundG.createButton('shake tree', async () => {
                await this.globalEventG.shakeTree();
            }),
            lowPriorityCommands
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