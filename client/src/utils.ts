export async function wait(milliseconds : number) {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

export function nullUndefined(toCheck : any) : boolean {
    return toCheck === null || toCheck === undefined;
}

export function notNullUndefined(toCheck : any) {
    return !nullUndefined(toCheck);
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

export function selectAllTextOfDiv(div : HTMLElement) {
    if ((document as any).body.createTextRange) {
        const range = (document as any).body.createTextRange();
        range.moveToElementText(div);
        range.select();
    } else if (window.getSelection) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(div);
        selection.removeAllRanges();
        selection.addRange(range);
    } else {
        throw new Error('Could not select text of div!');
    }
}

export function getSelectedText(): string {
    if (window.getSelection) {
        return window.getSelection().toString();
    } else if (document.getSelection) {
        return document.getSelection().toString();
    }
}

export function assert(condition : boolean, message? : string) {
    if (!condition) {
        throw new Error('AssertionError: condition must be fulfilled' + (message ? (' - info: ' + message) : ''));
    }
}
export function assertFalse(condition : boolean, message? : string) {
    if (condition) {
        throw new Error('AssertionError: condition must NOT be fulfilled' + (message ? (' - info: ' + message) : ''));
    }
}

export function assert_sameAs<T> (firstValue : T, secondValue : T) {
    if (firstValue !== secondValue) {
        throw new Error('AssertionError: ' + firstValue + ' !== ' + secondValue);
    }
}

export function assert_notSameAs(firstValue : any, secondValue : any) {
    if (firstValue === secondValue) {
        throw new Error('AssertionError: ' + firstValue + ' === ' + secondValue);
    }
}

export function textFileInput(handleTextInput : (text : string) => void) : HTMLElement {
    let fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.addEventListener('change', (event: Event) => {
        let reader = new FileReader();
        reader.onload = (progressEvent: ProgressEvent<FileReader>) => {
            handleTextInput(progressEvent.target.result as string);
        };
        reader.readAsText((event.target as any).files[0]);
    }, false);
    return fileInput;
}

export function downloadText(content : string, fileName : string, label : string) : HTMLElement {
    let htmlElement = document.createElement('a');
    htmlElement.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    htmlElement.setAttribute('download', fileName);
    htmlElement.innerText = label;
    return htmlElement;
}

export function setWidth(htmlElement : HTMLElement, width : string) {
    htmlElement.style.width = width;
    // weird: this is needed to 'strengthen' the width - see test_semi_setWidth
    htmlElement.style.minWidth = width;
}

export function textElem(text : string) : HTMLDivElement {
    let html = div();
    html.innerText = text;
    return html;
}

export function localhostWithQueryParams(paramsAsString : string) : URL {
    return new URL('http:localhost:1234/?' + paramsAsString);
}

export function div() : HTMLDivElement {
    return document.createElement('div');
}