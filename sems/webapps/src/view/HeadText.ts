import { App } from "../App";
import { DEFAULT_EXPANDED, IS_PRIVATE, TEXT } from "../Consts";
import { RemotePropertiesOfSemsObject } from "../data/RemotePropertiesOfSemsObject";
import { EventTypes } from "../EventTypes";
import { General } from "../general/General";
import { KeyEvent } from "../general/KeyEvent";
import { KeyActionDefinition } from "./KeyActionDefinition";
import { TextObjectViewController } from "./TextObjectViewController";
import { UserInterfaceObject } from "./UserInterfaceObject";

export class HeadText {
    private textObjectViewController: TextObjectViewController;
    private userInterfaceObject: UserInterfaceObject;

    private dataObserver: Function;
    private props: RemotePropertiesOfSemsObject;

    private textDiv: HTMLDivElement = document.createElement('div');
    private uiElement: HTMLDivElement = document.createElement('div');

    private editView: boolean;

    static create(textObjectViewController: TextObjectViewController): HeadText {
        let ht = new HeadText();
        ht.editView = false;
        ht.textObjectViewController = textObjectViewController;
        ht.userInterfaceObject = textObjectViewController.getUserInterfaceObject();
        ht.props = App.objProperties.getPropertiesOfObject(ht.getSemsAddress());
        ht.initialize();
        return ht;
    }

    public getUiElement(): HTMLElement {
        return this.uiElement;
    }

    public focus() {
        this.textDiv.focus();
    }

    private initialize() {
        this.update();
        let self = this;
        this.uiElement.appendChild(this.textDiv);
        this.textDiv.style.minHeight = "1rem";
        this.uiElement.style.minHeight = "1rem";
        let borderWidth = "0.1rem";
        this.uiElement.style.border = "solid";
        this.uiElement.style.borderWidth = borderWidth;
        this.uiElement.style.padding = "-" + borderWidth;
        this.updateBorderStyle();
        this.textDiv.contentEditable = "true";
        this.textDiv.style.outline = "0px solid transparent";
        this.textDiv.style.whiteSpace = "pre-wrap"; // avoid a bug in Mozilla Firefox (STR + Backspace creates weird white space)
        this.textDiv.onblur = function () {
            self.updateBorderStyle();
            self.updateTextProperty();
        };
        this.textDiv.onfocus = function () {
            self.updateBorderStyle();
            App.deleteManualFocusAndFocusedUIO();
            App.focusedUIO = self.userInterfaceObject;
            self.userInterfaceObject.lastFocusedSubitem = null;
            self.userInterfaceObject.eventController.triggerEvent(EventTypes.FOCUSED, null);
            self.setCaret(self.getDisplayedText().length);
            self.updateBorderStyle();
        };
        let keyActionsMap = KeyActionDefinition.createKeyActions_TextObject(this.textObjectViewController);
        let keyActionsMap_readView = KeyActionDefinition.createKeyActions_TextObject_readView(this.textObjectViewController);
        this.textDiv.onkeydown = function (ev: KeyboardEvent) {
            let keyEvent = KeyEvent.createFromKeyboardEvent(ev);
            let compareString = keyEvent.createCompareString();
            if (keyActionsMap.has(compareString)) {
                keyEvent.preventDefault();
                keyActionsMap.get(compareString)();
            } else if (App.keyMap.has(compareString)) {
                keyEvent.preventDefault();
                self.userInterfaceObject.eventController.triggerEvent(App.keyMap.get(compareString), null);
            } else if (!self.editView) {
                if (keyActionsMap_readView.has(compareString)) {
                    keyEvent.preventDefault();
                    keyActionsMap_readView.get(compareString)();
                } else if (App.keyMap_readView.has(compareString)) {
                    keyEvent.preventDefault();
                    self.userInterfaceObject.eventController.triggerEvent(App.keyMap_readView.get(compareString), null);
                }
            }
            if (!self.editView) {
                if (self.simpleDefaultKey(ev)) {
                    ev.preventDefault();
                }
            }
        };
        this.dataObserver = function (property: string) {
            if (General.primEquals(property, TEXT)) {
                self.updateDisplayedText();
            } else {
                self.update_exceptDisplayedText();
            }
        };
        this.setOnClick();
        this.setOnContextmenu();
        App.objEvents.addObserver(this.getSemsAddress(), EventTypes.PROPERTY_CHANGE, this.dataObserver);
        App.objEvents.addObserver(this.getSemsAddress(), EventTypes.DETAILS_CHANGE, this.dataObserver);
        this.userInterfaceObject.getEventController().addObserver(EventTypes.CHANGED, function () {
            self.update_exceptDisplayedText();
        });
        this.userInterfaceObject.getEventController().addObserver(EventTypes.DELETED, function () {
            self.delete();
        });
        // paste unformatted
        this.textDiv.addEventListener("paste", function (ev: any) {
            ev.preventDefault();
            var text = (ev.originalEvent || ev).clipboardData.getData('text/plain');
            document.execCommand("insertText", false, text);
        });
        this.uiElement.onmousedown = function (ev: MouseEvent) {
            if (!ev.ctrlKey) {
                ev.preventDefault();
                self.focus();
            }
        }
    }

