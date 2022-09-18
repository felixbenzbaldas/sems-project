import { TextObjectViewController } from "./TextObjectViewController";
import { UserInterfaceObject } from "./UserInterfaceObject";
import { View } from "./View";

export class Export {

    public static fourDays_safe_html(tovc : TextObjectViewController) : string {
        let div : HTMLDivElement = document.createElement('div');
        let currentTovc : TextObjectViewController = tovc;
        div.appendChild(Export.getHtmlOfTree_Safe(currentTovc, 0));
        for (let i = 0; i < 3; i++) {
            
            let nextUio : UserInterfaceObject = View.getNextUioOnSameLevel_skippingParents(currentTovc.getUserInterfaceObject());
            currentTovc = nextUio.tovcOpt;

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
            let detailTovc : TextObjectViewController = listOfDetailUio[i].tovcOpt;
            htmlElement.appendChild(Export.getHtmlOfTree_Safe(detailTovc, level));
        }
        return htmlElement;
    }

    public static textHasXXXMark(tovc : TextObjectViewController) : boolean {
        return tovc.getText().indexOf('XXX') >= 0;
    }

    public static getRawTextOfTree(tovc : TextObjectViewController, level : number) : string{
        let text : string = "";
        if (level == 0) {
            text += tovc.getText();
            text += '\n';
            if (!tovc.isCollapsed()) {
                text += '\n';
                text += Export.getRawTextOfDetailUios(tovc, level + 1);
                text += '\n';
            }
        } else {
            for (let i = 1; i < level - 1; i++) {
                text += '  ';
            }
            if (level > 1) {
                text += '- ';
            }
            text += tovc.getText();
            if (!tovc.isCollapsed()) {
                text += '\n';
                text += Export.getRawTextOfDetailUios(tovc, level + 1);
            }
        }
        return text;
    }
    
    private static getRawTextOfDetailUios(tovc : TextObjectViewController, level : number) : string {
        let text : string = '';
        let listOfDetailUio = tovc.getListOfDetailUio();
        for (let i = 0; i < listOfDetailUio.length; i++) {
            let detailTovc : TextObjectViewController = listOfDetailUio[i].tovcOpt;
            text += Export.getRawTextOfTree(detailTovc, level);
            if (i + 1 < listOfDetailUio.length) {
                text += '\n';
            }
        }
        return text;
    }
}