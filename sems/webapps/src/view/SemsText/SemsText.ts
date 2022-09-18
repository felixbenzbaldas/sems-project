import { App } from "../../App";
import { EventController } from "../../general/EventController";
import { FixRenderBug } from "../../general/FixRenderBug";
import { General } from "../../general/General";
import { Html } from "../../general/Html";
import { KeyEvent } from "../../general/KeyEvent";
import { List } from "../../general/List";
import { MapWithPrimitiveStringsAsKey } from "../../general/MapWithPrimitiveStringsAsKey";
import { KeyActionDefinition } from "../KeyActionDefinition";
import { WhiteSpaceHandler } from "./WhiteSpaceHandler";

export class SemsText {
    
    
    public onFocus : Function;
    public onBlur : Function;

    public on_FocusPrevWord : Function;
    public on_FocusNextWord : Function;
    public on_setCaretToPrevChar : Function;
    public on_setCaretToNextChar : Function;
    public on_delete : Function;

    private uiElement : HTMLDivElement = document.createElement("div");
    private widthCalculationSpan : HTMLSpanElement;
    private listOfWords : Array<InstanceType<typeof SemsText.SemsWord>> = [];
    private listOfKeyEventListener : Array<Function> = [];
    private lastFocusedWord : InstanceType<typeof SemsText.SemsWord>;
    private mapForHomogenousStylesForText : Map<string, string> = new Map();
    private mapForHomogenousEventListener : Map<string, Function> = new Map();

    constructor(widthCalculationSpan : HTMLSpanElement) {
        this.widthCalculationSpan = widthCalculationSpan;
    }

    public setText(text : string) {
        Html.removeAllChildren(this.uiElement);
        this.listOfWords = [];
        this.lastFocusedWord = null;
        if (text == "") {
            this.createAndAddSemsWord("");
        } else {
            let arrayOfWordStrings : Array<string> = text.split(" ");
            for (let wordString of arrayOfWordStrings) {
                this.createAndAddSemsWord(wordString);
            }
        }
    }

    private createAndAddSemsWord(wordString : string) {
        let semsWord : InstanceType<typeof SemsText.SemsWord> = this.createSemsWord();
        this.listOfWords.push(semsWord);
        semsWord.input.value = wordString;
        this.uiElement.appendChild(semsWord.input);
        this.adaptWidth(semsWord.input);
    }

    public getText() : string {
        if (this.listOfWords.length == 0) {
            return null;
        } else {
            let string = "";
            for (let i = 0; i < this.listOfWords.length; i++) {
                let word = this.listOfWords[i];
                string += word.input.value;
                if (this.listOfWords.length > i+1) {
                    string += " ";
                }
            }
            return string;
        }
    }

    public getUiElement() : HTMLElement {
        return this.uiElement;
    }

    private wordBlur() {
        let self = this;
        setTimeout(function() {
            if (!self.hasFocus()) {
                if (self.onBlur != null) {
                    self.onBlur();
                }
            }
        }, 1);
    }

    public hasFocus() : boolean {
        return this.getFocusedWord() != null;
    }

    private getFocusedWord() : InstanceType<typeof SemsText.SemsWord> {
        for (let word of this.listOfWords) {
            if (document.activeElement == word.input) {
                return word;
            }
        }
        return null;
    }

    public focusLastFocused() {
        if (this.lastFocusedWord != null) {
            this.lastFocusedWord.setCaretToLastPosition();
        } else {
            List.getLastElement(this.listOfWords).setCaretToLastPosition();
        }
    }

    public focusLastWord() {
        this.listOfWords[this.listOfWords.length - 1].setCaretToLastPosition();
    }

    public focusFirstWord() {
        this.listOfWords[0].setCaretToLastPosition();
    }

