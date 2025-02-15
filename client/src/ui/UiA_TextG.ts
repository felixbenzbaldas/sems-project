import type {Entity} from "@/Entity";
import {div, setCaret} from "@/utils";
import type {UiA} from "@/ui/UiA";

export class UiA_TextG {

    htmlElement : HTMLElement = div();

    constructor(private entity : Entity) {
        this.htmlElement.style.borderLeft = 'solid';
    }

    async update() {
        this.htmlElement.innerText = this.getObject().text;
        this.htmlElement.style.minHeight = '1rem';
        this.htmlElement.style.fontFamily = this.entity.getApp_typed().uiA.theme.font;
        // this.htmlElement.style.fontSize = this.entity.getApp_typed().uiA.theme.fontSize;
        this.htmlElement.style.whiteSpace = 'pre-wrap';
        this.htmlElement.style.outline = "0px solid transparent"; // prevent JS focus
        this.htmlElement.onblur = async (event : any) => {
            this.save();
            await this.getObject().uis_update_text();
        }
        this.htmlElement.onfocus = () => {
            if (this.getUiA().findAppUi().focused != this.entity.uiA) {
                this.getUiA().findAppUi().focus(this.entity.uiA);
            }
            this.updateEmptyMarker();
        };
        this.htmlElement.onclick = (event) => {
            this.getUiA().findAppUi().ensureActive();
            if (this.getUiA().isEditable()) {
                event.stopPropagation();
            }
        }
        this.htmlElement.contentEditable = (this.getUiA().isEditable()) ? 'true' : 'false';
        this.updateEmptyMarker();
        this.htmlElement.style.display = 'inline-block';
        this.htmlElement.style.minWidth = '1rem';
        await this.updateCursorStyle();
    }

    save() {
        this.getObject().text = this.htmlElement.innerText.trim();
    }

    private updateEmptyMarker() {
        if (document.activeElement != this.htmlElement && this.getUiA().isEditable() && this.getObject().text.length === 0) {
            this.htmlElement.style.borderLeftColor = this.entity.getApp_typed().uiA.theme.fontColor;
        } else {
            this.htmlElement.style.borderLeftColor = this.entity.getApp_typed().uiA.theme.backgroundColor;
        }
    }

    async updateCursorStyle() {
        if (this.getUiA().isEditable()) {
            this.htmlElement.style.cursor = 'text';
        } else {
            if (this.getObject().collapsible && await this.getUiA().headerBodyG.hasBodyContent()) {
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