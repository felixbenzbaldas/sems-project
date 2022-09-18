import { App } from "../App";
import { OVERVIEW_ADDR } from "../Consts";
import { DetailsData } from "../data/DetailsData";
import { ObjectLoader } from "../data/ObjectLoader";
import { EventTypes } from "../EventTypes";
import { Html } from "../general/Html";
import { List } from "../general/List";
import { MapWithPrimitiveStringsAsKey } from "../general/MapWithPrimitiveStringsAsKey";
import { SemsServer } from "../SemsServer";
import { ColumnManager } from "./ColumnManager";
import { KeyController } from "./KeyController";
import { TextObjectViewController } from "./TextObjectViewController";
import { UserInterfaceObject } from "./UserInterfaceObject";
import { View } from "./View";
import { ViewTypes } from "./ViewTypes";

export class Column {
    
    public static map : MapWithPrimitiveStringsAsKey = new MapWithPrimitiveStringsAsKey();

    public userInterfaceObject : UserInterfaceObject;
    private listOfUIOs: Array<UserInterfaceObject> = [];

    private detailsData : DetailsData;
    private keyController : KeyController;

    private focusMark : HTMLDivElement;

    private scroll_SOLL : number = 0;
    
    private placeholderDiv : HTMLDivElement;

    // LOCAL_MODE: pre-condition: object is loaded (and defaultExpanded -> details are loaded)
    // PRES_MODE: semsAddress == null
    public static create(semsAddress : string) : Column {
        let column = new Column();
        column.userInterfaceObject = new UserInterfaceObject();
        if (App.LOCAL_MODE) {
            column.userInterfaceObject.semsAddress = semsAddress;
        }
        column.userInterfaceObject.viewType = ViewTypes.COLUMN;
        column.userInterfaceObject.uiElement = column.createUiElement();
        Column.map.set(column.userInterfaceObject, column);
        
        if (App.LOCAL_MODE) {
            column.detailsData = DetailsData.map.get(semsAddress);
            column.detailsData.ensureDetailsAreLoaded(function() {
                for (let i = 0; i < column.detailsData.getDetails().length; i++) {
                    let detail = column.detailsData.getDetails()[i];
                    let listUserInterfaceObject = column.createListUserInterfaceObject(detail);
                    List.insertInListAtPosition(column.listOfUIOs, listUserInterfaceObject, i);
                    Html.insertChildAtPosition(column.userInterfaceObject.uiElement, listUserInterfaceObject.getUiElement(), i);
                }
            });
        }
        column.getUiElement().addEventListener("wheel", function(wheelEvent : WheelEvent) {
            column.updateSOLL(wheelEvent.deltaY);
        });
        //
        column.keyController = new KeyController();
        column.keyController.transmitKeyEventsTo(column.userInterfaceObject);
        //////////////
        column.userInterfaceObject.getEventController().addObserver(EventTypes.FOCUS_PREV_TOP_LEVEL_OBJECT, function() {
            column.getPreviousColumn().focusLastTopLevelObject();
        });
        column.userInterfaceObject.getEventController().addObserver(EventTypes.FOCUS_NEXT_TOP_LEVEL_OBJECT, function() {
            column.getNextColumn().focusFirstTopLevelObject();
        });
        column.userInterfaceObject.getEventController().addObserver(EventTypes.FOCUS_PREV_COLUMN, function() {
            let prevColumn = column.getPreviousColumn();
            if (prevColumn != null) {
                prevColumn.userInterfaceObject.eventController.triggerEvent(EventTypes.FOCUS_LAST_FOCUSED, null);
            }
            App.focusedUIO.eventController.triggerEvent(EventTypes.CURSOR_HINT, null);
        });
        column.userInterfaceObject.getEventController().addObserver(EventTypes.FOCUS_NEXT_COLUMN, function() {
            let nextColumn = column.getNextColumn();
            if (nextColumn != null) {
                nextColumn.userInterfaceObject.eventController.triggerEvent(EventTypes.FOCUS_LAST_FOCUSED, null);
            }
            App.focusedUIO.eventController.triggerEvent(EventTypes.CURSOR_HINT, null);
        });
        column.userInterfaceObject.getEventController().addObserver(EventTypes.FOCUS_PREV, function() {
            column.getPreviousColumn().takeCursorFromBottom();
        });
        column.userInterfaceObject.getEventController().addObserver(EventTypes.FOCUS_NEXT, function() {
            column.getNextColumn().focusColumnOrFirstObject();
        });
        column.userInterfaceObject.getEventController().addObserver(EventTypes.OPEN_OVERVIEW, function() {
            column.insertOverview();
        });
        column.userInterfaceObject.getEventController().addObserver(EventTypes.PASTE, function() {
            let semsAddressOfPasteObject = App.clipboard;
            ObjectLoader.ensureLoaded(semsAddressOfPasteObject, function() {
                let uio = column.createListUserInterfaceObject(semsAddressOfPasteObject);
                column.insertUserInterfaceObjectAtPosition(uio, 0);
                uio.focus();
            });
        });
        column.userInterfaceObject.getEventController().addObserver(EventTypes.DELETE, function() {
            ColumnManager.deleteColumnEvent(column);
        });
        column.userInterfaceObject.getEventController().addObserver(EventTypes.NEW_SUBITEM, function() {
            column.newSubitemEvent();
        });
        column.userInterfaceObject.getEventController().addObserver(EventTypes.NEW_COLUMN_PREV, function() {
            ColumnManager.newColumnPrev(column, function(column : Column) {
                column.focusColumnOrFirstObject();
            });
        });
        column.userInterfaceObject.getEventController().addObserver(EventTypes.NEW_COLUMN_NEXT, function() {
            ColumnManager.newColumnNext(column, function(column : Column) {
                column.focusColumnOrFirstObject();
            });
        });
        column.userInterfaceObject.getEventController().addObserver(EventTypes.MOVE_COLUMN_PREV, function() {
            ColumnManager.moveColumnPrev(column);
        });
        column.userInterfaceObject.getEventController().addObserver(EventTypes.MOVE_COLUMN_NEXT, function() {
            ColumnManager.moveColumnNext(column);
        });
        column.userInterfaceObject.getEventController().addObserver(EventTypes.FOCUS_LAST_FOCUSED, function() {
            if (column.userInterfaceObject.lastFocusedSubitem == null) {
                column.focusColumnOrFirstObject();
            } else if (column.listOfUIOs.indexOf(column.userInterfaceObject.lastFocusedSubitem) == -1) {
                column.focusColumnOrFirstObject();
            } else {
                column.userInterfaceObject.lastFocusedSubitem.eventController.triggerEvent(EventTypes.FOCUS_LAST_FOCUSED, null);
            }
            column.userInterfaceObject.uiElement.scrollIntoView();
        });
        column.userInterfaceObject.getEventController().addObserver(EventTypes.SCALE_DOWN, function() {
            column.scaleDown();
        });
        //////////////
        return column;
    }

