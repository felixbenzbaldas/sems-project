import { App } from "../App";
import { CONTEXT } from "../Consts";
import { DetailsData } from "../data/DetailsData";
import { ObjectLoader } from "../data/ObjectLoader";
import { EventTypes } from "../EventTypes";
import { General } from "../general/General";
import { Html } from "../general/Html";
import { List } from "../general/List";
import { TextObjectViewController } from "./TextObjectViewController";
import { UserInterfaceObject } from "./UserInterfaceObject";
import { View } from "./View";

export class DetailsView {
    
    private userInterfaceObject : UserInterfaceObject;
    private detailsData : DetailsData;
    private uiElement : HTMLElement;
    private detailUserInterfaceObjects: Array<UserInterfaceObject>;
    private textObjectViewController : TextObjectViewController;

    public onEmpty : Function = General.emptyFunction;
    public onLostFocus : Function = General.emptyFunction;

    public static create(userInterfaceObject : UserInterfaceObject, textObjectViewController : TextObjectViewController) {
        let details = new DetailsView();
        details.userInterfaceObject = userInterfaceObject;
        details.textObjectViewController = textObjectViewController;
        details.detailsData = DetailsData.map.get(userInterfaceObject.semsAddress);
        return details;
    }

    public createUiElement() : HTMLElement {
        this.uiElement = document.createElement("div");
        this.updateView();
        return this.uiElement;
    }

    public updateView() {
        console.log("DetailsView updateView");
        Html.removeAllChildren(this.uiElement);
        this.detailUserInterfaceObjects = [];
        let self = this;
        self.detailsData.ensureDetailsAreLoaded(function() {
            self.createUserInterfaceObjectsForDetails();
            self.appendDetailUiElements();
        });
    }

    public updateViewAndFocus(position : number) {
        this.updateView();
        this.detailUserInterfaceObjects[position].focus();
    }

    private createUserInterfaceObjectsForDetails() {
        let listOfAddresses = this.detailsData.getDetails();
        for (let i = 0; i < listOfAddresses.length; i++) {
            let userInterfaceObject = this.createDetailUserInterfaceObject(listOfAddresses[i]);
            this.detailUserInterfaceObjects.push(userInterfaceObject);
        }
    }
    
    private appendDetailUiElements() {
        for (let i = 0; i < this.detailUserInterfaceObjects.length; i++) {
            this.uiElement.appendChild(this.detailUserInterfaceObjects[i].getUiElement());
        }
    }

    private createDetailUserInterfaceObject(semsAddress : string) : UserInterfaceObject {
        let userInterfaceObject = View.createFromSemsAddress(semsAddress, this.userInterfaceObject);
        userInterfaceObject.onDeleteEvent = this.getOnDeleteEventFunction(userInterfaceObject);
        userInterfaceObject.onEnterEvent = this.getOnEnterEventFunction(userInterfaceObject);
        userInterfaceObject.onPasteNextEvent = this.getOnPasteNextEventFunction(userInterfaceObject);
        userInterfaceObject.getEventController().on(EventTypes.FOCUS_PREV, this.getOnFocusPrevEventFunction(userInterfaceObject));
        userInterfaceObject.getEventController().on(EventTypes.FOCUS_PREV_WORD, this.getOnFocusPrevWordEventFunction(userInterfaceObject));
        userInterfaceObject.getEventController().on(EventTypes.FOCUS_NEXT_WORD_vc, this.getOnFocusNextWordEventFunction(userInterfaceObject));
        userInterfaceObject.getEventController().on(EventTypes.FOCUS_NEXT_ON_SAME_LEVEL, this.getOnFocusNextEventFunction(userInterfaceObject));
        userInterfaceObject.getEventController().on(EventTypes.GO_TO_END_OF_LIST_vc, this.goToEndOfList_Function(userInterfaceObject));
        userInterfaceObject.getEventController().on(EventTypes.FOCUSED, this.focused_Function(userInterfaceObject));
        let self = this;
        userInterfaceObject.getEventController().on(EventTypes.CHANGED, function() {
            self.textObjectViewController.childChanged();
        });
        return userInterfaceObject;
    }

    public createContextDetailAtPositionAndFocusIt(position : number) {
        let self = this;
        this.detailsData.createContextDetailAtPostion("", position, function(detailSemsAddress) {
            let detailUserInterfaceObject = self.createDetailUserInterfaceObject(detailSemsAddress);
            self.insertUserInterfaceObjectAtPositionAndFocusIt(detailUserInterfaceObject, position);
        });
    }

    public createLinkDetailAtPositionAndFocusIt(position : number, address : string) {
        this.detailsData.createLinkDetailAtPostion(address, position);
        let detailUserInterfaceObject = this.createDetailUserInterfaceObject(address);
        this.insertUserInterfaceObjectAtPositionAndFocusIt(detailUserInterfaceObject, position);
    }

