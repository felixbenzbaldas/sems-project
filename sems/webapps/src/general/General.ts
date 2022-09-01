import { KeyEvent } from "./KeyEvent";

export class General {
    public static emptyFunction = function() {};
    
    // Liefert ein Link-Element, welches sich wie ein span-Element verhält, außer dass STR-Click weiterhin funktioniert
    static createAndAdaptLinkElement() {
        let linkElem = document.createElement("a");
        linkElem.style.color = "black";
        linkElem.style.textDecoration = "none";
        linkElem.style.cursor = "text";
        linkElem.onclick = function (ev) {
            if (ev.ctrlKey) {
                // default action (open link in new tab)
            } else {
                ev.preventDefault();
            }
        };
        linkElem.draggable = false;
        linkElem.style.userSelect = "text"; // necessary (at least for Mircosoft Edge)
        return linkElem;
    }

    
    // TODO wird derzeit nicht verwendet!
    static addKeyActionToHtmlElement(htmlElement, keyEvent : KeyEvent, action : Function) {
        htmlElement.addEventListener("keydown", function(ev: KeyboardEvent) {
            if (General.checkCondition(ev, keyEvent)) {
                ev.preventDefault();
                action();
            }
        });
        htmlElement.addEventListener("keyup", function(ev: KeyboardEvent) {
            if (General.checkCondition(ev, keyEvent)) {
                ev.preventDefault();
            }
        });
    }
    private static checkCondition(ev: KeyboardEvent, keyEvent : KeyEvent) {
        return General.primEquals(KeyEvent.createFromKeyboardEvent(ev).createCompareString(), keyEvent.createCompareString());
    }

    public static ensurePrimitiveTypeIfString(eventType) : any {
        if (eventType instanceof String) {
            return eventType.toString();
        }
        return eventType;
    }

    // convert strings to primitive type and check equality
    public static primEquals(string1, string2) : boolean {
        if (string1 == null) {
            if (string2 == null) {
                return true;
            } else {
                return false;
            }
        } else {
            if (string2 == null) {
                return false;
            } else {
                return string1.toString() == string2.toString();
            }
        }
    }

    public static callIfNotNull(f : Function) {
        if (f != null) {
            f.call(this);
        }
    }
}