    private createUiElement() : HTMLElement {
        let html : HTMLDivElement = document.createElement("div");
        html.style.verticalAlign = "top";
        html.style.display = "inline-block";
        html.classList.add("scrollw");
        html.style.whiteSpace = "initial";
        this.placeholderDiv = App.createPlaceholderDiv();
        html.appendChild(this.placeholderDiv);
        let self = this;
        this.placeholderDiv.onclick = function(ev : MouseEvent) {
            self.takeCursorFromBottom();
        };
        this.placeholderDiv.ondragover = function(event : DragEvent) {
            event.preventDefault();
        };
        this.placeholderDiv.ondrop = function(event) {
            event.preventDefault();
            let tovc : TextObjectViewController = App.draggedUIO.tovcOpt;
            // UIO von bisheriger Stelle lösen
            if (tovc.isTopLevelObject()) {
                let originColumn : Column = tovc.getColumn();
                originColumn.delete(App.draggedUIO);
            } else {
                let viewContextUIO : UserInterfaceObject = App.draggedUIO.getViewContext();
                let viewContextTOVC : TextObjectViewController = viewContextUIO.tovcOpt;
                viewContextTOVC.detailsView.refreshUIO(App.draggedUIO);
            }
            //
            self.adaptUIO(App.draggedUIO);
            self.insertUserInterfaceObjectAtPosition(App.draggedUIO, self.listOfUIOs.length);
            if (tovc.isCollapsed()) {
                tovc.expandIfCollapsedAndBodyIsAvailable();
            }
            App.draggedUIO = null;
        };
        return html;
    }

