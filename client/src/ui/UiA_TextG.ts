import type {Entity} from "@/Entity";
import {setCaret} from "@/utils";

export class UiA_TextG {

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
            if (this.entity.getApp().appA.uiA.focused != this.entity) {
                this.entity.getApp().appA.uiA.focus(this.entity);
            }
            this.updateEmptyMarker();
        };
        this.htmlElement.onclick = (event) => {
            if (this.entity.uiA.isEditable()) {
                event.stopPropagation();
            }
        }
        this.htmlElement.contentEditable = (this.entity.uiA.isEditable()) ? 'true' : 'false';
        this.updateEmptyMarker();
        this.htmlElement.style.display = 'inline-block';
        this.htmlElement.style.minWidth = '1rem';
        this.htmlElement.style.maxWidth = '42rem';
        this.updateCursorStyle();
    }

    private updateEmptyMarker() {
        if (document.activeElement != this.htmlElement && this.entity.uiA.isEditable() && this.entity.text.length === 0) {
            this.htmlElement.style.borderLeftColor = 'black';
        } else {
            this.htmlElement.style.borderLeftColor = 'white';
        }
    }

    private updateCursorStyle() {
        if (this.entity.uiA.isEditable()) {
            this.htmlElement.style.cursor = 'text';
        } else {
            if (this.entity.collapsible && this.entity.uiA.bodyG.bodyAvailable()) {
                this.htmlElement.style.cursor = 'pointer';
            } else {
                this.htmlElement.style.cursor = 'default';
            }
        }
    }

    takeCaret() {
        setCaret(this.htmlElement, this.entity.text.length);
    }
}