import type {Identity} from "@/Identity";
import {notNullUndefined} from "@/utils";
import {GuiG_AppG} from "@/ui/GuiG_AppG";
import {GuiG_ListG} from "@/ui/GuiG_ListG";

// TODO: should be an aspect (suffix 'A'), not a group (suffix 'G')
export class GuiG {

    editable: boolean = false;
    uiElement : HTMLDivElement = document.createElement('div');
    appG: GuiG_AppG;
    listG: GuiG_ListG;

    constructor(private identity : Identity) {
        this.appG = new GuiG_AppG(identity);
        this.listG = new GuiG_ListG(identity);
        this.identity.subject.subscribe(event => {
            this.update();
        });
    }

    async update() {
        if (!this.identity.hidden) {
            if (this.identity.appA?.ui) {
                await this.appG.update();
            } else if (this.identity.list) {
                await this.listG.update();
            }
        }
        await this.updateUiElement();
    }

    private async updateUiElement() {
        this.uiElement.innerHTML = null;
        if (!this.identity.hidden) {
            if (this.identity.appA?.ui) {
                this.uiElement.appendChild(this.appG.uiElement);
            } else if (this.identity.action) {
                this.uiElement.appendChild(this.action_getUiElement());
            } else if (notNullUndefined(this.identity.link)) {
                let link = document.createElement('a');
                link.href = this.identity.link;
                link.innerText = this.link_getText();
                this.uiElement.appendChild(link);
            } else if (notNullUndefined(this.identity.text)) {
                this.uiElement.appendChild(this.text_getUiElement());
                if (this.identity.list && this.identity.list.jsList.length > 0) {
                    let listWrapper = document.createElement('div');
                    listWrapper.style.marginLeft = '0.8rem';
                    listWrapper.style.marginTop = '0.2rem';
                    listWrapper.style.marginBottom = '0.2rem';
                    listWrapper.appendChild(this.listG.uiElement);
                    this.uiElement.appendChild(listWrapper);
                }
            } else if (this.identity.list) {
                this.uiElement.appendChild(this.listG.uiElement);
            } else {
                let div = document.createElement('div');
                div.innerText = this.identity.getDescription();
                return div;
            }
        }
    }

    link_getText() {
        return notNullUndefined(this.identity.text) ? this.identity.text : this.identity.link;
    }

    text_getUiElement() {
        let uiElement = document.createElement('div');
        uiElement.innerText = this.identity.text;
        uiElement.style.minHeight = '1rem';
        uiElement.style.whiteSpace = 'pre-wrap';
        uiElement.onblur = (event : any) => {
            this.identity.setText(event.target.innerText.trim())
        }
        uiElement.contentEditable = (this.isEditable()) ? 'true' : 'false';
        if (this.identity.guiG.isEditable() && this.identity.text.length === 0) {
            uiElement.style.borderLeft = 'solid';
        }
        return uiElement;
    }

    action_getUiElement() {
        let button = document.createElement('button');
        button.innerText = this.identity.text;
        button.onclick = (event) => { this.identity.action(); };
        button.style.margin = '0.3rem 0.3rem 0.3rem 0rem';
        this.uiElement.style.display = 'inline';
        return button;
    }

    isEditable() {
        return this.editable || this.identity.editable;
    }

    getRawText() : string {
        if (!this.identity.hidden) {
            if (this.identity.appA?.ui) {
                return this.appG.getRawText();
            } else if (notNullUndefined(this.identity.link)) {
                return this.link_getText();
            } else {
                let rawText = '';
                if (notNullUndefined(this.identity.text)) {
                    rawText += this.identity.text;
                }
                if (this.identity.list) {
                    rawText += this.listG.getRawText();
                }
                return rawText;
            }
        }
        return '';
    }

    async click(text : string) {
        if (!this.identity.hidden) {
            if (this.identity.appA?.ui) {
                await this.appG.click(text);
            } else if (this.identity.action) {
                if (this.identity.text.includes(text)) {
                    await this.identity.action();
                }
            } else if (this.identity.list) {
                await this.listG.click(text);
            }
        }
    }

    countEditableTexts() : number {
        if (!this.identity.hidden) {
            if (this.identity.appA?.ui) {
                return this.appG.countEditableTexts();
            } else {
                let counter = 0;
                if (notNullUndefined(this.identity.text)) {
                    if (this.identity.guiG.isEditable()) {
                        counter++;
                    }
                }
                if (this.identity.list) {
                    counter += this.listG.countEditableTexts();
                }
                return counter;
            }
        }
        return 0;
    }

    async getUpdatedUiElement() : Promise<HTMLElement> {
        await this.update();
        return this.uiElement;
    }

}