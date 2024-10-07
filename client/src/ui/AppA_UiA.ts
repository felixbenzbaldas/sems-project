import {Entity} from "@/Entity";
import {OutputA} from "@/ui/OutputA";
import {InputA} from "@/ui/InputA";
import {AppA_UiA_GlobalEventG} from "@/ui/AppA_UiA_GlobalEventG";
import {UiA} from "@/ui/UiA";
import {ContainerA} from "@/core/ContainerA";
import {Static} from "@/Static";

export class AppA_UiA {

    readonly content: Entity;
    commands: Entity;
    isWebsite: boolean;
    readonly output : OutputA;
    readonly input : InputA;
    focused : Entity;
    topImpressum: Entity;
    readonly htmlElement: HTMLElement = document.createElement('div');
    globalEventG: AppA_UiA_GlobalEventG;
    withPlaceholderArea: boolean;
    showMeta : boolean;

    private focusStyle_marker: HTMLElement;

    constructor(private entity: Entity) {
        this.content = entity.appA.unboundG.createList();
        this.content.uiA = new UiA(this.content);
        this.content.container = entity;
        this.output = new OutputA(entity);
        this.input = new InputA(entity);
        this.globalEventG = new AppA_UiA_GlobalEventG(entity);
        this.focused = entity;
        this.focusStyle_marker = this.focusStyle_createMarker();
    }

    async newSubitem() {
        let created = await this.entity.appA.createText('');
        await this.content.list.addAndUpdateUi(created);
        this.focus(created);
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
        if (this.topImpressum) {
            await this.topImpressum.updateUi();
        }
        if (this.showMeta) {
            await this.commands.updateUi();
            await this.input.getUi().updateUi();
            await this.output.getUi().updateUi();
        }
        this.content.uiA.editable = this.entity.uiA.editable;
        this.focusStyle_update();
        await this.content.updateUi();
        this.updateUiElement();
    }

    private updateUiElement() {
        this.htmlElement.innerHTML = null;
        if (this.topImpressum) {
            this.htmlElement.appendChild(this.topImpressum.uiA.htmlElement);
            this.htmlElement.appendChild(this.separatorLine());
        }
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
        if (this.topImpressum) {
            rawText += this.topImpressum.uiA.getRawText();
        }
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
        if (this.focused === this.entity && Static.activeApp === this.entity) {
            this.focusStyle_marker.style.backgroundColor = 'orange';
        } else {
            this.focusStyle_marker.style.backgroundColor = 'white';
        }
    }

    switchCurrentContainer_updateStyles(entity: Entity) {
        let previous = this.entity.appA.currentContainer;
        this.entity.appA.switchCurrentContainer(entity);
        previous.uiA.headerG.updateCurrentContainerStyle();
        this.entity.appA.currentContainer.uiA.headerG.updateCurrentContainerStyle();
    }
}