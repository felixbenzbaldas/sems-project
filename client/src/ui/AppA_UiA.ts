import {Entity} from "@/Entity";
import {OutputA} from "@/ui/OutputA";
import {InputA} from "@/ui/InputA";
import {AppA_UiA_GlobalEventG} from "@/ui/AppA_UiA_GlobalEventG";
import {UiA} from "@/ui/UiA";
import {ContainerA} from "@/ContainerA";
import {AppA_UiA_KeyG} from "@/ui/AppA_UiA_KeyG";
import type {AppA} from "@/AppA";
import {notNullUndefined, textElem} from "@/utils";
import {Color} from "@/ui/Color";

export class AppA_UiA {

    readonly content: Entity;
    commands: Entity;
    isWebsite: boolean;
    readonly output : OutputA;
    readonly input : InputA;
    focused : Entity;
    readonly htmlElement: HTMLElement = document.createElement('div');
    scrollableArea : HTMLElement;
    statusBar: HTMLDivElement;
    globalEventG: AppA_UiA_GlobalEventG;
    withPlaceholderArea: boolean;
    showMeta : boolean;
    clipboard: Entity;
    clipboard_lostContext: boolean;
    webMeta: Entity;
    keyG: AppA_UiA_KeyG;
    theme_fontColor : string = 'unset';
    theme_backgroundColor : string = 'white';
    theme_secondBackgroundColor: string = Color.LIGHT_GREY;
    theme_buttonFontColor: string = 'grey';
    theme_markColor: string = '#efefef';
    theme_secondMarkColor : string = 'green';
    theme_focusBorderColor: string = 'orange';
    theme_highlight: string = 'green';
    theme_success : string = 'green';
    theme_failure : string = 'red';
    theme_meta: string = 'blue';
    theme_font: string = 'unset';
    theme_fontSize: string = '1rem';

    private isInstalled : boolean;
    private focusStyle_marker: HTMLElement;

    constructor(public entity: Entity) {
        this.content = entity.appA.unboundG.createList();
        this.content.uiA = new UiA(this.content);
        this.content.container = entity;
        this.output = new OutputA(entity);
        this.input = new InputA(entity);
        this.globalEventG = new AppA_UiA_GlobalEventG(entity);
        this.keyG = new AppA_UiA_KeyG(entity);
        this.focused = entity;
        this.focusStyle_marker = this.focusStyle_createMarker();
    }

    async newSubitem() {
        await this.ensureInstalled();
        let created = await this.getApp().createText('');
        let position = 0;
        let listA = this.content.listA;
        await listA.insertObjectAtPosition(created, position);
        await this.content.uiA.listG.update_addedListItem(position);
        this.entity.getApp().appA.uiA.focus(this.content.uiA.listG.uisOfListItems.at(position));
    }

    async paste() {
        await this.ensureInstalled();
        let position = 0;
        let listA = this.content.listA;
        await listA.insertObjectAtPosition(this.clipboard, position);
        await this.content.uiA.listG.update_addedListItem(position);
        this.entity.getApp().appA.uiA.focus(this.content.uiA.listG.uisOfListItems.at(position));
    }

    private async ensureInstalled() { // TODO this should not be necessary
        if (!this.isInstalled) {
            await this.update();
        }
    }

    focus(entity: Entity) {
        let focusedPrevious = this.focused;
        this.focused = entity;
        if (focusedPrevious) {
            focusedPrevious.uiA.updateFocusStyle();
        }
        this.focused.uiA.updateFocusStyle();
        this.focused.uiA.takeCaret();
    }

    async update() : Promise<void> {
        if (notNullUndefined(this.theme_fontColor)) {
            this.htmlElement.style.backgroundColor = this.theme_backgroundColor;
            this.htmlElement.style.color = this.theme_fontColor;
        }
        if (this.showMeta) {
            await this.commands.updateUi();
            await this.input.getUi().updateUi();
            await this.output.getUi().updateUi();
        }
        this.content.uiA.editable = this.entity.uiA.editable;
        this.focusStyle_update();
        await this.content.updateUi();
        if (this.webMeta) {
            await this.webMeta.updateUi();
        }
        this.updateUiElement();
        this.isInstalled = true;
    }

    private updateUiElement() {
        this.htmlElement.innerHTML = null;
        this.htmlElement.style.height = '100%';
        this.htmlElement.style.display = 'flex';
        this.htmlElement.style.flexDirection = 'column';
        this.scrollableArea = document.createElement('div');
        this.statusBar = document.createElement('div');
        this.htmlElement.appendChild(this.statusBar);
        this.htmlElement.appendChild(this.scrollableArea);
        this.scrollableArea.style.overflowY = 'auto';
        this.scrollableArea.style.paddingLeft = '0.2rem';
        this.scrollableArea.style.paddingRight = '0.2rem';
        this.statusBar.style.backgroundColor = this.theme_secondBackgroundColor;
        this.statusBar.style.minHeight = '1.2rem';
        this.statusBar.style.maxHeight = '1.2rem';
        if (this.showMeta) {
            if (this.commands) {
                this.scrollableArea.appendChild(this.commands.uiA.htmlElement);
            }
            this.scrollableArea.appendChild(this.input.getUi().uiA.htmlElement);
            this.scrollableArea.appendChild(this.output.getUi().uiA.htmlElement);
            this.scrollableArea.appendChild(this.separatorLine());
        }
        this.scrollableArea.appendChild(this.focusStyle_marker);
        this.scrollableArea.appendChild(this.content.uiA.htmlElement);
        if (this.withPlaceholderArea) {
            this.scrollableArea.appendChild(this.createPlaceholderArea());
        }
        if (this.webMeta) {
            this.scrollableArea.appendChild(this.webMeta.uiA.htmlElement);
        }
    }

