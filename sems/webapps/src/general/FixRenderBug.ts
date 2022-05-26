import { App } from "../App";

/* In folgenden Browsern gibt es scheinbar ein Rendering-Bug: Google Chrome, Microsoft Edge
Wenn man die CSS-Property textDecorationStyle von double auf solid ändert, wird die Anzeige manchmal nicht aktualisiert.
Diese Klasse liefert Util-Methoden, um zu verhindern, dass der Bug auftritt.
Der Bug hat scheinbar auch damit zu tun, dass der doppelte Unterstrich aus dem umliegenden Html-Element hinausragt.
Um sicherzustellen, dass der doppelte Unterstrich nicht aus dem Html-Element hinausragt, wird ein PaddingBottom verwendet. */
export class FixRenderBug {
    static createDivForTextWithDoubleUnderline() {
        let div = document.createElement("div");
        FixRenderBug.setStyleForTextWithUnderline(div);
        return div;
    }

    static setStyleForTextWithUnderline(htmlElement : HTMLElement) {
        let offset = "0.075";
        htmlElement.style.paddingBottom = offset + "rem";
        // Hinweis: Ein negativer Margin als Ausgleich für den Padding kann zu unerwünschtem Flackern führen!
        //          Deshalb wird hier lediglich ein Padding verwendet.
    }

    static rerenderBackgroundColor(htmlElement : HTMLElement) {
        htmlElement.style.backgroundColor = App.backgroundColor;
    }
}