    public createUIOAfter(beforeUIO : UserInterfaceObject, address : string) : UserInterfaceObject {
        let position = this.listOfUIOs.indexOf(beforeUIO) + 1;
        return this.createUIOAtPosition(position, address);
    }
    
    public createUIOAtPosition(position : number, address : string) : UserInterfaceObject {
        let listUserInterfaceObject = this.createListUserInterfaceObject(address);
        this.insertUserInterfaceObjectAtPosition(listUserInterfaceObject, position);
        return listUserInterfaceObject;
    }
    
    private createListUserInterfaceObject(semsAddress : string) : UserInterfaceObject {
        let userInterfaceObject = View.createFromSemsAddress(semsAddress, this.userInterfaceObject);
        this.setCallbacks(userInterfaceObject);
        return userInterfaceObject;
    }

    private setCallbacks(userInterfaceObject : UserInterfaceObject) {
        userInterfaceObject.onDeleteEvent = this.getOnDeleteEventFunction(userInterfaceObject);
        userInterfaceObject.onEnterEvent = this.getOnEnterEventFunction(userInterfaceObject);
        userInterfaceObject.onPasteNextEvent = this.getOnPasteNextEventFunction(userInterfaceObject);
        userInterfaceObject.getEventController().on(EventTypes.FOCUS_PREV, this.getOnFocusPrevEventFunction(userInterfaceObject));
        userInterfaceObject.getEventController().on(EventTypes.FOCUS_NEXT_ON_SAME_LEVEL, this.getOnFocusNextEventFunction(userInterfaceObject));
        let self = this;
        userInterfaceObject.getEventController().on(EventTypes.GO_TO_END_OF_LIST_vc, function() {
            if (!List.isLastElement(self.listOfUIOs, userInterfaceObject)) {
                self.listOfUIOs[self.listOfUIOs.length - 1].focus();
            }
        });
        userInterfaceObject.getEventController().on(EventTypes.FOCUSED, function() {
            self.userInterfaceObject.lastFocusedSubitem = userInterfaceObject;
        });
        userInterfaceObject.getEventController().on(EventTypes.FOCUS_VIEW_CONTEXT, function() {
            self.listOfUIOs[0].focus();
        });
    }

    public insertObjectAtPosition(addressOfObject : string, position : number) {
        let listUserInterfaceObject = this.createListUserInterfaceObject(addressOfObject);
        this.insertUserInterfaceObjectAtPosition(listUserInterfaceObject, position);
    }

    private insertUserInterfaceObjectAtPosition(uio : UserInterfaceObject, position : number) {
        if (App.LOCAL_MODE) {
            this.detailsData.createLinkDetailAtPostion(uio.semsAddress, position);
        }
        List.insertInListAtPosition(this.listOfUIOs, uio, position);
        Html.insertChildAtPosition(this.userInterfaceObject.uiElement, uio.getUiElement(), position);
    }

