import type {Identity} from "@/Identity";
import {notNullUndefined} from "@/utils";
import {GuiG_AppG} from "@/ui/GuiG_AppG";

// TODO: should be an aspect (suffix 'A'), not a group (suffix 'G')
export class GuiG {

    editable: boolean = false;
    uiElement : HTMLDivElement = document.createElement('div');
    private rawText = '';
    private resolvedListItems : Array<Identity>;
    private appG: GuiG_AppG;

    constructor(private identity : Identity) {
        this.appG = new GuiG_AppG(identity);
        this.identity.subject.subscribe(event => {
            this.update();
        });
    }

    async getUpdatedUiElement() : Promise<HTMLElement> {
        await this.update();
        return this.uiElement;
    }

    async update() {
        this.uiElement.innerHTML = null;
        if (!this.identity.hidden) {
            if (this.identity.appA?.ui) {
                await this.appG.update();
                this.addHtml(this.appG.uiElement);
            } else if (this.identity.action) {
                let button = document.createElement('button');
                button.innerText = this.identity.text;
                button.onclick = (event) => { this.identity.action(); };
                button.style.margin = '0.3rem 0.3rem 0.3rem 0rem';
                this.uiElement.style.display = 'inline';
                this.addHtml(button);
            } else if (this.identity.pathA) {
                this.uiElement.innerText = 'a path starting with ' + this.identity.pathA.listOfNames.at(0);
            } else if (notNullUndefined(this.identity.link)) {
                let link = document.createElement('a');
                link.href = this.identity.link;
                link.innerText = notNullUndefined(this.identity.text) ? this.identity.text : this.identity.link;
                this.addHtml(link);
            } else if (notNullUndefined(this.identity.text)) {
                let textElement = document.createElement('div');
                textElement.innerText = this.identity.text;
                textElement.style.minHeight = '1rem';
                textElement.style.whiteSpace = 'pre-wrap';
                textElement.onblur = (event : any) => {
                    this.identity.setText(event.target.innerText.trim())
                }
                textElement.contentEditable = (this.isEditable()) ? 'true' : 'false';
                if (this.identity.guiG.isEditable() && this.identity.text.length === 0) {
                    textElement.style.borderLeft = 'solid';
                }
                this.addHtml(textElement);
                if (this.identity.list && this.identity.list.jsList.length > 0) {
                    let listWrapper = document.createElement('div');
                    listWrapper.style.marginLeft = '0.8rem';
                    listWrapper.style.marginTop = '0.2rem';
                    listWrapper.style.marginBottom = '0.2rem';
                    listWrapper.appendChild(await this.createListElement());
                    this.addHtml(listWrapper);
                }
            } else if (this.identity.list) {
                this.addHtml(await this.createListElement());
            }
        }
    }

    private async createListElement() : Promise<HTMLElement> {
        let div = document.createElement('div');
        this.resolvedListItems = [];
        for (let current of this.identity.list.jsList) {
            let resolved = current.pathA ? await this.identity.resolve(current) : current;
            this.resolvedListItems.push(resolved);
            resolved.guiG.editable = this.identity.guiG.isEditable();
            div.appendChild(await resolved.guiG.getUpdatedUiElement());
        }
        return div;
    }

    private addHtml(htmlElement : HTMLElement) {
        this.uiElement.appendChild(htmlElement);
    }

    isEditable() {
        return this.editable || this.identity.editable;
    }

    getRawText() : string {
        this.rawText = '';
        if (!this.identity.hidden) {
            if (this.identity.appA?.ui) {
                this.addRawText(this.appG.getRawText());
            } else if (this.identity.action) {
                this.addRawText(this.identity.text);
            } else if (notNullUndefined(this.identity.link)) {
                this.addRawText((this.identity.text) ? this.identity.text : this.identity.link);
            } else if (notNullUndefined(this.identity.text)) {
                this.addRawText(this.identity.text);
                if (this.resolvedListItems) {
                    for (let current of this.resolvedListItems) {
                        this.addRawText(current.guiG.getRawText());
                    }
                }
            } else if (this.resolvedListItems) {
                for (let current of this.resolvedListItems) {
                    this.addRawText(current.guiG.getRawText());
                }
            }
        }
        return this.rawText;
    }

    private addRawText(text : string) {
        this.rawText += text;
    }

    async click(text : string) {
        if (!this.identity.hidden) {
            if (this.identity.appA?.ui) {
                await this.appG.click(text);
            } else if (this.identity.action) {
                if (this.identity.text.includes(text)) {
                    await this.identity.action();
                }
            } else if (this.resolvedListItems) {
                for (let current of this.resolvedListItems) {
                    await current.guiG.click(text);
                }
            }
        }
    }

    countEditableTexts() : number {
        if (!this.identity.hidden) {
            if (this.identity.appA?.ui) {
                return this.appG.countEditableTexts();
            } else if (notNullUndefined(this.identity.text)) {
                let counter = 0;
                if (this.identity.guiG.isEditable()) {
                    counter++;
                }
                if (this.resolvedListItems) {
                    for (let current of this.resolvedListItems) {
                        counter += current.guiG.countEditableTexts();
                    }
                }
                return counter;
            } else if (this.resolvedListItems) {
                let counter = 0;
                for (let current of this.resolvedListItems) {
                    counter += current.guiG.countEditableTexts();
                }
                return counter;
            }
        }
        return 0;
    }
}