    private insertUserInterfaceObjectAtPositionAndFocusIt(detailUserInterfaceObject : UserInterfaceObject, position : number) {
        List.insertInListAtPosition(this.detailUserInterfaceObjects, detailUserInterfaceObject, position);
        Html.insertChildAtPosition(this.uiElement, detailUserInterfaceObject.getUiElement(), position);
        detailUserInterfaceObject.focus();
    }
    
    private getOnDeleteEventFunction(userInterfaceObject : UserInterfaceObject) {
        let self = this;
        return function () {
            App.addToDeletedList(userInterfaceObject.semsAddress);
            if (userInterfaceObject.tovcOpt != null) {
                userInterfaceObject.tovcOpt.context.deleteContextIfDisplayedInContext();
            }
            let indexOfDetail = self.detailUserInterfaceObjects.indexOf(userInterfaceObject);
            self.detailsData.deleteDetail(userInterfaceObject.getSemsAddress(), indexOfDetail);
            List.deleteInListAtPosition(self.detailUserInterfaceObjects, indexOfDetail);
            self.uiElement.removeChild(userInterfaceObject.getUiElement());
            self.textObjectViewController.childChanged();
            if (self.detailUserInterfaceObjects.length > 0) {
                self.detailUserInterfaceObjects[Math.min(self.detailUserInterfaceObjects.length - 1, indexOfDetail)].focus();
            } else {
                self.onEmpty();
                self.onLostFocus();
            }
        }
    }

    private getOnEnterEventFunction(detailUserInterfaceObject : UserInterfaceObject) {
        let self = this;
        return function () {
            let indexOfDetail = self.detailUserInterfaceObjects.indexOf(detailUserInterfaceObject);
            self.createContextDetailAtPositionAndFocusIt(indexOfDetail + 1);
        };
    }

    private getOnPasteNextEventFunction(detailUserInterfaceObject : UserInterfaceObject) {
        let self = this;
        return function () {
            let indexOfDetail = self.detailUserInterfaceObjects.indexOf(detailUserInterfaceObject);
            let semsAddressOfPasteObject = App.clipboard;
            self.detailsData.createLinkDetailAtPostion(semsAddressOfPasteObject, indexOfDetail + 1);
            let newDetailUserInterfaceObject = self.createDetailUserInterfaceObject(semsAddressOfPasteObject);
            if (App.obj_in_clipboard_lost_context) {
                App.objProperties.setProperty(semsAddressOfPasteObject, CONTEXT, self.userInterfaceObject.semsAddress);
                App.obj_in_clipboard_lost_context = false;
            }
            self.insertUserInterfaceObjectAtPositionAndFocusIt(newDetailUserInterfaceObject, indexOfDetail + 1);
        };
    }

    private getOnFocusPrevEventFunction(detailUserInterfaceObject : UserInterfaceObject) {
        let self = this;
        return function () {
            let indexOfDetail = self.detailUserInterfaceObjects.indexOf(detailUserInterfaceObject);
            if (indexOfDetail > 0) {
                self.detailUserInterfaceObjects[indexOfDetail - 1].takeCursorFromBottom();
            } else {
                if (self.textObjectViewController.context.showContextAsSubitem()) {
                    self.textObjectViewController.context.contextAsSubitem_takeFocusFromBottom();
                } else {
                    self.userInterfaceObject.focus();
                }
            }
        };
    }

    private getOnFocusPrevWordEventFunction(detailUserInterfaceObject : UserInterfaceObject) {
        let self = this;
        return function () {
            let indexOfDetail = self.detailUserInterfaceObjects.indexOf(detailUserInterfaceObject);
            if (indexOfDetail > 0) {
                self.detailUserInterfaceObjects[indexOfDetail - 1].eventController.triggerEvent(EventTypes.FOCUS_LAST_WORD, null);
            } else {
                self.textObjectViewController.headText.getSemsText().focusLastWord();
            }
        };
    }

    private getOnFocusNextWordEventFunction(detailUserInterfaceObject : UserInterfaceObject) {
        let self = this;
        return function () {
            let indexOfDetail = self.detailUserInterfaceObjects.indexOf(detailUserInterfaceObject);
            if (indexOfDetail < self.detailUserInterfaceObjects.length - 1) {
                self.detailUserInterfaceObjects[indexOfDetail + 1].eventController.triggerEvent(EventTypes.FOCUS_FIRST_WORD, null);
            } else {
                self.userInterfaceObject.eventController.triggerEvent(EventTypes.FOCUS_NEXT_WORD_vc, null);
            }
        };
    }