    private getOnDeleteEventFunction(userInterfaceObject : UserInterfaceObject) {
        let self = this;
        return function () {
            let indexOfDetail = self.listOfUIOs.indexOf(userInterfaceObject);
            if (App.LOCAL_MODE) {
                self.addToDeletedListAndDelete(userInterfaceObject);
            } else {
                self.delete(userInterfaceObject);
            }
            if (self.listOfUIOs.length > 0) {
                self.listOfUIOs[Math.min(self.listOfUIOs.length - 1, indexOfDetail)].eventController.triggerEvent(EventTypes.FOCUS_LAST_FOCUSED, null);
            } else {
                self.focus();
            }
        }
    }

    public insertOverview() {
        let address = OVERVIEW_ADDR;
        let self = this;
        ObjectLoader.ensureLoaded(address, function() {
            let uio = self.createUIOAtPosition(0, address);
            uio.scaleUp();
            uio.focus();
        });
    }

    public insertObjectAtBottom(address : string) {
        let self = this;
        ObjectLoader.ensureLoaded(address, function() {
            let uio = self.createUIOAtPosition(self.listOfUIOs.length, address);
            uio.scaleUp();
            uio.focus();
        });
    }

    private getOnEnterEventFunction(userInterfaceObject : UserInterfaceObject) {
        let self = this;
        return function () {
            let indexOfDetail = self.listOfUIOs.indexOf(userInterfaceObject);
            self.createObjectAtPositionAndFocusIt(indexOfDetail + 1);
        };
    }

    public createObjectAtPositionAndFocusIt(position : number) {
        let self = this;
        SemsServer.createTextObject("", function(address){
            ObjectLoader.ensureLoaded(address, function() {
                let uio : UserInterfaceObject = self.createListUserInterfaceObject(address);
                self.insertUserInterfaceObjectAtPosition(uio, position);
                uio.focus();
            });
        });
    }

    private getOnPasteNextEventFunction(userInterfaceObject : UserInterfaceObject) {
        let self = this;
        return function () {
            let indexOfUIO = self.listOfUIOs.indexOf(userInterfaceObject);
            let uio : UserInterfaceObject = self.createListUserInterfaceObject(App.clipboard);
            self.insertUserInterfaceObjectAtPosition(uio, indexOfUIO + 1);
            uio.focus();
        };
    }

    private getOnFocusPrevEventFunction(uio : UserInterfaceObject) {
        let self = this;
        return function () {
            let index = self.listOfUIOs.indexOf(uio);
            if (index > 0) {
                self.listOfUIOs[index - 1].takeCursorFromBottom();
            } else {
                self.getPreviousColumn().takeCursorFromBottom();
            }
        };
    }

    private getOnFocusNextEventFunction(uio : UserInterfaceObject) {
        let self = this;
        return function () {
            let index = self.listOfUIOs.indexOf(uio);
            if (index + 1 < self.listOfUIOs.length) {
                self.listOfUIOs[index + 1].focus();
            } else {
                self.getNextColumn().takeCursorFromTop();
            }
        };
    }

    public takeCursorFromBottom() {
        if (this.listOfUIOs.length > 0) {
            this.listOfUIOs[this.listOfUIOs.length - 1].takeCursorFromBottom();
        } else {
            this.focus();
        }
    }

    public focus() {
        App.deleteFocus();
        App.manualFocus = this;
        App.focusedUIO = this.userInterfaceObject;
        this.markAsFocused();
    }

    public blur() {
        App.manualFocus = null;
        this.markAsNotFocused();
    }

    public takeCursorFromTop() {
        if (this.listOfUIOs.length > 0) {
            this.listOfUIOs[0].focus();
        } else {
            this.focus();
        }
    }

    public getUiElement() : HTMLElement {
        return this.userInterfaceObject.uiElement;
    }

    public addToDeletedListAndDelete(userInterfaceObject : UserInterfaceObject) {
        App.addToDeletedList(userInterfaceObject.semsAddress);
        this.delete(userInterfaceObject);
    }

    private delete(userInterfaceObject : UserInterfaceObject) {
        let indexOfUIO = this.listOfUIOs.indexOf(userInterfaceObject);
        if (App.LOCAL_MODE) {
            this.detailsData.deleteDetail(userInterfaceObject.semsAddress, indexOfUIO);
        }
        Html.remove(userInterfaceObject.uiElement);
        List.deleteInListAtPosition(this.listOfUIOs, indexOfUIO);
    }

