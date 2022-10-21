import { App } from "../App";
import { DEFAULT_EXPANDED, IS_PRIVATE, TEXT } from "../Consts";
import { RemotePropertiesOfSemsObject } from "../data/RemotePropertiesOfSemsObject";
import { EventTypes } from "../EventTypes";
import { General } from "../general/General";
import { KeyEvent } from "../general/KeyEvent";
import { SemsServer } from "../SemsServer";
import { KeyActionDefinition } from "./KeyActionDefinition";
import { KeyMode } from "./KeyMode";
import { SemsText } from "./SemsText/SemsText";
import { TextObjectViewController } from "./TextObjectViewController";
import { UserInterfaceObject } from "./UserInterfaceObject";

export class HeadText {
    private textObjectViewController : TextObjectViewController;
    private userInterfaceObject : UserInterfaceObject;

    private semsText : SemsText;
    private dataObserver : Function;
    private props : RemotePropertiesOfSemsObject;

    private div_pres_mode = document.createElement("div");

    static create(textObjectViewController : TextObjectViewController) : HeadText {
        let ht = new HeadText();
        ht.textObjectViewController = textObjectViewController;
        ht.userInterfaceObject = textObjectViewController.getUserInterfaceObject();
        ht.props = App.objProperties.getPropertiesOfObject(ht.getSemsAddress());
        if (App.LOCAL_MODE) {
            ht.initialize_localMode();
        } else {
            ht.div_pres_mode.innerHTML = ht.props.get(TEXT);
            ht.div_pres_mode.style.fontFamily = App.fontFamily;
            ht.div_pres_mode.style.fontSize = App.fontSize;
            ht.div_pres_mode.style.color = App.fontColor;
            ht.updateOnClick();
            ht.updateOnContextmenu();
            ht.updateUnderline();
            ht.userInterfaceObject.getEventController().addObserver(EventTypes.CHANGED, function() {
                ht.updateUnderline();
            });
        }
        return ht;
    }

    public getUiElement() : HTMLElement {
        if (App.LOCAL_MODE) {
            return this.semsText.getUiElement();
        } else {
            return this.div_pres_mode;
        }
    }

    public focus() {
        this.semsText.focusLastFocused();
    }

    private initialize_localMode() {
        this.semsText = new SemsText(App.widthCalculationSpan);
        this.update();
        let self = this;
        this.semsText.onBlur = function () {
            self.updateTextProperty();
        };
        this.semsText.onFocus = function () {
            App.deleteManualFocusAndFocusedUIO();
            App.focusedUIO = self.userInterfaceObject;
            self.userInterfaceObject.lastFocusedSubitem = null;
            self.userInterfaceObject.eventController.triggerEvent(EventTypes.FOCUSED, null);
        };
        this.semsText.on_FocusPrevWord = function() {
            self.userInterfaceObject.eventController.triggerEvent(EventTypes.FOCUS_PREV_WORD, null);
        };
        this.semsText.on_FocusNextWord = function() {
            self.userInterfaceObject.eventController.triggerEvent(EventTypes.FOCUS_NEXT_WORD, null);
        };
        this.semsText.on_delete = function() {
            self.userInterfaceObject.eventController.triggerEvent(EventTypes.DELETE, null);
        }
        this.dataObserver = function (property : string) {
            if (General.primEquals(property, TEXT)) {
                self.updateText();
            } else {
                self.update_exceptText();
            }
        };
        App.objEvents.addObserver(this.getSemsAddress(), EventTypes.PROPERTY_CHANGE, this.dataObserver);
        App.objEvents.addObserver(this.getSemsAddress(), EventTypes.DETAILS_CHANGE, this.dataObserver);
        this.userInterfaceObject.getEventController().addObserver(EventTypes.CHANGED, function() {
            self.update_exceptText();
        });
        this.userInterfaceObject.getEventController().addObserver(EventTypes.DELETED, function() {
            self.delete();
        });
        // this.anchorElement.oncontextmenu = function(ev : MouseEvent) {
        //     if (!ev.ctrlKey) {
        //         ev.preventDefault();
        //         self.userInterfaceObject.scaleUp();
        //     }
        // }
        // paste unformatted
        // this.anchorElement.addEventListener("paste", function(ev : any) {
        //     ev.preventDefault();
        //     var text = (ev.originalEvent || ev).clipboardData.getData('text/plain');
        //     document.execCommand("insertText", false, text);
        // });
        //
        let keyActionsMap = KeyActionDefinition.createKeyActions_TextObject(this.textObjectViewController);
        let keyActionsMap_normalMode = KeyActionDefinition.createKeyActions_TextObject_normalMode(this.textObjectViewController);
        this.semsText.addKeyEventListener(function(keyEvent : KeyEvent) {
            let compareString = keyEvent.createCompareString();
            if (keyActionsMap.has(compareString)) {
                keyEvent.preventDefault();
                keyActionsMap.get(compareString)();
            }
            if (App.keyMap.has(compareString)) {
                keyEvent.preventDefault();
                self.userInterfaceObject.eventController.triggerEvent(App.keyMap.get(compareString), null);
            }
            if (App.keyMode == KeyMode.NORMAL) {
                if (keyActionsMap_normalMode.has(compareString)) {
                    keyEvent.preventDefault();
                    keyActionsMap_normalMode.get(compareString)();
                }
                if (App.keyMap_normalMode.has(compareString)) {
                    keyEvent.preventDefault();
                    self.userInterfaceObject.eventController.triggerEvent(App.keyMap_normalMode.get(compareString), null);
                }
            }
        });
        this.semsText.getUiElement().onmousedown = function(ev : MouseEvent) {
            if (!ev.ctrlKey) {
                ev.preventDefault();
                self.semsText.focusLastFocused();
            }
        }
    }
    
