import {Entity} from "@/Entity";
import {OutputA} from "@/ui/OutputA";
import {InputA} from "@/ui/InputA";
import {notNullUndefined} from "@/utils";

export class AppA_UiA {

    readonly content: Entity;
    commands: Entity;
    isWebsite: boolean;
    readonly output : OutputA;
    readonly input : InputA;
    focused : Entity;
    topImpressum: Entity;

    constructor(private entity: Entity) {
        this.content = entity.appA.simple_createList();
        this.content.container = entity;
        this.output = new OutputA(entity);
        this.input = new InputA(entity);
        this.focused = entity;
    }

    async globalEvent_defaultAction() {
        await this.focused.defaultAction();
    }

    async globalEvent_exportApp() {
        await this.output.set(JSON.stringify(await this.entity.export_keepContainerStructure_ignoreExternalDependencies()));
    }

    async globalEvent_exportContent() {
        await this.output.set(JSON.stringify(await this.content.export_allDependenciesInOneContainer()));
    }

    async globalEvent_importToContent() {
        await this.input.showInput();
        await this.entity.appA.addAllToListFromRawData(this.content, JSON.parse(this.input.get()));
    }

    async defaultAction() {
        let created = await this.entity.appA.createText('');
        await this.content.list.add(created);
        this.focused = created;
    }

    async focus(entity: Entity) {
        this.focused = entity;
    }

    async globalEvent_toggleCollapsible() {
        await this.focused.toggleCollapsible();
    }

    async globalEvent_newSubitem() {
        console.log('globalEvent_newSubitem');
        await this.focused.newSubitem();
    }

    async globalEvent_expandOrCollapse() {
        await this.focused.expandOrCollapse();
    }

    //////////////////////////


    readonly htmlElement: HTMLElement = document.createElement('div');
    private rawText: string;

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
        this.rawText = '';
        if (this.topImpressum) {
            this.rawText += this.topImpressum.uiG.getRawText();
        }
        if (this.entity.appA.testA) {
            this.rawText += this.content.uiG.getRawText();
        } else {
            if (this.commands) {
                this.rawText += this.commands.uiG.getRawText();
            }
            if (!this.isWebsite) {
                this.rawText += this.output.getUi().uiG.getRawText();
                this.rawText += this.input.getUi().uiG.getRawText();
            }
            this.rawText += this.content.uiG.getRawText();
        }
        return this.rawText;
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