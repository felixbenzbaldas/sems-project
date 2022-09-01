export const KeyEventDelimiter = "+";
export class KeyEvent {

    public sk : boolean = false; // "SemsKey" = white space
    public ctrl : boolean = false;
    public shift : boolean = false;
    public alt : boolean = false;
    public key : string;

    public keyboardEvent : KeyboardEvent;

    public createCompareString() : string {
        let list = [];
        if (this.sk) {
            list.push("sk");
        }
        if (this.ctrl) {
            list.push("ctrl");
        }
        if (this.shift) {
            list.push("shift");
        }
        if (this.alt) {
            list.push("alt");
        }
        if (this.key != null) {
            list.push(this.key);
        }
        let string = "";
        for (let i = 0; i < list.length; i++) {
            string += list[i];
            if (i + 1 < list.length) {
                string += KeyEventDelimiter;
            }
        }
        return string;
    }

    public static createFromKeyboardEvent(ev : KeyboardEvent) : KeyEvent {
        let keyEvent : KeyEvent = new KeyEvent();
        keyEvent.ctrl = ev.ctrlKey;
        keyEvent.shift = ev.shiftKey;
        keyEvent.alt = ev.altKey;
        keyEvent.key = ev.key;
        keyEvent.keyboardEvent = ev;
        return keyEvent;
    }

    public preventDefault() {
        if (this.keyboardEvent != null) {
            this.keyboardEvent.preventDefault();
        }
    }
}