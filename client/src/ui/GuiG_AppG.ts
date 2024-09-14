import type {Entity} from "@/Entity";

// TODO: integrate in AppA_UiA
export class GuiG_AppG {

    readonly htmlElement: HTMLElement = document.createElement('div');
    private rawText: string;

    constructor(private entity : Entity) {
    }

    async unsafeUpdate() : Promise<void> {
        if (this.entity.appA.ui.topImpressum) {
            await this.entity.appA.ui.topImpressum.update();
        }
        if (!this.entity.appA.ui.isWebsite && !this.entity.appA.testA) {
            await this.entity.appA.ui.commands.update();
            await this.entity.appA.ui.input.getUi().update();
            await this.entity.appA.ui.output.getUi().update();
            this.entity.appA.ui.content.uiG.editable = true;
            await this.entity.appA.ui.content.update();
        }
        this.updateUiElement();
    }

    private updateUiElement() {
        this.htmlElement.innerHTML = null;
        if (this.entity.appA.ui.topImpressum) {
            this.htmlElement.appendChild(this.entity.appA.ui.topImpressum.uiG.htmlElement);
            this.htmlElement.appendChild(this.separatorLine());
        }
        if (this.entity.appA.ui.commands) {
            this.htmlElement.appendChild(this.entity.appA.ui.commands.uiG.htmlElement);
        }
        if (!this.entity.appA.ui.isWebsite && !this.entity.appA.testA) {
            this.htmlElement.appendChild(this.entity.appA.ui.input.getUi().uiG.htmlElement);
            this.htmlElement.appendChild(this.entity.appA.ui.output.getUi().uiG.htmlElement);
            this.htmlElement.appendChild(this.separatorLine());
        }
        this.htmlElement.appendChild(this.entity.appA.ui.content.uiG.htmlElement);
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
        if (this.entity.appA.ui.topImpressum) {
            this.rawText += this.entity.appA.ui.topImpressum.uiG.getRawText();
        }
        if (this.entity.appA.testA) {
            this.rawText += this.entity.appA.ui.content.uiG.getRawText();
        } else {
            if (this.entity.appA.ui.commands) {
                this.rawText += this.entity.appA.ui.commands.uiG.getRawText();
            }
            if (!this.entity.appA.ui.isWebsite) {
                this.rawText += this.entity.appA.ui.output.getUi().uiG.getRawText();
                this.rawText += this.entity.appA.ui.input.getUi().uiG.getRawText();
            }
            this.rawText += this.entity.appA.ui.content.uiG.getRawText();
        }
        return this.rawText;
    }

    async click(text : string) {
        if (this.entity.appA.ui.commands) {
            await this.entity.appA.ui.commands.uiG.click(text);
        }
        if (!this.entity.appA.ui.isWebsite) {
            await this.entity.appA.ui.output.getUi().uiG.click(text);
            await this.entity.appA.ui.input.getUi().uiG.click(text);
        }
        await this.entity.appA.ui.content.uiG.click(text);
    }

    countEditableTexts() : number {
        let counter = 0;
        if (this.entity.appA.ui.commands) {
            counter += this.entity.appA.ui.commands.uiG.countEditableTexts();
        }
        if (!this.entity.appA.ui.isWebsite) {
            counter += this.entity.appA.ui.output.getUi().uiG.countEditableTexts();
            counter += this.entity.appA.ui.input.getUi().uiG.countEditableTexts();
        }
        counter += this.entity.appA.ui.content.uiG.countEditableTexts();
        return counter;
    }
}