    private getProps() : RemotePropertiesOfSemsObject {
        return this.props;
    }
    
    private clickable() : boolean {
        return !this.getProps().get(DEFAULT_EXPANDED) && this.textObjectViewController.bodyAvailable();
    }

    private update() {
        this.updateText();
        this.updateTextColor();
        this.updateOnClick();
        this.updateOnContextmenu();
        this.updateUnderline();
    }

    // purpose: avoid loss of untransmitted text
    private update_exceptText() {
        this.updateTextColor();
        this.updateOnClick();
        this.updateOnContextmenu();
        this.updateUnderline();
    }

    private updateText() {
        if (!General.primEquals(this.semsText.getText(), this.getProps().get(TEXT))) {
            this.semsText.setText(this.getProps().get(TEXT));
        } else if (this.semsText.getText() == null) {
            this.semsText.setText("");
        }
    }

    private updateTextColor() {
        this.semsText.setHomogenousStyleForText("color", this.getTextColor());
    }

    private getTextColor() : string {
        if (this.getProps().get(IS_PRIVATE)) {
            return "red";
        } else {
            if (App.LOCAL_MODE) {
                if (!this.userInterfaceObject.semsAddress.startsWith("1-")) {
                    return "green";
                }
            }
        }
        return App.fontColor;
    }

    private updateOnClick() {
        let self = this;
        if (this.clickable()) {
            this.getUiElement().onclick = function (ev) {
                if (ev.ctrlKey) {
                    if (App.LOCAL_MODE) {
                        if (!self.semsText.hasFocus()) {
                            self.semsText.focusLastWord();
                        }
                    } else {
                        self.showHref();
                    }
                } else {
                    ev.preventDefault();
                    if (App.LOCAL_MODE) {
                        self.semsText.focusLastFocused();
                    }
                    if (self.textObjectViewController.isCollapsed()) {
                        self.textObjectViewController.expandIfCollapsedAndBodyIsAvailable();
                    } else {
                        self.textObjectViewController.collapse();
                    }
                }
            };
        } else {
            this.getUiElement().onclick = function(ev) {
                if (App.LOCAL_MODE) {
                    if (!self.semsText.hasFocus()) {
                        self.semsText.focusLastWord();
                    }
                } else {
                    if (ev.ctrlKey) {
                        self.showHref();
                    }
                }
            }
        }
    }

    private showHref() {
        let semsAddress : string = this.getSemsAddress();
        let href = "http://www.demoDomain.de/?id=" + semsAddress;
        alert("Link auf dieses Element: " + href);
    }

    private updateOnContextmenu() {
        let self = this;
        this.getUiElement().oncontextmenu = function (ev) {
            ev.preventDefault();
            if (ev.ctrlKey) {
                self.textObjectViewController.scaleDown();
            } else {
                self.textObjectViewController.scaleUp();
            }
        };
    }

    private updateUnderline() {
        if (this.clickable()) {
            if (this.textObjectViewController.isCollapsed()) {
                this.mark_collapsed_strongRels();
            } else {
                this.mark_expanded();
            }
        } else {
            this.mark_noDefaultClick();
        }
    }

    public mark_collapsed_strongRels() {
        this.setStyleForText("text-decoration", "underline");
        this.setStyleForText("text-decoration-style", "solid");
        this.setStyleForText("cursor", "pointer");
        this.getUiElement().style.cursor = "pointer";
    }

    public mark_expanded() {
        this.setStyleForText("text-decoration", "underline");
        this.setStyleForText("text-decoration-style", "double");
        this.setStyleForText("cursor", "pointer");
        this.getUiElement().style.cursor = "pointer";
    }
    
    public mark_noDefaultClick() {
        this.setStyleForText("text-decoration", "none");
        this.setStyleForText("cursor", "default");
        this.getUiElement().style.cursor = "default";
    }

    private setStyleForText(property : string, value : string) {
        if (App.LOCAL_MODE) {
            this.semsText.setHomogenousStyleForText(property, value);
        } else {
            this.div_pres_mode.style.setProperty(property, value);
        }
    }

    private delete() {
        App.objEvents.removeObserver(this.getSemsAddress(), EventTypes.PROPERTY_CHANGE, this.dataObserver);
    }

    private getSemsAddress() {
        return this.userInterfaceObject.getSemsAddress();
    }

    public updateTextProperty() {
        this.getProps().set(TEXT, this.semsText.getText());
    }

    public getSemsText() : SemsText {
        return this.semsText;
    }

    public cursorHint() {
        this.semsText.cursorHint();
    }
}