    // true if simple default case (key should be printed)
    public simpleDefaultKey(ev: KeyboardEvent) {
        return ev.key.length == 1 && !ev.ctrlKey;
    }

    private getProps(): RemotePropertiesOfSemsObject {
        return this.props;
    }

    private bodyAvailable() : boolean {
        return this.textObjectViewController.bodyAvailable();
    }
    
    public isCollapsed() : boolean {
        return this.textObjectViewController.isCollapsed();
    }

    private isDefaultExpanded() : boolean {
        return this.getProps().get(DEFAULT_EXPANDED);
    }


    private setOnClick() {
        let self = this;
        this.getUiElement().onclick = (ev) => {
            if (ev.ctrlKey) {
                if (!self.hasFocus()) {
                    self.focus();
                }
            } else {
                ev.preventDefault();
                self.focus();
                if (!self.isDefaultExpanded()) {
                    if (self.textObjectViewController.isCollapsed()) {
                        self.textObjectViewController.expandIfCollapsedAndBodyIsAvailable();
                    } else {
                        self.textObjectViewController.collapse();
                    }
                }
            }
        };
    }

    private setOnContextmenu() {
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

    public getDisplayedText(): string {
        return this.textDiv.innerText;
    }

    public setDisplayedText(text: string) {
        this.textDiv.innerText = text;
    }

    public hasFocus(): boolean {
        return document.activeElement == this.textDiv;
    }

    public setCaret(position: number) {
        let range: Range = document.createRange();
        let selection: Selection = document.getSelection();
        range.setStart(this.textDiv.childNodes[0], position);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    public toEditView() {
        this.editView = true;
    }





    public update() {
        this.updateDisplayedText();
        this.update_exceptDisplayedText();
    }

    // purpose: avoid loss of untransmitted text
    private update_exceptDisplayedText() {
        this.updateTextColor();
        this.updateUnderline();
        this.updateCursorStyle();
        this.updateBorderStyle();
    }

    private updateDisplayedText() {
        if (!General.primEquals(this.getDisplayedText(), this.getProps().get(TEXT))) {
            this.setDisplayedText(this.getProps().get(TEXT));
        } else if (this.getDisplayedText() == null) {
            this.setDisplayedText("");
        }
    }

    public updateTextColor() {
        this.textDiv.style.color = this.getTextColor();
    }

    private getTextColor(): string {
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

    public updateBorderStyle() {
        if (this.hasFocus()) {
            if (this.editView) {
                this.uiElement.style.borderColor = "green";
            } else {
                this.uiElement.style.borderColor = "orange";
            }
        } else {
            this.uiElement.style.borderColor = App.backgroundColor;
        }
    }

    
    private updateUnderline() {
        if (this.bodyAvailable() && !this.isDefaultExpanded()) {
            if (this.isCollapsed()) {
                this.setStyleForText("text-decoration", "underline");
                this.setStyleForText("text-decoration-style", "solid");
            } else {
                this.setStyleForText("text-decoration", "underline");
                this.setStyleForText("text-decoration-style", "double");
            }
        } else {
            this.setStyleForText("text-decoration", "none");
        }
    }

    private updateCursorStyle() {
        if (this.bodyAvailable() && !this.isDefaultExpanded()) {
            this.getUiElement().style.cursor = "pointer";
        } else {
            this.getUiElement().style.cursor = "default";
        }
    }

    private setStyleForText(property: string, value: string) {
        this.textDiv.style.setProperty(property, value);
    }
}