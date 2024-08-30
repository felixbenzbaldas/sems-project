import type {Identity} from "@/Identity";
import {notNullUndefined} from "@/utils";

// TODO: should be an aspect (suffix 'A'), not a group (suffix 'G')
export class GuiG {

    editable: boolean = false;
    private _uiElement : HTMLDivElement;
    private rawText = '';
    private resolvedListItems : Array<Identity>;

    constructor(private identity : Identity) {
    }

    lazy_uiElement(): HTMLElement {
        if (!this._uiElement) {
            this._uiElement = document.createElement('div');
            this.identity.subject.subscribe(event => {
                this.update();
            });
        }
        return this._uiElement;
    }

    async getUpdatedUiElement() : Promise<HTMLElement> {
        await this.update();
        return this.lazy_uiElement();
    }

    async update() {
        this.lazy_uiElement().innerHTML = null;
        if (!this.identity.hidden) {
            if (this.identity.appA?.ui) {
                if (this.identity.appA.ui.commands) {
                    await this.addUpdatedObject(this.identity.appA.ui.commands);
                }
                if (!this.identity.appA.ui.isWebsite) {
                    await this.addUpdatedObject(this.identity.appA.ui.output.getUi());
                    await this.addUpdatedObject(this.identity.appA.ui.input.getUi());
                    this.addHtml(this.separatorLine());
                    this.identity.appA.ui.content.guiG.editable = true;
                }
                await this.addUpdatedObject(this.identity.appA.ui.content);
            } else if (this.identity.action) {
                let button = document.createElement('button');
                button.innerText = this.identity.text;
                button.onclick = (event) => { this.identity.action(); };
                button.style.margin = '0.3rem 0.3rem 0.3rem 0rem';
                this._uiElement.style.display = 'inline';
                this.addHtml(button);
            } else if (this.identity.pathA) {
                this._uiElement.innerText = 'a path starting with ' + this.identity.pathA.listOfNames.at(0);
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

    private separatorLine() {
        let line: HTMLDivElement = document.createElement('div');
        line.style.marginBottom = '0.5rem';
        line.style.paddingBottom = '0.5rem';
        line.style.borderBottom = 'dashed';
        return line;
    }

    private async addUpdatedObject(identity : Identity) {
        this.addHtml(await identity.guiG.getUpdatedUiElement());
    }

    private addHtml(htmlElement : HTMLElement) {
        this.lazy_uiElement().appendChild(htmlElement);
    }

    isEditable() {
        return this.editable || this.identity.editable;
    }

    getRawText() : string {
        this.rawText = '';
        if (!this.identity.hidden) {
            if (this.identity.appA?.ui) {
                if (this.identity.appA.ui.commands) {
                    this.addRawText(this.identity.appA.ui.commands.guiG.getRawText());
                }
                if (!this.identity.appA.ui.isWebsite) {
                    this.addRawText(this.identity.appA.ui.output.getUi().guiG.getRawText());
                    this.addRawText(this.identity.appA.ui.input.getUi().guiG.getRawText());
                }
                this.addRawText(this.identity.appA.ui.content.guiG.getRawText());
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
                if (this.identity.appA.ui.commands) {
                    await this.identity.appA.ui.commands.guiG.click(text);
                }
                if (!this.identity.appA.ui.isWebsite) {
                    await this.identity.appA.ui.output.getUi().guiG.click(text);
                    await this.identity.appA.ui.input.getUi().guiG.click(text);
                }
                await this.identity.appA.ui.content.guiG.click(text);
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
        let counter = 0;
        if (!this.identity.hidden) {
            if (this.identity.appA?.ui) {
                if (this.identity.appA.ui.commands) {
                    counter += this.identity.appA.ui.commands.guiG.countEditableTexts();
                }
                if (!this.identity.appA.ui.isWebsite) {
                    counter += this.identity.appA.ui.output.getUi().guiG.countEditableTexts();
                    counter += this.identity.appA.ui.input.getUi().guiG.countEditableTexts();
                }
                counter += this.identity.appA.ui.content.guiG.countEditableTexts();
            } else if (notNullUndefined(this.identity.text)) {
                if (this.identity.guiG.isEditable()) {
                    counter++;
                }
            } else if (this.resolvedListItems) {
                for (let current of this.resolvedListItems) {
                    counter += current.guiG.countEditableTexts();
                }
            }
        }
        return counter;
    }
}