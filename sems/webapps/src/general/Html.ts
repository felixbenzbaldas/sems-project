export class Html {

    static remove(toRemove) {
        toRemove.parentNode.removeChild(toRemove);
    }

    static insertAfter(htmlObject, toInsert) {
        let parent = htmlObject.parentNode;
        let next = htmlObject.nextSibling;
        if (next == null) {
            parent.appendChild(toInsert);
        } else {
            parent.insertBefore(toInsert, next);
        }
    }

    static insertChildAtPosition(parent : HTMLElement, child, position : number) {
        if (parent.hasChildNodes()) {
            parent.insertBefore(child, parent.children[position]);
        } else {
            parent.appendChild(child);
        }
    }

    static removeNext(htmlObject) {
        Html.remove(htmlObject.nextSibling);
    }

    static removeAllChildren(htmlObject) {
        while (htmlObject.hasChildNodes()) {
            htmlObject.removeChild(htmlObject.children[0]);
        }
    }
}