    public createSemsWord() : InstanceType<typeof SemsText.SemsWord> {
        let self = this;
        let semsWord = new SemsText.SemsWord(this);
        semsWord.input.style.backgroundColor = App.backgroundColor;
        for (let property of this.mapForHomogenousStylesForText.keys()) {
            semsWord.input.style.setProperty(property, this.mapForHomogenousStylesForText.get(property));
        }
        for (let event of this.mapForHomogenousEventListener.keys()) {
            let listener : any = this.mapForHomogenousEventListener.get(event);
            semsWord.input.addEventListener(event, listener);

        }
        semsWord.input.onfocus = function() {
            self.lastFocusedWord = semsWord;
            if (self.onFocus != null) {
                self.onFocus();
            }
        }
        semsWord.input.onblur = function() {
            semsWord.caretPositionBeforeLastBlur = semsWord.input.selectionStart;
            self.wordBlur();
        }
        semsWord.input.onkeydown = function(ev: KeyboardEvent) {
            let keyEvent = KeyEvent.createFromKeyboardEvent(ev);
            if (!semsWord.whiteSpaceHandler.isWhiteSpaceDown()) {
                for (let keyEventListener of self.listOfKeyEventListener) {
                    keyEventListener(keyEvent);
                }
                if (General.primEquals(ev.key, "Backspace")) {
                    if (ev.ctrlKey) {
                        semsWord.deleteWordEvent();
                        ev.preventDefault();
                    } else {
                        if (semsWord.input.value.length == 0) {
                            semsWord.deleteWordEvent();
                            ev.preventDefault();
                        }
                    }
                }
            }
            /////////////////////////////////
            if (ev.key == " " || semsWord.whiteSpaceHandler.isWhiteSpaceDown()) {
                ev.preventDefault();
                semsWord.whiteSpaceHandler.keyDown(ev.key);
            } else {
                if (semsWord.hasNoSelection()) {
                    if (semsWord.simpleDefaultKey(ev)) {
                        ev.preventDefault();
                        let caretPosition = semsWord.input.selectionStart;
                        let oldText : string = semsWord.input.value;
                        let left = oldText.substring(0, caretPosition);
                        let right = oldText.substring(caretPosition, oldText.length);
                        let newText = left + ev.key + right;
                        semsWord.input.value = newText;
                        semsWord.input.selectionStart = caretPosition + ev.key.length;
                        semsWord.input.selectionEnd = semsWord.input.selectionStart;
                        self.adaptWidth(semsWord.input);
                    }
                }
            }
        };
        semsWord.input.onkeyup = function(ev: KeyboardEvent) {
            if (ev.key == " " || semsWord.whiteSpaceHandler.isWhiteSpaceDown()) {
                ev.preventDefault();
                semsWord.whiteSpaceHandler.keyUp(ev.key);
            }
            self.adaptWidth(semsWord.input);
        };
        return semsWord;
    }

    public adaptWidth(input : HTMLInputElement) {
        this.widthCalculationSpan.innerText = input.value;
        let whiteSpaceWidth;
        if (App.LOCAL_MODE) {
            whiteSpaceWidth = 4;
        } else {
            whiteSpaceWidth = 4.7;
        }
        let newWidth = (this.widthCalculationSpan.offsetWidth + whiteSpaceWidth) + "px";
        input.style.width = newWidth;
    }

    public setHomogenousStyle(property : string, value : string) {
        this.uiElement.style.setProperty(property, value);
        this.setHomogenousStyleForText(property, value);
    }

    public setHomogenousStyleForText(property : string, value : string) {
        this.mapForHomogenousStylesForText.set(property, value);
        this.listOfWords.forEach(function(semsWord : InstanceType<typeof SemsText.SemsWord>) {
            semsWord.input.style.setProperty(property, value);
        });
    }

    // XXX Mit Vorsicht genießen! Eventuell wäre ein setHomogenousCallback besser.
    public addHomogenousEventListener(event : string, listener : any) {
        this.mapForHomogenousEventListener.set(event, listener);
        this.listOfWords.forEach(function(semsWord : InstanceType<typeof SemsText.SemsWord>) {
            semsWord.input.addEventListener(event, listener);
        });
    }

    public addKeyEventListener(listener : Function) {
        this.listOfKeyEventListener.push(listener);
    }

