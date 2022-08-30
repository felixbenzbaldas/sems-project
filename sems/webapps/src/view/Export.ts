import { TextObjectViewController } from "./TextObjectViewController";
import { View } from "./View";

export class Export {
    public static fourDays_safe_html(tovc : TextObjectViewController) : string {
        let div : HTMLDivElement = document.createElement('div');
        let currentTovc : TextObjectViewController = tovc;
        div.appendChild(Export.getHtmlOfTree_Safe(currentTovc, 0));
        for (let i = 0; i < 3; i++) {
            currentTovc = TextObjectViewController.map.get(View.getNextUioOnSameLevel_skippingParents(currentTovc.getUserInterfaceObject()));
            div.appendChild(Export.getHtmlOfTree_Safe(currentTovc, 0));
        }
        return div.innerHTML;
    }

    public static getHtmlOfTree_Safe(tovc : TextObjectViewController, level : number) : HTMLElement {
        let htmlElement : HTMLElement;
        htmlElement = document.createElement('div');
        if (level == 0) {
            let p : HTMLParagraphElement = document.createElement('p');
            htmlElement.appendChild(p);
            p.style.fontSize = "2rem";
            p.style.color = "gold";
            p.innerHTML = Export.getTextSafe(tovc);
            if (!tovc.isCollapsed() && !Export.textHasXXXMark(tovc)) {
                htmlElement.appendChild(Export.getHtmlOfDetailUios(tovc, level + 1));
            }
        } else {
            if (level == 1) {
                let p : HTMLParagraphElement = document.createElement('p');
                htmlElement.appendChild(p);
                p.style.fontSize = "1rem";
                p.style.color = "blue";
                p.innerHTML = Export.getTextSafe(tovc);
                if (!tovc.isCollapsed() && !Export.textHasXXXMark(tovc)) {
                    let ul : HTMLUListElement = document.createElement('ul');
                    htmlElement.appendChild(ul);
                    ul.appendChild(Export.getHtmlOfDetailUios(tovc, level + 1));
                }
            } else {
                let li : HTMLLIElement = document.createElement('li');
                htmlElement.appendChild(li);
                li.style.fontSize = "1rem";
                li.style.color = "blue";
                li.innerHTML = Export.getTextSafe(tovc);
                if (!tovc.isCollapsed() && !Export.textHasXXXMark(tovc)) {
                    let ul : HTMLUListElement = document.createElement('ul');
                    htmlElement.appendChild(ul);
                    ul.appendChild(Export.getHtmlOfDetailUios(tovc, level + 1));
                }
            }
        }
        return htmlElement;
    }

    private static getTextSafe(tovc : TextObjectViewController) : string {
        if (Export.textHasXXXMark(tovc)) {
            let text : string = tovc.getText();
            return text.substring(0, text.indexOf('XXX')) + '[pS]';
        } else {
            return tovc.getText();
        }
    }

    private static getHtmlOfDetailUios(tovc : TextObjectViewController, level : number) : HTMLElement {
        let htmlElement : HTMLElement = document.createElement('div');
        let listOfDetailUio = tovc.getListOfDetailUio();
        for (let i = 0; i < listOfDetailUio.length; i++) {
            let detailTovc : TextObjectViewController = TextObjectViewController.map.get(listOfDetailUio[i]);
            htmlElement.appendChild(Export.getHtmlOfTree_Safe(detailTovc, level));
        }
        return htmlElement;
    }

    public static textHasXXXMark(tovc : TextObjectViewController) : boolean {
        return tovc.getText().indexOf('XXX') >= 0;
    }


    
    // public exportFourObjectsSafe() {
    //     this.ensureExpanded();
    //     let textArea : HTMLTextAreaElement = document.createElement("textarea");
    //     Html.insertChildAtPosition(this.headBody.getBody(), textArea, 0);
    //     this.headText.updateTextProperty();
    //     let text : string = '';
    //     text += this.getRawTextOfTree_Safe(0);
    //     //
    //     text += '\n';
    //     let nextTovc : TextObjectViewController = TextObjectViewController.map.get(View.getNextUioOnSameLevel_skippingParents(this.uio));
    //     text += nextTovc.getRawTextOfTree_Safe(0);
    //     //
    //     text += '\n';
    //     let nextNextTovc = TextObjectViewController.map.get(View.getNextUioOnSameLevel_skippingParents(nextTovc.getUserInterfaceObject()));
    //     text += nextNextTovc.getRawTextOfTree_Safe(0);
    //     //
    //     text += '\n';
    //     let nextNextNextTovc = TextObjectViewController.map.get(View.getNextUioOnSameLevel_skippingParents(nextNextTovc.getUserInterfaceObject()));
    //     text += nextNextNextTovc.getRawTextOfTree_Safe(0);
    //     //
    //     textArea.value = text;
    // }

    // public getRawTextOfTree_Safe(level : number) : string{
    //     let text : string = "";
    //     if (level == 0) {
    //         text += this.getTextSafe().toLocaleUpperCase();
    //         text += '\n';
    //         if (!this.isCollapsed() &&!this.textHasXXXMark()) {
    //             text += '\n';
    //             text += this.detailsView.getRawTextOfTree(level + 1);
    //             text += '\n';
    //         }
    //     } else {
    //         for (let i = 1; i < level - 1; i++) {
    //             text += '  ';
    //         }
    //         if (level > 1) {
    //             text += '- ';
    //         }
    //         text += this.getTextSafe();
    //         if (!this.isCollapsed() && !this.textHasXXXMark()) {
    //             text += '\n';
    //             text += this.detailsView.getRawTextOfTree(level + 1);
    //         }
    //     }
    //     return text;
    // }
}