    public focusColumnOrFirstObject() {
        if (this.listOfUIOs.length > 0) {
            this.listOfUIOs[0].focus();
        } else {
            this.focus();
        }
        this.userInterfaceObject.uiElement.scrollIntoView();
    }

    public focusFirstTopLevelObject() {
        if (this.listOfUIOs.length > 0) {
            this.listOfUIOs[0].eventController.triggerEvent(EventTypes.FOCUS_LAST_FOCUSED, null);
        } else {
            this.focus();
        }
        this.userInterfaceObject.uiElement.scrollIntoView();
    }

    public focusLastTopLevelObject() {
        if (this.listOfUIOs.length > 0) {
            this.listOfUIOs[this.listOfUIOs.length - 1].eventController.triggerEvent(EventTypes.FOCUS_LAST_FOCUSED, null);
        } else {
            this.focus();
        }
    }

    private markAsFocused() {
        if (App.LOCAL_MODE) {
            this.focusMark = document.createElement("div");
            this.focusMark.style.height = "3px";
            this.focusMark.style.backgroundColor = App.thirdColor;
            Html.insertChildAtPosition(this.userInterfaceObject.uiElement, this.focusMark, 0);
        }
    }

    private markAsNotFocused() {
        Html.remove(this.focusMark);
    }

    public focusNextTopLevelObject(userInterfaceObject : UserInterfaceObject) {
        let indexOfUIO = this.listOfUIOs.indexOf(userInterfaceObject);
        if (indexOfUIO + 1 < this.listOfUIOs.length) {
            this.listOfUIOs[indexOfUIO + 1].eventController.triggerEvent(EventTypes.FOCUS_LAST_FOCUSED, null);
        } else {
            this.getNextColumn().focusFirstTopLevelObject();
        }
    }

    public focusPrevTopLevelObject(userInterfaceObject : UserInterfaceObject) {
        let indexOfUIO = this.listOfUIOs.indexOf(userInterfaceObject);
        if (indexOfUIO > 0) {
            this.listOfUIOs[indexOfUIO - 1].eventController.triggerEvent(EventTypes.FOCUS_LAST_FOCUSED, null);
        } else {
            this.getPreviousColumn().focusLastTopLevelObject();
        }
    }

    public viewMoveForward(userInterfaceObject : UserInterfaceObject) {
        let index : number = this.listOfUIOs.indexOf(userInterfaceObject);
        this.delete(userInterfaceObject);
        //
        if (this.listOfUIOs.length > index) {
            this.insertUserInterfaceObjectAtPosition(userInterfaceObject, index + 1);
            userInterfaceObject.eventController.triggerEvent(EventTypes.FOCUS_LAST_FOCUSED, null);
        } else {
            let nextColumn : Column = this.getNextColumn();
            nextColumn.adaptUIO(userInterfaceObject);
            this.getNextColumn().insertUserInterfaceObjectAtPosition(userInterfaceObject, 0);
            userInterfaceObject.eventController.triggerEvent(EventTypes.FOCUS_LAST_FOCUSED, null);
        }
    }

    public viewMoveBackward(userInterfaceObject : UserInterfaceObject) {
        let index : number = this.listOfUIOs.indexOf(userInterfaceObject);
        this.delete(userInterfaceObject);
        //
        if (index > 0) {
            this.insertUserInterfaceObjectAtPosition(userInterfaceObject, index - 1);
            userInterfaceObject.eventController.triggerEvent(EventTypes.FOCUS_LAST_FOCUSED, null);
        } else {
            let prevColumn : Column = this.getPreviousColumn();
            prevColumn.adaptUIO(userInterfaceObject);
            prevColumn.insertUserInterfaceObjectAtPosition(userInterfaceObject, prevColumn.listOfUIOs.length);
            userInterfaceObject.eventController.triggerEvent(EventTypes.FOCUS_LAST_FOCUSED, null);
        }
    }