    private getOnFocusNextEventFunction(detailUserInterfaceObject : UserInterfaceObject) {
        let self = this;
        return function () {
            let indexOfDetail = self.detailUserInterfaceObjects.indexOf(detailUserInterfaceObject);
            if (indexOfDetail + 1 < self.detailUserInterfaceObjects.length) {
                self.detailUserInterfaceObjects[indexOfDetail + 1].focus();
            } else {
                self.userInterfaceObject.getEventController().triggerEvent(EventTypes.FOCUS_NEXT_ON_SAME_LEVEL, null);
            }
        };
    }

    private goToEndOfList_Function(detailUserInterfaceObject : UserInterfaceObject) {
        let self = this;
        return function () {
            let indexOfDetail = self.detailUserInterfaceObjects.indexOf(detailUserInterfaceObject);
            if (indexOfDetail + 1 == self.detailUserInterfaceObjects.length) {
                self.userInterfaceObject.eventController.triggerEvent(EventTypes.GO_TO_END_OF_LIST_vc, null);
            } else {
                self.focusLastObject();
            }
        };
    }

    private focused_Function(detailUserInterfaceObject : UserInterfaceObject) : Function {
        let self = this;
        return function() {
            if (self.userInterfaceObject.lastFocusedSubitem != detailUserInterfaceObject) {
                self.userInterfaceObject.lastFocusedSubitem = detailUserInterfaceObject;
            }
            self.userInterfaceObject.eventController.triggerEvent(EventTypes.FOCUSED, null);
        }
    }

    public scaleUp() {
        for (let uio of this.detailUserInterfaceObjects) {
            uio.scaleUp();
        }
    }

    public scaleDownIsPossible() : boolean {
        for (let uio of this.detailUserInterfaceObjects) {
            if (uio.scaleDownIsPossible()) {
                return true;
            }
        }
        return false;
    }

    public scaleDown() {
        for (let uio of this.detailUserInterfaceObjects) {
            if (uio.scaleDownIsPossible()) {
                uio.scaleDown();
            }
        }
    }

    public hasContent() {
        return this.detailUserInterfaceObjects.length > 0;
    }

    public takeFocusFromTop() {
        if (this.detailUserInterfaceObjects.length > 0) {
            this.detailUserInterfaceObjects[0].focus();
        }
    }

    public takeFocusFromBottom() {
        if (this.detailUserInterfaceObjects.length > 0) {
            this.detailUserInterfaceObjects[this.detailUserInterfaceObjects.length - 1].takeCursorFromBottom();
        }
    }

    public focusFirstWord() {
        if (this.detailUserInterfaceObjects.length > 0) {
            this.detailUserInterfaceObjects[0].eventController.triggerEvent(EventTypes.FOCUS_FIRST_WORD, null);
        }
    }

    public focusLastWord() {
        if (this.detailUserInterfaceObjects.length > 0) {
            this.detailUserInterfaceObjects[this.detailUserInterfaceObjects.length - 1
                                    ].eventController.triggerEvent(EventTypes.FOCUS_LAST_WORD, null);
        }
    }

    public focusLastObject() {
        if (this.detailUserInterfaceObjects.length > 0) {
            this.detailUserInterfaceObjects[this.detailUserInterfaceObjects.length - 1].focus();
        }
    }

    public clear() {
        if (this.detailUserInterfaceObjects != null) {
            for (let uio of this.detailUserInterfaceObjects) {
                uio.delete();
            }
        }
        this.detailUserInterfaceObjects = [];
        if (this.uiElement != null) {
            Html.removeAllChildren(this.uiElement);
        }
    }

    public refreshUIO(uio : UserInterfaceObject) {
        let indexOfUIO = this.detailUserInterfaceObjects.indexOf(uio);
        List.deleteInListAtPosition(this.detailUserInterfaceObjects, indexOfUIO);
        Html.remove(uio.uiElement);
        //
        let newUio : UserInterfaceObject = this.createDetailUserInterfaceObject(uio.semsAddress);
        List.insertInListAtPosition(this.detailUserInterfaceObjects, newUio, indexOfUIO);
        Html.insertChildAtPosition(this.uiElement, newUio.uiElement, indexOfUIO);
    }
    
    public getPositionOfDetailUIO(detailUIO : UserInterfaceObject) : number {
        return this.detailUserInterfaceObjects.indexOf(detailUIO);
    }

    public getUioAtPosition(position : number) : UserInterfaceObject {
        return this.detailUserInterfaceObjects[position];
    }

    public getNumberOfDetails() : number {
        return this.detailUserInterfaceObjects.length;
    }

    public getListOfDetailUios() {
        return this.detailUserInterfaceObjects;
    }
}