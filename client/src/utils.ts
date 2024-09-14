export async function wait(milliseconds : number) {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

export function notNullUndefined(toCheck : any) {
    return toCheck != null && toCheck != undefined;
}

export function setCaret(htmlElement: HTMLElement, position: number) {
    htmlElement.focus();
    let range: Range = document.createRange();
    if (htmlElement.childNodes.length > 0) {
        range.setStart(htmlElement.childNodes[0], position);
        range.collapse(true);
        let selection: Selection = document.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
}