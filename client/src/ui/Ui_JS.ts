import type {Identity} from "@/Identity";

export class Ui_JS {

    readonly div : HTMLDivElement = document.createElement('div');

    constructor(private identity : Identity) {
    }

    getUi(): HTMLElement {
        if (this.identity.appA?.ui) {
            this.div.appendChild(this.identity.appA.ui.content.ui_js.getUi());
        } else if (this.neitherNullNorUndefined(this.identity.text)) {
            let textElement = document.createElement('div');
            textElement.innerText = this.identity.text;
            textElement.style.minHeight = '1rem';
            this.div.appendChild(textElement);
            if (this.identity.list && this.identity.list.jsList.length > 0) {
                let list = document.createElement('div');
                list.style.marginLeft = '0.8rem';
                for (let current of this.identity.list.jsList) {
                    list.appendChild(current.ui_js.getUi());
                }
                this.div.appendChild(list);
            }
        } else if (this.identity.list) {
            this.identity.list.jsList.forEach((current) => {
                this.div.appendChild(current.ui_js.getUi());
            });
        }
        return this.div;
    }

    neitherNullNorUndefined(toCheck : any) {
        return toCheck != null && toCheck != undefined;
    }
}