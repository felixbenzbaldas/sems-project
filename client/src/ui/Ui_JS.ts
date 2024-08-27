import type {Identity} from "@/Identity";

export class Ui_JS {

    private _uiElement : HTMLDivElement;

    constructor(private identity : Identity) {
    }

    uiElement(): HTMLElement {
        if (!this._uiElement) {
            this._uiElement = document.createElement('div')
            this.asyncUpdate();
            this.identity.subject.subscribe(event => {
                this.asyncUpdate();
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
                if (this.identity.text.length === 0) {
                    textElement.style.borderLeft = 'solid';
                }
                this.addHtml(textElement);
                if (this.identity.list && this.identity.list.jsList.length > 0) {
                    let list = document.createElement('div');
                    list.style.marginLeft = '0.8rem';
                    list.style.marginTop = '0.2rem';
                    list.style.marginBottom = '0.2rem';
                    for (let current of this.identity.list.jsList) {
                        if (current.pathA) {
                            list.appendChild((await this.identity.resolve(current)).ui_js.uiElement());
                        } else {
                            list.appendChild(current.ui_js.uiElement());
                        }
                    };
                    this.addHtml(list);
                }
            } else if (this.identity.list) {
                for (let current of this.identity.list.jsList) {
                    if (current.pathA) {
                        this.addObject(await this.identity.resolve(current));
                    } else {
                        this.addObject(current);
                    }
                };
            }
        }
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
}