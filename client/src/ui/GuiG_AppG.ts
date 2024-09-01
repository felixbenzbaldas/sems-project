import type {Identity} from "@/Identity";

export class GuiG_AppG {

    readonly uiElement = document.createElement('div');
    private rawText: string;

    constructor(private identity : Identity) {
    }

    async unsafeUpdate() : Promise<void> {
        if (this.identity.appA.ui.commands) {
            await this.identity.appA.ui.commands.guiG.update();
        }
        if (!this.identity.appA.ui.isWebsite) {
            await this.identity.appA.ui.output.getUi().guiG.update();
            await this.identity.appA.ui.input.getUi().guiG.update();
            this.identity.appA.ui.content.guiG.editable = true;
        }
        await this.identity.appA.ui.content.guiG.update();
        this.updateUiElement();
    }

    private updateUiElement() {
        this.uiElement.innerHTML = null;
        if (this.identity.appA.ui.commands) {
            this.uiElement.appendChild(this.identity.appA.ui.commands.guiG.uiElement);
        }
        if (!this.identity.appA.ui.isWebsite) {
            this.uiElement.appendChild(this.identity.appA.ui.output.getUi().guiG.uiElement);
            this.uiElement.appendChild(this.identity.appA.ui.input.getUi().guiG.uiElement);
            this.uiElement.appendChild(this.separatorLine());
        }
        this.uiElement.appendChild(this.identity.appA.ui.content.guiG.uiElement);
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
        if (this.identity.appA.ui.commands) {
            this.addRawText(this.identity.appA.ui.commands.guiG.getRawText());
        }
        if (!this.identity.appA.ui.isWebsite) {
            this.addRawText(this.identity.appA.ui.output.getUi().guiG.getRawText());
            this.addRawText(this.identity.appA.ui.input.getUi().guiG.getRawText());
        }
        this.addRawText(this.identity.appA.ui.content.guiG.getRawText());
        return this.rawText;
    }

    private addRawText(text : string) {
        this.rawText += text;
    }

    async click(text : string) {
        if (this.identity.appA.ui.commands) {
            await this.identity.appA.ui.commands.guiG.click(text);
        }
        if (!this.identity.appA.ui.isWebsite) {
            await this.identity.appA.ui.output.getUi().guiG.click(text);
            await this.identity.appA.ui.input.getUi().guiG.click(text);
        }
        await this.identity.appA.ui.content.guiG.click(text);
    }

    countEditableTexts() : number {
        let counter = 0;
        if (this.identity.appA.ui.commands) {
            counter += this.identity.appA.ui.commands.guiG.countEditableTexts();
        }
        if (!this.identity.appA.ui.isWebsite) {
            counter += this.identity.appA.ui.output.getUi().guiG.countEditableTexts();
            counter += this.identity.appA.ui.input.getUi().guiG.countEditableTexts();
        }
        counter += this.identity.appA.ui.content.guiG.countEditableTexts();
        return counter;
    }
}