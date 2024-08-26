import {Starter} from "@/Starter";
import type {Identity} from "@/Identity";

export class AppA_AbstractUi_JS {

    constructor(private identity : Identity) {
    }

    getHtmlElement(): HTMLElement {
        let html: HTMLDivElement = document.createElement('div');
        html.innerText = this.identity.text;
        return html;
    }
}