    public adaptUIO(uio: UserInterfaceObject) {
        uio.viewContext = this.userInterfaceObject;
        this.setCallbacks(uio);
        let tovc : TextObjectViewController = uio.tovcOpt;
        tovc.context.updateContextAsSubitem();
    }

    public getNextColumn() : Column {
        if (!List.isLastElement(ColumnManager.columns, this)) {
            let indexOfNextColumn = ColumnManager.columns.indexOf(this) + 1;
            return ColumnManager.columns[indexOfNextColumn];
        } else {
            return null;
        }
    }

    public getPreviousColumn() : Column {
        let indexOfPrevColumn = ColumnManager.columns.indexOf(this) - 1;
        if (indexOfPrevColumn < 0) {
            return null;
        }
        return ColumnManager.columns[indexOfPrevColumn];
    }

    private newSubitemEvent() {
        let self = this;
        SemsServer.createTextObject("", function(semsAddress) {
            ObjectLoader.ensureLoaded(semsAddress, function() {
                let uio = self.createListUserInterfaceObject(semsAddress);
                self.insertUserInterfaceObjectAtPosition(uio, 0);
                uio.focus();
            });
        });
    }

    public triggerKeyDown(ev: KeyboardEvent) {
        this.keyController.triggerKeyDown(ev);
    }

    public triggerKeyUp(ev: KeyboardEvent) {
        this.keyController.triggerKeyUp(ev);
    }

    public getContentHeight() : number {     
        return this.getUiElement().scrollHeight;
    }

    private scaleDown() {
        this.takeCursorFromTop();
        for (let uio of this.listOfUIOs) {
            if (uio.scaleDownIsPossible()) {
                uio.scaleDown();
            }
        }
    }

    public smoothScroll_additive(deltaY : number) {
        this.updateSOLL(deltaY);
        let scrollConfig;
        if (App.LOCAL_MODE) {
            scrollConfig = {
                top: this.scroll_SOLL,
                behavior: "smooth"
            };
        } else {
            scrollConfig = {
                top: this.scroll_SOLL,
                behavior: "auto"
            }
        }
        this.getUiElement().scrollTo(scrollConfig);
    }

    public updateSOLL(deltaY : number) {
        this.scroll_SOLL = this.scroll_SOLL + deltaY;
        if (this.scroll_SOLL < 0) {
            this.scroll_SOLL = 0;
        }
        let maxScroll = this.getUiElement().scrollHeight - window.innerHeight;
        if (this.scroll_SOLL > maxScroll) {
            this.scroll_SOLL = maxScroll;
        }
    }

    public updateHeightOfPlaceholderDiv() {
        this.placeholderDiv.style.height = (window.innerHeight * View.placeholderDiv_Factor) + "px";
    }

    public expandSecondObject() {
        this.listOfUIOs[1].scaleUp();
    }

    public hasChildUio() : boolean {
        return this.listOfUIOs.length > 0;
    }

    public getFirstChildUio() : UserInterfaceObject {
        return this.listOfUIOs[0];
    }

    public hasNextChildUio(childUio : UserInterfaceObject) {
        let position = this.listOfUIOs.indexOf(childUio);
        return position + 1 < this.listOfUIOs.length;
    }

    // check hasNextChildUio before!
    public getNextChildUio(childUio : UserInterfaceObject) {
        let position = this.listOfUIOs.indexOf(childUio);
        return this.listOfUIOs[position + 1];
    }

    public getPrevUio(childUio : UserInterfaceObject) {
        let position = this.listOfUIOs.indexOf(childUio);
        if (position == 0) {
            return null;
        } else {
            let previousUioOnSameLevel = this.listOfUIOs[position - 1];
            let tovc : TextObjectViewController = previousUioOnSameLevel.tovcOpt;
            return tovc.getLastUio();
        }
    }

}