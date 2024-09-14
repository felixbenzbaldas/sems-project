import {Entity} from "@/Entity";
import {OutputA} from "@/ui/OutputA";
import {InputA} from "@/ui/InputA";
import {AppA_UiA_GlobalEventG} from "@/ui/AppA_UiA_GlobalEventG";

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

    constructor(private entity: Entity) {
        this.content = entity.appA.simple_createList();
        this.content.container = entity;
        this.output = new OutputA(entity);
        this.input = new InputA(entity);
        this.globalEventG = new AppA_UiA_GlobalEventG(entity);
        this.focused = entity;
    }

    async defaultAction() {
        let created = await this.entity.appA.createText('');
        await this.content.list.add(created);
        this.focused = created;
    }

    async focus(entity: Entity) {
        this.focused = entity;
    }

    async unsafeUpdate() : Promise<void> {
        if (this.topImpressum) {
            await this.topImpressum.update();
        }
        if (!this.isWebsite && !this.entity.appA.testA) {
            await this.commands.update();
            await this.input.getUi().update();
            await this.output.getUi().update();
            this.content.uiG.editable = true;
            await this.content.update();
        }
        this.updateUiElement();
    }

    private updateUiElement() {
        this.htmlElement.innerHTML = null;
        if (this.topImpressum) {
            this.htmlElement.appendChild(this.topImpressum.uiG.htmlElement);
            this.htmlElement.appendChild(this.separatorLine());
        }
        if (this.commands) {
            this.htmlElement.appendChild(this.commands.uiG.htmlElement);
        }
        if (!this.isWebsite && !this.entity.appA.testA) {
            this.htmlElement.appendChild(this.input.getUi().uiG.htmlElement);
            this.htmlElement.appendChild(this.output.getUi().uiG.htmlElement);
            this.htmlElement.appendChild(this.separatorLine());
        }
        this.htmlElement.appendChild(this.content.uiG.htmlElement);
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
            rawText += this.topImpressum.uiG.getRawText();
        }
        if (this.entity.appA.testA) {
            rawText += this.content.uiG.getRawText();
        } else {
            if (this.commands) {
                rawText += this.commands.uiG.getRawText();
            }
            if (!this.isWebsite) {
                rawText += this.output.getUi().uiG.getRawText();
                rawText += this.input.getUi().uiG.getRawText();
            }
            rawText += this.content.uiG.getRawText();
        }
        return rawText;
    }

    async click(text : string) {
        if (this.commands) {
            await this.commands.uiG.click(text);
        }
        if (!this.isWebsite) {
            await this.output.getUi().uiG.click(text);
            await this.input.getUi().uiG.click(text);
        }
        await this.content.uiG.click(text);
    }

    countEditableTexts() : number {
        let counter = 0;
        if (this.commands) {
            counter += this.commands.uiG.countEditableTexts();
        }
        if (!this.isWebsite) {
            counter += this.output.getUi().uiG.countEditableTexts();
            counter += this.input.getUi().uiG.countEditableTexts();
        }
        counter += this.content.uiG.countEditableTexts();
        return counter;
    }
}