    signal(text : string) {
        this.statusBar.innerHTML = null;
        let textHtmlElement = textElem(text);
        this.statusBar.appendChild(textHtmlElement);
        textHtmlElement.style.backgroundColor = this.theme_highlight;
        textHtmlElement.style.display = 'inline';
        textHtmlElement.style.marginLeft = '0.5rem';
        setTimeout(()=> {
            textHtmlElement.style.backgroundColor = this.theme_secondBackgroundColor;
        }, 800);
    }

    private separatorLine() : HTMLElement {
        let line: HTMLDivElement = document.createElement('div');
        line.style.marginBottom = '0.5rem';
        line.style.paddingBottom = '0.5rem';
        line.style.borderBottom = 'dashed';
        return line;
    }

    getRawText() : string {
        let rawText = '';
        if (this.getApp().testA) {
            rawText += this.content.uiA.getRawText();
        } else {
            if (this.showMeta) {
                if (this.commands) {
                    rawText += this.commands.uiA.getRawText();
                }
                rawText += this.output.getUi().uiA.getRawText();
                rawText += this.input.getUi().uiA.getRawText();
            }
            rawText += this.content.uiA.getRawText();
        }
        if (this.webMeta) {
            rawText += this.webMeta.uiA.getRawText();
        }
        return rawText;
    }

    async click(text : string) {
        if (this.showMeta) {
            if (this.commands) {
                await this.commands.uiA.click(text);
            }
            await this.output.getUi().uiA.click(text);
            await this.input.getUi().uiA.click(text);
        }
        await this.content.uiA.click(text);
    }

    countEditableTexts() : number {
        let counter = 0;
        if (this.showMeta) {
            if (this.commands) {
                counter += this.commands.uiA.countEditableTexts();
            }
            counter += this.output.getUi().uiA.countEditableTexts();
            counter += this.input.getUi().uiA.countEditableTexts();
        }
        counter += this.content.uiA.countEditableTexts();
        return counter;
    }

    private createPlaceholderArea() : HTMLElement {
        let placeholderAreaDiv = document.createElement('div');
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
        let div = document.createElement('div');
        div.style.height = '0.2rem';
        return div;
    }

    focusStyle_update() {
        if (this.focused === this.entity && this.isActive()) {
            this.focusStyle_marker.style.backgroundColor = this.theme_focusBorderColor;
        } else {
            this.focusStyle_marker.style.backgroundColor = this.theme_backgroundColor;
        }
    }

    switchCurrentContainer_AndUpdateStyles(newContainer: Entity) {
        let previous = this.getApp().currentContainer;
        this.getApp().switchCurrentContainer(newContainer);
        previous.uis_update_currentContainerStyle();
        this.getApp().currentContainer.uis_update_currentContainerStyle();
    }

    createUiFor(object: Entity) : Entity {
        let ui : Entity = this.entity.getApp().appA.createEntityWithApp();
        ui.uiA = new UiA(ui);
        ui.uiA.object = object;
        object.uis_add(ui.uiA);
        return ui;
    }

    createUiFor_typed(object: Entity) : UiA {
        return this.createUiFor(object).uiA;
    }

    createCommands() : Entity {
        let lowPriorityCommands = this.getApp().unboundG.createTextWithList('mehr',
            this.getApp().unboundG.createButton('switch to app container', async () => {
                await this.globalEventG.switchToAppContainer();
            }),
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
            this.getApp().unboundG.createButton('switch current container', async () => {
                await this.globalEventG.switchCurrentContainer();
            }),
            this.getApp().unboundG.createButton('export', async () => {
                await this.globalEventG.export();
            }),
            this.getApp().unboundG.createButton('load', async () => {
                await this.globalEventG.load();
            }),
            this.getApp().unboundG.createButton('import', async () => {
                await this.globalEventG.import();
            }),
            this.getApp().unboundG.createButton('mark', async () => {
                await this.globalEventG.mark();
            }),
            this.getApp().unboundG.createButton('cut', async () => {
                await this.globalEventG.cut();
            }),
            this.getApp().unboundG.createButton('deep copy', async () => {
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
        if (this.getApp().environment) {
            return this.getApp().environment.activeApp === this.entity;
        } else {
            return true;
        }
    }

    getApp() : AppA {
        return this.entity.appA;
    }

    async insertClipboardAtPosition(object: Entity, position: number) {
        await object.listA.insertObjectAtPosition(this.clipboard, position);
        if (this.clipboard_lostContext) {
            if (notNullUndefined(object.text)) {
                this.clipboard.context = this.clipboard.getPath(object);
                this.clipboard_lostContext = false;
            }
        }
        await object.uis_update_addedListItem(position);
    }
}