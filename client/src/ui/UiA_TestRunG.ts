import type {Entity} from "@/Entity";

export class UiA_TestRunG {

    htmlElement: HTMLElement;

    constructor(private entity : Entity) {
    }

    async update() {
        this.htmlElement = document.createElement('div');
        if (this.entity.uiA.getObject().testRunA.resultG_error) {
            this.htmlElement.innerText = this.entity.uiA.getObject().testRunA.resultG_error.message;
        }
    }
}