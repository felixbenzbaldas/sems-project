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

export function createRandomString(): string {
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
    let theString = '';
    let numberOfCharacters = 10;
    for (let i = 0; i < numberOfCharacters; i++) {
        let randomIndex = Math.floor( Math.random() * characters.length);
        let randomChar = characters.charAt(randomIndex);
        theString += randomChar;
    }
    return theString;
}