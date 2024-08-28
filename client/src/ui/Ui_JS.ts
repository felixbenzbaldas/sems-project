import type {Identity} from "@/Identity";

export class Ui_JS {

    editable: boolean = false;
    private _uiElement : HTMLDivElement;
    private rawText = '';
    private updatePromise : Promise<void>;
    private resolvedListItems : Array<Identity>;


    constructor(private identity : Identity) {
    }

    uiElement(): HTMLElement {
        if (!this._uiElement) {
            this._uiElement = document.createElement('div')
            this.updatePromise = this.asyncUpdate();
            this.identity.subject.subscribe(event => {
                this.updatePromise = this.asyncUpdate();
            });
        }
        return this._uiElement;
    }

    private async asyncUpdate() {
        this._uiElement.innerHTML = null;
        if (!this.identity.hidden) {
            if (this.identity.appA?.ui) {
                if (this.identity.appA.ui.commands) {
                    this.addObject(this.identity.appA.ui.commands);
                }
                if (!this.identity.appA.ui.isWebsite) {
                    this.addObject(this.identity.appA.ui.output.getUi());
                    this.addObject(this.identity.appA.ui.input.getUi());
                    this.addHtml(this.separatorLine());
                    this.identity.appA.ui.content.ui_js.editable = true;
                }
                this.addObject(this.identity.appA.ui.content);
            } else if (this.identity.action) {
                let button = document.createElement('button');
                button.innerText = this.identity.text;
                button.onclick = (event) => { this.identity.action(); };
                button.style.margin = '0.3rem 0.3rem 0.3rem 0rem';
                this._uiElement.style.display = 'inline';
                this.addHtml(button);
            } else if (this.identity.pathA) {
                this._uiElement.innerText = 'a path starting with ' + this.identity.pathA.listOfNames.at(0);
            } else if (this.neitherNullNorUndefined(this.identity.link)) {
                let link = document.createElement('a');
                link.href = this.identity.link;
                link.innerText = this.neitherNullNorUndefined(this.identity.text) ? this.identity.text : this.identity.link;
                this.addHtml(link);
            } else if (this.neitherNullNorUndefined(this.identity.text)) {
                let textElement = document.createElement('div');
                textElement.innerText = this.identity.text;
                textElement.style.minHeight = '1rem';
                textElement.style.whiteSpace = 'pre-wrap';
                textElement.onblur = (event : any) => {
                    this.identity.setText(event.target.innerText.trim())
                }
                textElement.contentEditable = (this.isEditable()) ? 'true' : 'false';
                if (this.identity.ui_js.isEditable() && this.identity.text.length === 0) {
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
            resolved.ui_js.editable = this.identity.ui_js.isEditable();
            div.appendChild(resolved.ui_js.uiElement());
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

    neitherNullNorUndefined(toCheck : any) {
        return toCheck != null && toCheck != undefined;
    }

    private addObject(identity : Identity) {
        this.addHtml(identity.ui_js.uiElement());
    }

    private addHtml(htmlElement : HTMLElement) {
        this._uiElement.appendChild(htmlElement);
    }

    isEditable() {
        return this.editable || this.identity.editable;
    }

    async waitForUpdate() : Promise<void> {
        return this.updatePromise;
    }

    getRawText() : string {
        this.rawText = '';
        if (!this.identity.hidden) {
            if (this.identity.appA?.ui) {
                if (this.identity.appA.ui.commands) {
                    this.addRawText(this.identity.appA.ui.commands.ui_js.getRawText());
                }
                if (!this.identity.appA.ui.isWebsite) {
                    this.addRawText(this.identity.appA.ui.output.getUi().ui_js.getRawText());
                    this.addRawText(this.identity.appA.ui.input.getUi().ui_js.getRawText());
                }
                this.addRawText(this.identity.appA.ui.content.ui_js.getRawText());
            } else if (this.identity.action) {
                this.addRawText(this.identity.text);
            } else if (this.neitherNullNorUndefined(this.identity.link)) {
                this.addRawText((this.identity.text) ? this.identity.text : this.identity.link);
            } else if (this.neitherNullNorUndefined(this.identity.text)) {
                this.addRawText(this.identity.text);
                if (this.resolvedListItems) {
                    for (let current of this.resolvedListItems) {
                        this.addRawText(current.ui_js.getRawText());
                    }
                }
            } else if (this.resolvedListItems) {
                for (let current of this.resolvedListItems) {
                    this.addRawText(current.ui_js.getRawText());
                }
            }
        }
        return this.rawText;
    }

    private addRawText(text : string) {
        this.rawText += text;
    }
}