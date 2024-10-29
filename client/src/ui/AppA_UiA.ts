import {Entity} from "@/Entity";
import {OutputA} from "@/ui/OutputA";
import {InputA} from "@/ui/InputA";
import {AppA_UiA_GlobalEventG} from "@/ui/AppA_UiA_GlobalEventG";
import {UiA} from "@/ui/UiA";
import {ContainerA} from "@/ContainerA";
import {AppA_UiA_KeyG} from "@/ui/AppA_UiA_KeyG";

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

    private focusStyle_marker: HTMLElement;

    constructor(private entity: Entity) {
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
        let created = await this.entity.appA.createText('');
        let uiForCreated = await this.content.uiA.listG.insertObjectAtPosition(created, 0);
        await this.content.uiA.update(); // TODO update in insertObjectAtPosition (without deleting old uis)
        this.focus(this.content.uiA.listG.uisOfListItems.at(0));
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
        if (this.entity.appA.testA) {
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
        let previous = this.entity.appA.currentContainer;
        this.entity.appA.switchCurrentContainer(newContainer);
        previous.uis_update_currentContainerStyle();
        this.entity.appA.currentContainer.uis_update_currentContainerStyle();
    }

    createUiFor(object: Entity) : Entity {
        let ui : Entity = this.entity.getApp().appA.createEntityWithApp();
        ui.uiA = new UiA(ui);
        ui.uiA.object = object;
        object.uis_add(ui);
        return ui;
    }

    createCommands() : Entity {
        return this.entity.appA.unboundG.createTextWithList('commands',
            this.entity.appA.unboundG.createButton('default action', async () => {
                await this.entity.appA.uiA.globalEventG.defaultAction();
            }),
            this.entity.appA.unboundG.createButton('new subitem', async () => {
                await this.entity.appA.uiA.globalEventG.newSubitem();
            }),
            this.entity.appA.unboundG.createButton('toggle collapsible', async () => {
                await this.entity.appA.uiA.globalEventG.toggleCollapsible();
            }),
            this.entity.appA.unboundG.createButton('expand/collapse', async () => {
                await this.entity.appA.uiA.globalEventG.expandOrCollapse();
            }),
            this.entity.appA.unboundG.createButton('switch current container', async () => {
                await this.entity.appA.uiA.globalEventG.switchCurrentContainer();
            }),
            this.entity.appA.unboundG.createButton('switch to app container', async () => {
                await this.entity.appA.uiA.globalEventG.switchToAppContainer();
            }),
            this.entity.appA.unboundG.createButton('export', async () => {
                await this.entity.appA.uiA.globalEventG.export();
            }),
            this.entity.appA.unboundG.createButton('export app', async () => {
                await this.entity.appA.uiA.globalEventG.exportApp();
            }),
            this.entity.appA.unboundG.createButton('import', async () => {
                await this.entity.appA.uiA.globalEventG.import();
            }),
            this.entity.appA.unboundG.createButton('focus root', async () => {
                await this.entity.appA.uiA.globalEventG.focusRoot();
            }),
            this.entity.appA.unboundG.createButton('cut', async () => {
                await this.entity.appA.uiA.globalEventG.cut();
            }),
            this.entity.appA.unboundG.createButton('paste next', async () => {
                await this.entity.appA.uiA.globalEventG.pasteNext();
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
        if (this.entity.appA.environment) {
            return this.entity.appA.environment.activeApp === this.entity;
        } else {
            return true;
        }
    }

}