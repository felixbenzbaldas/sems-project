import type {Entity} from "@/Entity";

export class GuiG_TextG {

    uiElement : HTMLElement = document.createElement('div');

    constructor(private entity : Entity) {
        this.uiElement.style.borderLeft = 'solid';
    }

    unsafeUpdate() {
        this.uiElement.innerText = this.entity.text;
        this.uiElement.style.minHeight = '1rem';
        this.uiElement.style.whiteSpace = 'pre-wrap';
        this.uiElement.style.outline = "0px solid transparent"; // prevent JS focus
        this.uiElement.onblur = (event : any) => {
            this.entity.text = event.target.innerText.trim();
            this.updateEmptyMarker();
        }
        this.uiElement.onfocus = () => {
            this.entity.getApp().appA.ui.focus(this.entity);
            this.updateEmptyMarker();
        };
        this.uiElement.onclick = (event) => {
            if (this.entity.guiG.isEditable()) {
                event.stopPropagation();
            }
        }
        this.uiElement.contentEditable = (this.entity.guiG.isEditable()) ? 'true' : 'false';
        this.updateEmptyMarker();
        this.uiElement.style.display = 'inline-block';
        this.uiElement.style.minWidth = '1rem';
    }

    private updateEmptyMarker() {
        if (document.activeElement != this.uiElement && this.entity.guiG.isEditable() && this.entity.text.length === 0) {
            this.uiElement.style.borderLeftColor = 'black';
        } else {
            this.uiElement.style.borderLeftColor = 'white';
        }
    }

}