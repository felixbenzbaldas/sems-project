import type {Entity} from "@/Entity";

export class UiG_TextG {

    htmlElement : HTMLElement = document.createElement('div');

    constructor(private entity : Entity) {
        this.htmlElement.style.borderLeft = 'solid';
    }

    update() {
        this.htmlElement.innerText = this.entity.text;
        this.htmlElement.style.minHeight = '1rem';
        this.htmlElement.style.whiteSpace = 'pre-wrap';
        this.htmlElement.style.outline = "0px solid transparent"; // prevent JS focus
        this.htmlElement.onblur = (event : any) => {
            this.entity.text = event.target.innerText.trim();
            this.updateEmptyMarker();
        }
        this.htmlElement.onfocus = () => {
            this.entity.getApp().appA.uiA.focus(this.entity);
            this.updateEmptyMarker();
        };
        this.htmlElement.onclick = (event) => {
            if (this.entity.uiG.isEditable()) {
                event.stopPropagation();
            }
        }
        this.htmlElement.contentEditable = (this.entity.uiG.isEditable()) ? 'true' : 'false';
        this.updateEmptyMarker();
        this.htmlElement.style.display = 'inline-block';
        this.htmlElement.style.minWidth = '1rem';
        this.htmlElement.style.maxWidth = '42rem';
    }

    private updateEmptyMarker() {
        if (document.activeElement != this.htmlElement && this.entity.uiG.isEditable() && this.entity.text.length === 0) {
            this.htmlElement.style.borderLeftColor = 'black';
        } else {
            this.htmlElement.style.borderLeftColor = 'white';
        }
    }

}