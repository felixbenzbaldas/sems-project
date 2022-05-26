import { App } from "../App";

export class ContextIcon {
    
    static CONTEXT_ICON_WIDTH = "0.7rem";
    
    public static createContextIconElement() : HTMLElement {
        let contextIconElement  = document.createElement("div");
        if (!App.LOCAL_MODE) {
            contextIconElement.style.fontSize = App.fontSize;
        }
        contextIconElement.style.marginLeft = "-" + ContextIcon.CONTEXT_ICON_WIDTH;
        contextIconElement.style.width = ContextIcon.CONTEXT_ICON_WIDTH;
        contextIconElement.style.float = "left";
        contextIconElement.style.color = App.fontColor;
        return contextIconElement;
    }

    public static setBidirectional(htmlElement) {
        htmlElement.innerText = "-";
    }

    public static setUnidirectional(htmlElement) {
        htmlElement.innerText = "|";
    }
}