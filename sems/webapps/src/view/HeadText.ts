import { App } from "../App";
import { DEFAULT_EXPANDED, IS_PRIVATE, TEXT } from "../Consts";
import { RemotePropertiesOfSemsObject } from "../data/RemotePropertiesOfSemsObject";
import { EventTypes } from "../EventTypes";
import { General } from "../general/General";
import { KeyActionDefinition } from "./KeyActionDefinition";
import { TextObjectViewController } from "./TextObjectViewController";
import { UserInterfaceObject } from "./UserInterfaceObject";

export class HeadText {
    private textObjectViewController : TextObjectViewController;
    private userInterfaceObject : UserInterfaceObject;

    private dataObserver : Function;
    private props : RemotePropertiesOfSemsObject;

    private span : HTMLSpanElement = document.createElement('span');
    private uiElement : HTMLDivElement = document.createElement('div');

    static create(textObjectViewController : TextObjectViewController) : HeadText {
        let ht = new HeadText();
        ht.textObjectViewController = textObjectViewController;
        ht.userInterfaceObject = textObjectViewController.getUserInterfaceObject();
        ht.props = App.objProperties.getPropertiesOfObject(ht.getSemsAddress());
        ht.initialize();
        return ht;
    }

    public getUiElement() : HTMLElement {
        return this.uiElement;
    }

    public focus() {
        this.span.focus();
    }

    private initialize() {
        this.update();
        let self = this;
        this.uiElement.appendChild(this.span);
        this.span.onblur = function () {
            self.updateTextProperty();
            self.textObjectViewController.adaptStyleForKeyMode();
        };
        this.span.onfocus = function () {
            App.deleteManualFocusAndFocusedUIO();
            App.focusedUIO = self.userInterfaceObject;
            self.textObjectViewController.adaptStyleForKeyMode();
            self.userInterfaceObject.lastFocusedSubitem = null;
            self.userInterfaceObject.eventController.triggerEvent(EventTypes.FOCUSED, null);
        };
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
        // paste unformatted
        // this.anchorElement.addEventListener("paste", function(ev : any) {
        //     ev.preventDefault();
        //     var text = (ev.originalEvent || ev).clipboardData.getData('text/plain');
        //     document.execCommand("insertText", false, text);
        // });
        //
        let keyActionsMap = KeyActionDefinition.createKeyActions_TextObject(this.textObjectViewController);
        let keyActionsMap_normalMode = KeyActionDefinition.createKeyActions_TextObject_normalMode(this.textObjectViewController);
        // this.semsText.addKeyEventListener(function(keyEvent : KeyEvent) {
        //     let compareString = keyEvent.createCompareString();
        //     if (keyActionsMap.has(compareString)) {
        //         keyEvent.preventDefault();
        //         keyActionsMap.get(compareString)();
        //     }
        //     if (App.keyMap.has(compareString)) {
        //         keyEvent.preventDefault();
        //         self.userInterfaceObject.eventController.triggerEvent(App.keyMap.get(compareString), null);
        //     }
        //     if (App.keyMode == KeyMode.NORMAL) {
        //         if (keyActionsMap_normalMode.has(compareString)) {
        //             keyEvent.preventDefault();
        //             keyActionsMap_normalMode.get(compareString)();
        //         }
        //         if (App.keyMap_normalMode.has(compareString)) {
        //             keyEvent.preventDefault();
        //             self.userInterfaceObject.eventController.triggerEvent(App.keyMap_normalMode.get(compareString), null);
        //         }
        //     }
        // });
        this.uiElement.onmousedown = function(ev : MouseEvent) {
            if (!ev.ctrlKey) {
                ev.preventDefault();
                self.focus();
            }
        }
    }
    
    private getProps() : RemotePropertiesOfSemsObject {
        return this.props;
    }
    
    private clickable() : boolean {
        return !this.getProps().get(DEFAULT_EXPANDED) && this.textObjectViewController.bodyAvailable();
    }

    public update() {
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
        if (!General.primEquals(this.getDisplayedText(), this.getProps().get(TEXT))) {
            this.setDisplayedText(this.getProps().get(TEXT));
        } else if (this.getDisplayedText() == null) {
            this.setDisplayedText("");
        }
    }

    public updateTextColor() {
        this.span.style.color = this.getTextColor();
    }

    private getTextColor() : string {
        if (this.getProps().get(IS_PRIVATE)) {
            return "red";
        } else {
            if (!this.userInterfaceObject.semsAddress.startsWith("1-")) {
                return "green";
            } else {
                return App.fontColor;
            }
        }
    }

    private updateOnClick() {
        let self = this;
        if (this.clickable()) {
            this.getUiElement().onclick = function (ev) {
                if (ev.ctrlKey) {
                    if (!self.hasFocus()) {
                        self.focus();
                    }
                } else {
                    ev.preventDefault();
                    self.focus();
                    if (self.textObjectViewController.isCollapsed()) {
                        self.textObjectViewController.expandIfCollapsedAndBodyIsAvailable();
                    } else {
                        self.textObjectViewController.collapse();
                    }
                }
            };
        } else {
            this.getUiElement().onclick = function(ev) {
                if (!self.hasFocus()) {
                    self.focus();
                }
            }
        }
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
        this.span.style.setProperty(property, value);
    }

    private delete() {
        App.objEvents.removeObserver(this.getSemsAddress(), EventTypes.PROPERTY_CHANGE, this.dataObserver);
    }

    private getSemsAddress() {
        return this.userInterfaceObject.getSemsAddress();
    }

    public updateTextProperty() {
        this.getProps().set(TEXT, this.getDisplayedText());
        this.userInterfaceObject.getEventController().triggerEvent(EventTypes.CHANGED, null);
    }

    public cursorHint() {
        // TODO
    }

    public getDisplayedText() : string {
        return this.span.innerText;
    }

    public setDisplayedText(text : string) {
        this.span.innerText = text;
    }

    public hasFocus() : boolean {
        return document.activeElement == this.span;
    }
}