    public cursorHint() {
        this.getFocusedWord().cursorHint();
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////

    static SemsWord = class {

        public eventController : EventController;
        public caretPositionBeforeLastBlur : number;
        public input : HTMLInputElement;
        public whiteSpaceHandler : WhiteSpaceHandler = new WhiteSpaceHandler();
    
        private semsText : SemsText;
        private mapKeyActions;
    
        constructor(semsText : SemsText) {
            this.eventController = new EventController(this);
            this.semsText = semsText;
            this.input = this.createInputElement();
            this.mapKeyActions = this.createKeyActions();
            let self = this;
            this.whiteSpaceHandler.on_whiteSpaceUp = function() {
                self.whiteSpaceUp();
            }
            this.whiteSpaceHandler.on_keyDownAndUpDuringWhiteSpaceDown = function(key : string) {
                self.keyDownAndUpDuringWhiteSpaceDown(key);
            }
        }
    
        private createKeyActions() : MapWithPrimitiveStringsAsKey {
            let map = new MapWithPrimitiveStringsAsKey();
            let self = this;
            KeyActionDefinition.addKeyEvent(map, function(keyEvent : KeyEvent) {
                keyEvent.sk = true;
                keyEvent.key = "e";
                }, function() {
                    if (self.getCaretPosition() == 0) {
                        let index = self.semsText.listOfWords.indexOf(self);
                        self.semsText.listOfWords[index - 1].setCaretToEndOfWord();
                    } else {
                        self.setCaret(self.getCaretPosition() - 1);
                    }
            });
            KeyActionDefinition.addKeyEvent(map, function(keyEvent : KeyEvent) {
                keyEvent.sk = true;
                keyEvent.key = "d";
                }, function() {
                    if (self.getCaretPosition() == self.input.value.length) {
                        let index = self.semsText.listOfWords.indexOf(self);
                        self.semsText.listOfWords[index + 1].setCaretToBeginningOfWord();
                    } else {
                        self.setCaret(self.getCaretPosition() + 1);
                    }
            });
            KeyActionDefinition.addKeyEvent(map, function(keyEvent : KeyEvent) {
                keyEvent.sk = true;
                keyEvent.key = "r";
                }, function() {
                    let index = self.semsText.listOfWords.indexOf(self);
                    if (index > 0) {
                        self.semsText.listOfWords[index - 1].setCaretToLastPosition();
                    } else {
                        General.callIfNotNull(self.semsText.on_FocusPrevWord);
                    }
            });
            KeyActionDefinition.addKeyEvent(map, function(keyEvent : KeyEvent) {
                keyEvent.sk = true;
                keyEvent.key = "f";
                }, function() {
                    let index = self.semsText.listOfWords.indexOf(self);
                    if (index < self.semsText.listOfWords.length - 1) {
                        self.semsText.listOfWords[index + 1].setCaretToLastPosition();
                    } else {
                        General.callIfNotNull(self.semsText.on_FocusNextWord);
                    }
            });
            KeyActionDefinition.addKeyEvent(map, function(keyEvent : KeyEvent) {
                keyEvent.sk = true;
                keyEvent.key = "w";
                }, function() {
                    self.semsText.listOfWords[0].setCaretToLastPosition();
            });
            KeyActionDefinition.addKeyEvent(map, function(keyEvent : KeyEvent) {
                keyEvent.sk = true;
                keyEvent.key = "s";
                }, function() {
                    List.getLastElement(self.semsText.listOfWords).setCaretToLastPosition();
            });
            KeyActionDefinition.addKeyEvent(map, function(keyEvent : KeyEvent) {
                keyEvent.sk = true;
                keyEvent.key = "q";
                }, function() {
                    self.setCaret(0);
            });
            KeyActionDefinition.addKeyEvent(map, function(keyEvent : KeyEvent) {
                keyEvent.sk = true;
                keyEvent.key = "a";
                }, function() {
                    self.setCaret(self.input.value.length);
            });
            KeyActionDefinition.addKeyEvent(map, function(keyEvent : KeyEvent) {
                keyEvent.sk = true;
                keyEvent.key = ".";
                }, function() {
                    let indexOfWord = self.semsText.listOfWords.indexOf(self);
                    let newWord = self.semsText.createSemsWord();
                    List.insertInListAtPosition(self.semsText.listOfWords, newWord, indexOfWord);
                    Html.insertChildAtPosition(self.semsText.uiElement, newWord.input, indexOfWord);
                    newWord.input.value = "";
                    newWord.setCaretToEndOfWord();
                    self.semsText.adaptWidth(newWord.input);
            });
            return map;
        }

        private createInputElement() : HTMLInputElement {
            let input = document.createElement("input");
            input.style.display = "inline-block";
            input.style.width = "2px";
            input.style.fontFamily = App.fontFamily;
            input.style.fontSize = App.fontSize;
            input.style.border = "none";
            input.style.outlineStyle = "none"; // hide border on focus
            input.style.padding = "0px";
            input.style.position = "relative";
            FixRenderBug.setStyleForTextWithUnderline(input);
            return input;
        }
    
        private whiteSpaceUp() {
            let indexOfWord = this.semsText.listOfWords.indexOf(this);
            let newWord = this.semsText.createSemsWord();
            List.insertInListAtPosition(this.semsText.listOfWords, newWord, indexOfWord + 1);
            Html.insertChildAtPosition(this.semsText.uiElement, newWord.input, indexOfWord + 1);
            newWord.input.value = this.whiteSpaceHandler.getKeyDownsDuringWhiteSpaceDown();
            newWord.setCaretToEndOfWord();
            this.semsText.adaptWidth(newWord.input);
        }
    
        public hasNoSelection() {
            return this.input.selectionStart == this.input.selectionEnd;
        }
    
        // true if simple default case (key should be printed)
        public simpleDefaultKey(ev : KeyboardEvent) {
            return ev.key.length == 1 && !ev.ctrlKey;
        }
        
        public setCaretToBeginningOfWord() {
            this.setCaret(0);
        }
    
        public setCaretToEndOfWord() {
            this.setCaret(this.input.value.length);
        }
    
        public setCaret(position : number) {
            this.input.focus();
            this.input.selectionStart = position;
            this.input.selectionEnd = position;
        }
    
        public setCaretToLastPosition() {
            if (!this.hasFocus()) {
                if (this.caretPositionBeforeLastBlur >= 0) {
                    this.setCaret(this.caretPositionBeforeLastBlur);
                } else {
                    this.setCaretToEndOfWord();
                }
            }
        }

        public getCaretPosition() : number {
            return this.input.selectionStart;
        }
        
        private keyDownAndUpDuringWhiteSpaceDown(key : string) {
            let keyEvent : KeyEvent = new KeyEvent();
            keyEvent.sk = true;
            keyEvent.key = key;
            let keyEventString = keyEvent.createCompareString();
            if (this.mapKeyActions.has(keyEventString)) {
                this.mapKeyActions.get(keyEventString)();
            }
            for (let keyEventListener of this.semsText.listOfKeyEventListener) {
                keyEventListener(keyEvent);
            }
        }
    
        public hasFocus() {
            return document.activeElement == this.input;
        }

        public deleteWordEvent() {
            let indexOfWord = this.semsText.listOfWords.indexOf(this);
            List.deleteInListAtPosition(this.semsText.listOfWords, indexOfWord);
            Html.remove(this.input);
            if (indexOfWord > 0) {
                this.semsText.listOfWords[indexOfWord - 1].setCaretToEndOfWord();
            } else {
                if (this.semsText.listOfWords.length > 0) {
                    this.semsText.listOfWords[0].setCaretToBeginningOfWord();
                } else {
                    this.semsText.setText('');
                    this.semsText.focusFirstWord();
                }
            }
        }

        public cursorHint() {
            let animationTime = 0.11;
            this.input.style.transition = "box-shadow " + animationTime + "s";
            this.input.style.zIndex = "1";
            this.input.style.boxShadow = "0px 0px 10px 0px";
            let self = this;
            setTimeout(function() {
                self.input.style.boxShadow = "0px 0px 20px 2px";
            }, 0);
            setTimeout(function() {
                self.input.style.boxShadow = "none";
            }, animationTime * 1000);
            setTimeout(function() {
                self.input.style.zIndex = "0";
                self.input.style.boxShadow = "none";
            }, animationTime * 2000);
        }

    }
}