import { FixRenderBug } from "../general/FixRenderBug";

export class HeadTextUtil {
    static setStyle(htmlElement : HTMLElement) {
        FixRenderBug.setStyleForTextWithUnderline(htmlElement);
    }
    static mark_collapsed_strongRels(htmlElement : HTMLElement) {
        htmlElement.style.textDecoration = "underline";
        htmlElement.style.textDecorationStyle = "solid";
        htmlElement.style.cursor = "pointer";
        FixRenderBug.rerenderBackgroundColor(htmlElement);
    }
    static mark_collapsed_loseRels(htmlElement : HTMLElement) {
        htmlElement.style.textDecoration = "underline";
        htmlElement.style.textDecorationStyle = "dashed";
        htmlElement.style.cursor = "pointer";
        FixRenderBug.rerenderBackgroundColor(htmlElement);
    }
    static mark_noDefaultClick(htmlElement : HTMLElement) {
        htmlElement.style.textDecoration = "none";
        htmlElement.style.cursor = "text";
        FixRenderBug.rerenderBackgroundColor(htmlElement);
    }
    static mark_expanded(htmlElement : HTMLElement) {
        htmlElement.style.textDecoration = "underline";
        htmlElement.style.textDecorationStyle = "double";
        htmlElement.style.cursor = "pointer";
        FixRenderBug.rerenderBackgroundColor(htmlElement);
    }
}