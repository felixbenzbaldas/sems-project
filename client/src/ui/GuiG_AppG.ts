import type {Entity} from "@/Entity";

export class GuiG_AppG {

    readonly uiElement = document.createElement('div');
    private rawText: string;

    constructor(private entity : Entity) {
    }

    async unsafeUpdate() : Promise<void> {
        if (!this.entity.appA.ui.isWebsite) {
            this.entity.appA.ui.content.guiG.editable = true;
            this.entity.appA.ui.content.update();
        }
        this.updateUiElement();
    }

    private updateUiElement() {
        this.uiElement.innerHTML = null;
        if (this.entity.appA.ui.commands) {
            this.uiElement.appendChild(this.entity.appA.ui.commands.guiG.uiElement);
        }
        if (!this.entity.appA.ui.isWebsite) {
            this.uiElement.appendChild(this.entity.appA.ui.output.getUi().guiG.uiElement);
            this.uiElement.appendChild(this.entity.appA.ui.input.getUi().guiG.uiElement);
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
        if (this.entity.appA.ui.commands) {
            this.addRawText(this.entity.appA.ui.commands.guiG.getRawText());
        }
        if (!this.entity.appA.ui.isWebsite) {
            this.addRawText(this.entity.appA.ui.output.getUi().guiG.getRawText());
            this.addRawText(this.entity.appA.ui.input.getUi().guiG.getRawText());
        }
        this.addRawText(this.entity.appA.ui.content.guiG.getRawText());
        return this.rawText;
    }

    private addRawText(text : string) {
        this.rawText += text;
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