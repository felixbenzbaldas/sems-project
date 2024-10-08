import type {Entity} from "@/Entity";
import {setCaret} from "@/utils";
import {Static} from "@/Static";
import type {UiA} from "@/ui/UiA";

export class UiA_TextG {

    htmlElement : HTMLElement = document.createElement('div');

    constructor(private entity : Entity) {
        this.htmlElement.style.borderLeft = 'solid';
    }

    update() {
        this.htmlElement.innerText = this.getObject().text;
        this.htmlElement.style.minHeight = '1rem';
        this.htmlElement.style.whiteSpace = 'pre-wrap';
        this.htmlElement.style.outline = "0px solid transparent"; // prevent JS focus
        this.htmlElement.onblur = (event : any) => {
            this.getObject().text = event.target.innerText.trim();
            this.updateEmptyMarker();
        }
        this.htmlElement.onfocus = () => {
            if (this.entity.getApp().appA.uiA.focused != this.entity) {
                this.entity.getApp().appA.uiA.focus(this.entity);
            }
            this.updateEmptyMarker();
        };
        this.htmlElement.onclick = (event) => {
            Static.ensureActive(this.entity.getApp());
            if (this.getUiA().isEditable()) {
                event.stopPropagation();
            }
        }
        this.htmlElement.contentEditable = (this.getUiA().isEditable()) ? 'true' : 'false';
        this.updateEmptyMarker();
        this.htmlElement.style.display = 'inline-block';
        this.htmlElement.style.minWidth = '1rem';
        this.htmlElement.style.maxWidth = '42rem';
        this.updateCursorStyle();
    }

    private updateEmptyMarker() {
        if (document.activeElement != this.htmlElement && this.getUiA().isEditable() && this.getObject().text.length === 0) {
            this.htmlElement.style.borderLeftColor = 'black';
        } else {
            this.htmlElement.style.borderLeftColor = 'white';
        }
    }

    private updateCursorStyle() {
        if (this.getUiA().isEditable()) {
            this.htmlElement.style.cursor = 'text';
        } else {
            if (this.getObject().collapsible && this.getUiA().bodyG.bodyAvailable()) {
                this.htmlElement.style.cursor = 'pointer';
            } else {
                this.htmlElement.style.cursor = 'default';
            }
        }
    }

    takeCaret() {
        setCaret(this.htmlElement, this.getObject().text.length);
    }

    getUiA() : UiA {
        return this.entity.uiA;
    }

    getObject() : Entity {
        if (this.getUiA().object) {
            return this.getUiA().object;
        } else {
            return this.entity;
        }
    }
}