import type {Identity} from "@/Identity";

export class Ui_JS {

    readonly div : HTMLDivElement = document.createElement('div');

    constructor(private identity : Identity) {
    }

    getUiElement(): HTMLElement {
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
                button.onclick = this.identity.action();
                button.style.margin = '0.3rem 0.3rem 0.3rem 0rem';
                this.div.style.display = 'inline';
                this.addHtml(button);
            } else if (this.identity.pathA) {
                this.div.innerText = 'a path starting with ' + this.identity.pathA.listOfNames.at(0);
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
                this.addHtml(textElement);
                if (this.identity.list && this.identity.list.jsList.length > 0) {
                    let list = document.createElement('div');
                    list.style.marginLeft = '0.8rem';
                    list.style.marginTop = '0.2rem';
                    list.style.marginBottom = '0.2rem';
                    for (let current of this.identity.list.jsList) {
                        list.appendChild(current.ui_js.getUiElement());
                    }
                    this.addHtml(list);
                }
            } else if (this.identity.list) {
                this.identity.list.jsList.forEach((current) => {
                    this.addObject(current);
                });
            }
        }
        return this.div;
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
        this.addHtml(identity.ui_js.getUiElement());
    }

    private addHtml(htmlElement : HTMLElement) {
        this.div.appendChild(htmlElement);
    }
}