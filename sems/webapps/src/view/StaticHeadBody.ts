import { View } from "./View";

export class StaticHeadBody {

    private objectDiv: HTMLDivElement;
    private bodyDiv: HTMLDivElement;
    private headDiv: HTMLDivElement;

    constructor(headText: string) {
        this.objectDiv = View.createDivWithDefaultMargin();
        this.headDiv = document.createElement("div");
        this.bodyDiv = document.createElement("div");
        this.headDiv.innerHTML = headText;
        View.setDefaultBodyStyle(this.bodyDiv);
        this.objectDiv.appendChild(this.headDiv);
        this.objectDiv.appendChild(this.bodyDiv);
    }

    public getDiv() : HTMLDivElement {
        return this.objectDiv;
    }

    public getBodyDiv() {
        return this.bodyDiv;
    }

    public getHeadDiv() {
        return this.headDiv;
    }
}