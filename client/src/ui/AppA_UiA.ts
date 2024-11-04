import {Entity} from "@/Entity";
import {OutputA} from "@/ui/OutputA";
import {InputA} from "@/ui/InputA";
import {AppA_UiA_GlobalEventG} from "@/ui/AppA_UiA_GlobalEventG";
import {UiA} from "@/ui/UiA";
import {ContainerA} from "@/ContainerA";
import {AppA_UiA_KeyG} from "@/ui/AppA_UiA_KeyG";
import type {AppA} from "@/AppA";

export class AppA_UiA {

    readonly content: Entity;
    commands: Entity;
    isWebsite: boolean;
    readonly output : OutputA;
    readonly input : InputA;
    focused : Entity;
    readonly htmlElement: HTMLElement = document.createElement('div');
    globalEventG: AppA_UiA_GlobalEventG;
    withPlaceholderArea: boolean;
    showMeta : boolean;
    clipboard: Entity;
    webMeta: Entity;
    keyG: AppA_UiA_KeyG;

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
        if (this.showMeta) {
            if (this.commands) {
                this.htmlElement.appendChild(this.commands.uiA.htmlElement);
            }
            this.htmlElement.appendChild(this.input.getUi().uiA.htmlElement);
            this.htmlElement.appendChild(this.output.getUi().uiA.htmlElement);
            this.htmlElement.appendChild(this.separatorLine());
        }
        this.htmlElement.appendChild(this.focusStyle_marker);
        this.htmlElement.appendChild(this.content.uiA.htmlElement);
        if (this.withPlaceholderArea) {
            this.htmlElement.appendChild(this.createPlaceholderArea());
        }
        if (this.webMeta) {
            this.htmlElement.appendChild(this.webMeta.uiA.htmlElement);
        }
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
            this.focusStyle_marker.style.backgroundColor = 'orange';
        } else {
            this.focusStyle_marker.style.backgroundColor = 'white';
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
        object.uis_add(ui);
        return ui;
    }

    createUiFor_typed(object: Entity) : UiA {
        return this.createUiFor(object).uiA;
    }

    createCommands() : Entity {
        return this.getApp().unboundG.createTextWithList('commands',
            this.getApp().unboundG.createButton('default action', async () => {
                await this.getApp().uiA.globalEventG.defaultAction();
            }),
            this.getApp().unboundG.createButton('new subitem', async () => {
                await this.getApp().uiA.globalEventG.newSubitem();
            }),
            this.getApp().unboundG.createButton('toggle collapsible', async () => {
                await this.getApp().uiA.globalEventG.toggleCollapsible();
            }),
            this.getApp().unboundG.createButton('expand/collapse', async () => {
                await this.getApp().uiA.globalEventG.expandOrCollapse();
            }),
            this.getApp().unboundG.createButton('switch current container', async () => {
                await this.getApp().uiA.globalEventG.switchCurrentContainer();
            }),
            this.getApp().unboundG.createButton('switch to app container', async () => {
                await this.getApp().uiA.globalEventG.switchToAppContainer();
            }),
            this.getApp().unboundG.createButton('export', async () => {
                await this.getApp().uiA.globalEventG.export();
            }),
            this.getApp().unboundG.createButton('export app', async () => {
                await this.getApp().uiA.globalEventG.exportApp();
            }),
            this.getApp().unboundG.createButton('import', async () => {
                await this.getApp().uiA.globalEventG.import();
            }),
            this.getApp().unboundG.createButton('focus root', async () => {
                await this.getApp().uiA.globalEventG.focusRoot();
            }),
            this.getApp().unboundG.createButton('cut', async () => {
                await this.getApp().uiA.globalEventG.cut();
            }),
            this.getApp().unboundG.createButton('paste next', async () => {
                await this.getApp().uiA.globalEventG.pasteNext();
            }),
            // this.entity.appA.unboundG.createButton('flat export content', async () => {
            //     await this.entity.appA.uiA.globalEventG.flatExportContent();
            // }),
            // this.entity.appA.unboundG.createButton('flat import to content', async () => {
            //     await this.entity.appA.uiA.globalEventG.flatImportToContent();
            // }),
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
}