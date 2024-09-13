import type {Entity} from "@/Entity";

export class GuiG_AppG {

    readonly uiElement = document.createElement('div');
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
            this.entity.appA.ui.content.guiG.editable = true;
            await this.entity.appA.ui.content.update();
        }
        this.updateUiElement();
    }

    private updateUiElement() {
        this.uiElement.innerHTML = null;
        if (this.entity.appA.ui.topImpressum) {
            this.uiElement.appendChild(this.entity.appA.ui.topImpressum.guiG.uiElement);
            this.uiElement.appendChild(this.separatorLine());
        }
        if (this.entity.appA.ui.commands) {
            this.uiElement.appendChild(this.entity.appA.ui.commands.guiG.uiElement);
        }
        if (!this.entity.appA.ui.isWebsite && !this.entity.appA.testA) {
            this.uiElement.appendChild(this.entity.appA.ui.input.getUi().guiG.uiElement);
            this.uiElement.appendChild(this.entity.appA.ui.output.getUi().guiG.uiElement);
            this.uiElement.appendChild(this.separatorLine());
        }
        this.uiElement.appendChild(this.entity.appA.ui.content.guiG.uiElement);
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
            this.rawText += this.entity.appA.ui.topImpressum.guiG.getRawText();
        }
        if (this.entity.appA.testA) {
            this.rawText += this.entity.appA.ui.content.guiG.getRawText();
        } else {
            if (this.entity.appA.ui.commands) {
                this.rawText += this.entity.appA.ui.commands.guiG.getRawText();
            }
            if (!this.entity.appA.ui.isWebsite) {
                this.rawText += this.entity.appA.ui.output.getUi().guiG.getRawText();
                this.rawText += this.entity.appA.ui.input.getUi().guiG.getRawText();
            }
            this.rawText += this.entity.appA.ui.content.guiG.getRawText();
        }
        return this.rawText;
    }

    async click(text : string) {
        if (this.entity.appA.ui.commands) {
            await this.entity.appA.ui.commands.guiG.click(text);
        }
        if (!this.entity.appA.ui.isWebsite) {
            await this.entity.appA.ui.output.getUi().guiG.click(text);
            await this.entity.appA.ui.input.getUi().guiG.click(text);
        }
        await this.entity.appA.ui.content.guiG.click(text);
    }

    countEditableTexts() : number {
        let counter = 0;
        if (this.entity.appA.ui.commands) {
            counter += this.entity.appA.ui.commands.guiG.countEditableTexts();
        }
        if (!this.entity.appA.ui.isWebsite) {
            counter += this.entity.appA.ui.output.getUi().guiG.countEditableTexts();
            counter += this.entity.appA.ui.input.getUi().guiG.countEditableTexts();
        }
        counter += this.entity.appA.ui.content.guiG.countEditableTexts();
        return counter;
    }
}