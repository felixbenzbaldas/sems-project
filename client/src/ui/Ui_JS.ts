import type {Identity} from "@/Identity";

export class Ui_JS {

    readonly div : HTMLDivElement = document.createElement('div');

    constructor(private identity : Identity) {
    }

    getUi(): HTMLElement {
        if (this.identity.appA?.ui) {
            this.div.appendChild(this.identity.appA.ui.content.ui_js.getUi());
        } else if (this.identity.list) {
            this.identity.list.jsList.forEach((currentIdentity) => {
                this.div.appendChild(currentIdentity.ui_js.getUi());
            });
        } else if (this.neitherNullNorUndefined(this.identity.text)) {
            this.div.innerText = this.identity.text;
            this.div.style.minHeight = '1rem';
        }
        return this.div;
    }

    neitherNullNorUndefined(toCheck : any) {
        return toCheck != null && toCheck != undefined;
    }
}