import { General } from "../../general/General";

export class WhiteSpaceHandler {
    private static whiteSpaceIsDown : boolean = false;
    private static dismisWhiteSpace : boolean = false;
    private static listOfKeyDownsDuringWhiteSpaceDown : Array<string> = [];
    public on_keyDownAndUpDuringWhiteSpaceDown : Function;
    public on_whiteSpaceUp : Function;

    public keyDown(key : string) {
        if (key == " ") {
            WhiteSpaceHandler.whiteSpaceIsDown = true;
        } else {
            if (WhiteSpaceHandler.whiteSpaceIsDown) {
                WhiteSpaceHandler.listOfKeyDownsDuringWhiteSpaceDown.push(key);
            }
        }
    }

    public keyUp(key : string) {
        if (key == " ") {
            if (!WhiteSpaceHandler.dismisWhiteSpace) {
                if (this.on_whiteSpaceUp != null) {
                    this.on_whiteSpaceUp();
                }
            }
            WhiteSpaceHandler.whiteSpaceIsDown = false;
            // tidy up
            WhiteSpaceHandler.dismisWhiteSpace = false;
            WhiteSpaceHandler.listOfKeyDownsDuringWhiteSpaceDown = [];
        } else {
            if (WhiteSpaceHandler.whiteSpaceIsDown) {
                if (WhiteSpaceHandler.listHasString(WhiteSpaceHandler.listOfKeyDownsDuringWhiteSpaceDown, key)) {
                    WhiteSpaceHandler.dismisWhiteSpace = true;
                    this.on_keyDownAndUpDuringWhiteSpaceDown(key);
                }
            }
        }
    }

    public isWhiteSpaceDown() : boolean {
        return WhiteSpaceHandler.whiteSpaceIsDown;
    }

    public getKeyDownsDuringWhiteSpaceDown() : string {
        let string : string = "";
        for (let char of WhiteSpaceHandler.listOfKeyDownsDuringWhiteSpaceDown) {
            string = string.concat(char);
        }
        return string;
    }

    static listHasString(list : Array<string>, toTest : string) {
        for (let string of list) {
            if (General.primEquals(string, toTest)) {
                return true;
            }
        }
    }
}