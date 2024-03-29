import { App } from "../App";
import { CONTEXT, DEFAULT_EXPANDED, IS_PRIVATE, OVERVIEW_ADDR, SEMS_ADDRESS, TEXT } from "../Consts";
import { Data } from "../data/Data";
import { DetailsData } from "../data/DetailsData";
import { ObjectLoader } from "../data/ObjectLoader";
import { RemoteProperties } from "../data/RemoteProperties";
import { RemotePropertiesOfSemsObject } from "../data/RemotePropertiesOfSemsObject";
import { TextObject } from "../data/TextObject";
import { EventTypes } from "../EventTypes";
import { AnimatedHeadBody } from "../general/AnimatedHeadBody";
import { EventController } from "../general/EventController";
import { General } from "../general/General";
import { Html } from "../general/Html";
import { SemsServer } from "../SemsServer";
import { Column } from "./Column";
import { ColumnManager } from "./ColumnManager";
import { Context } from "./Context";
import { DetailsView } from "./DetailsView";
import { Export } from "./Export";
import { HeadText } from "./HeadText";
import { UserInterfaceObject } from "./UserInterfaceObject";
import { View } from "./View";

export class TextObjectViewController {

    public detailsData : DetailsData;
    public headBody: AnimatedHeadBody = View.createStyledAnimatedHeadBody();

    private props : RemotePropertiesOfSemsObject;
    public headText: HeadText;
    public detailsView : DetailsView;
    public context : Context;

    private uio : UserInterfaceObject;

    // pre-condition: object is loaded
    public static installTextObjectViewController(semsAddress : string, viewContext : UserInterfaceObject) : UserInterfaceObject {
        let userInterfaceObject : UserInterfaceObject = new UserInterfaceObject();
        userInterfaceObject.semsAddress = semsAddress;
        userInterfaceObject.props = App.objProperties.getPropertiesOfObject(userInterfaceObject.semsAddress);
        userInterfaceObject.viewContext = viewContext;
        let textObjectViewController : TextObjectViewController = new TextObjectViewController(userInterfaceObject, userInterfaceObject.props);
        userInterfaceObject.tovcOpt = textObjectViewController;
        textObjectViewController.detailsData = DetailsData.map.get(semsAddress);
        //
        textObjectViewController.context = Context.create(userInterfaceObject);
        textObjectViewController.context.onContextAsSubitemIsEmpty = TextObjectViewController.createFunction_bodyElementIsEmpty(textObjectViewController);
        textObjectViewController.detailsView = DetailsView.create(userInterfaceObject, textObjectViewController);
        textObjectViewController.detailsView.onEmpty = TextObjectViewController.createFunction_bodyElementIsEmpty(textObjectViewController);
        textObjectViewController.detailsView.onLostFocus = function() {
            userInterfaceObject.eventController.triggerEvent(EventTypes.FOCUS, null);
        };
        textObjectViewController.headText = new HeadText(textObjectViewController);
        //
        userInterfaceObject.uiElement = textObjectViewController.headBody.getUiElement();
        textObjectViewController.headBody.getHead().appendChild(textObjectViewController.context.getUiElementOfContextIcon());
        textObjectViewController.headBody.getHead().appendChild(textObjectViewController.headText.getUiElement());
        //
        if (userInterfaceObject.props.get(DEFAULT_EXPANDED)) {
            if (View.hasSuperiorInDefaultExpandedChain(userInterfaceObject, userInterfaceObject.getSemsAddress())) {
                textObjectViewController.headBody.getHead().innerHTML = "[[DUPLICATE]] " + userInterfaceObject.props.get(TEXT);
            } else {
                textObjectViewController.ensureExpandedIfBodyIsAvailable();
            }
        }
        if (!App.LOCAL_MODE) {
            userInterfaceObject.uiElement.draggable = true;
            userInterfaceObject.uiElement.ondragstart = function(event : DragEvent) {
                event.stopPropagation();
                App.draggedUIO = userInterfaceObject;
            }
        }
        ///////////////
        userInterfaceObject.eventController.addObserver(EventTypes.FOCUS, function() {
            textObjectViewController.headText.focus();
        });
        userInterfaceObject.eventController.addObserver(EventTypes.PASTE, function() {
            if (textObjectViewController.headText.getDisplayedText().length == 0 && !textObjectViewController.bodyAvailable()) {
                userInterfaceObject.onPasteNextEvent();
                userInterfaceObject.onDeleteEvent();
            } else {
                if (textObjectViewController.isCollapsed() && textObjectViewController.bodyAvailable()) {
                    textObjectViewController.expandIfCollapsedAndBodyIsAvailable();
                } else {
                    textObjectViewController.ensureExpanded();
                    let semsAddressOfPasteObject = App.clipboard;
                    if (App.obj_in_clipboard_lost_context) {
                        App.objProperties.setProperty(semsAddressOfPasteObject, CONTEXT, userInterfaceObject.semsAddress);
                        App.obj_in_clipboard_lost_context = false;
                    }
                    textObjectViewController.detailsView.createLinkDetailAtPositionAndFocusIt(0, semsAddressOfPasteObject);
                }
            }
        });
        userInterfaceObject.eventController.addObserver(EventTypes.TOGGLE_EXPAND, function() {
            if (textObjectViewController.isCollapsed()) {
                textObjectViewController.expandIfCollapsedAndBodyIsAvailable();
            } else {
                if (!userInterfaceObject.props.get(DEFAULT_EXPANDED)) {
                    textObjectViewController.collapse();
                }
            }
        });
        userInterfaceObject.eventController.addObserver(EventTypes.FOCUS_PREV_TOP_LEVEL_OBJECT, function() {
            textObjectViewController.focusPrevTopLevelObject();
        });
        userInterfaceObject.eventController.addObserver(EventTypes.FOCUS_NEXT_TOP_LEVEL_OBJECT, function() {
            textObjectViewController.focusNextTopLevelObject();
        });
        userInterfaceObject.eventController.addObserver(EventTypes.FOCUS_PREV_COLUMN, function() {
            textObjectViewController.focusPrevColumn();
        });
        userInterfaceObject.eventController.addObserver(EventTypes.FOCUS_NEXT_COLUMN, function() {
            textObjectViewController.focusNextColumn();
        });
        userInterfaceObject.eventController.addObserver(EventTypes.FOCUS_NEXT_WORD, function() {
            textObjectViewController.focusNextWord();
        });
        userInterfaceObject.eventController.addObserver(EventTypes.NEW_SUBITEM, function() {
            if (textObjectViewController.isCollapsed() && textObjectViewController.bodyAvailable()) {
                textObjectViewController.expandIfCollapsedAndBodyIsAvailable();
            } else {
                textObjectViewController.detailsData.ensureDetailsAreLoaded(function() {
                    textObjectViewController.ensureExpanded();
                    textObjectViewController.detailsView.createContextDetailAtPositionAndFocusIt_editView(0, () => {
                        textObjectViewController.headText.toReadView();
                    });
                });
            }
        });
        userInterfaceObject.eventController.addObserver(EventTypes.SCALE_DOWN, function() {
            textObjectViewController.scaleDown();
        });
        userInterfaceObject.eventController.addObserver(EventTypes.SCALE_UP, function() {
            textObjectViewController.scaleUp();
        });
        userInterfaceObject.eventController.addObserver(EventTypes.SCALE_TO_LEVEL_ONE, function() {
            if (!textObjectViewController.props.get(DEFAULT_EXPANDED)) {
                if (!textObjectViewController.isCollapsed()) {
                    textObjectViewController.collapseWithoutAnimation();
                }
            } else {
                textObjectViewController.uio.scaleDown();
            }
        });
        userInterfaceObject.eventController.addObserver(EventTypes.OPEN_OVERVIEW, function() {
            textObjectViewController.openOverviewAfter();
        });
        userInterfaceObject.eventController.addObserver(EventTypes.CUT, function() {
            App.clipboard = userInterfaceObject.semsAddress;
            App.obj_in_clipboard_lost_context = textObjectViewController.context.visualContextIsLogicalContext();
            textObjectViewController.headText.updateTextProperty();
            userInterfaceObject.onDeleteEvent();
        });
        userInterfaceObject.eventController.addObserver(EventTypes.COPY, function() {
            App.clipboard = userInterfaceObject.semsAddress;
            App.obj_in_clipboard_lost_context = false;
        });
        userInterfaceObject.eventController.addObserver(EventTypes.DELETE, function() {
            textObjectViewController.headText.updateTextProperty();
            userInterfaceObject.onDeleteEvent();
        });
        userInterfaceObject.eventController.addObserver(EventTypes.NEW_COLUMN_PREV, function() {
            ColumnManager.newColumnPrev(textObjectViewController.getColumn(), function(column : Column) {
                column.focusColumnOrFirstObject();
            });
        });
        userInterfaceObject.eventController.addObserver(EventTypes.NEW_COLUMN_NEXT, function() {
            ColumnManager.newColumnNext(textObjectViewController.getColumn(), function(column : Column) {
                column.focusColumnOrFirstObject();
            });
        });
        userInterfaceObject.eventController.addObserver(EventTypes.MOVE_COLUMN_PREV, function() {
            ColumnManager.moveColumnPrev(textObjectViewController.getColumn());
        });
        userInterfaceObject.eventController.addObserver(EventTypes.MOVE_COLUMN_NEXT, function() {
            ColumnManager.moveColumnNext(textObjectViewController.getColumn());
        });
        userInterfaceObject.eventController.addObserver(EventTypes.GO_TO_END_OF_LIST, function() {
            if (textObjectViewController.isCollapsed()) {
                userInterfaceObject.eventController.triggerEvent(EventTypes.GO_TO_END_OF_LIST_vc, null);
            } else {
                if (textObjectViewController.detailsView.hasContent()) {
                    textObjectViewController.detailsView.focusLastObject();
                } else {
                    if (textObjectViewController.context.showContextAsSubitem()) {
                        textObjectViewController.context.focusContextAsSubitem();
                    }
                }
            }
        });
        userInterfaceObject.getEventController().addObserver(EventTypes.FOCUS_LAST_FOCUSED, function() {
            if (userInterfaceObject.lastFocusedSubitem == null || textObjectViewController.isCollapsed()) {
                userInterfaceObject.focus();
            } else {
                userInterfaceObject.lastFocusedSubitem.eventController.triggerEvent(EventTypes.FOCUS_LAST_FOCUSED, null);
            }
        });
        userInterfaceObject.getEventController().addObserver(EventTypes.FOCUS_VIEW_CONTEXT, function() {
            userInterfaceObject.viewContext.focus();
        });
        /////////////////
        // XXX known bug: only the first occurence will be replaced (due to synchronization problems)
        userInterfaceObject.onInformMove = function(fromAddress : string, toAddress : string) {
            let detailsData : DetailsData = DetailsData.map.get(userInterfaceObject.semsAddress);
            let listOfDetails = detailsData.getDetails();
            let index : number;
            for (let i = 0; i < listOfDetails.length; i++) {
                let detailAddress = listOfDetails[i];
                if (General.primEquals(fromAddress, detailAddress)) {
                    detailsData.deleteDetail(detailAddress, i);
                    detailsData.createLinkDetailAtPostion(toAddress, i);
                    index = i;
                    break;
                }
            }
            textObjectViewController.detailsView.updateViewAndFocus(Math.min(index + 1, listOfDetails.length - 1));
        };
        userInterfaceObject.getEventController().addObserver(EventTypes.TAKE_CURSOR_FROM_BOTTOM, function() {
            if (textObjectViewController.isCollapsed()) {
                userInterfaceObject.focus();
            } else {
                if (textObjectViewController.detailsView.hasContent()) {
                    textObjectViewController.detailsView.takeFocusFromBottom();
                } else {
                    if (textObjectViewController.context.showContextAsSubitem()) {
                        textObjectViewController.context.contextAsSubitem_takeFocusFromBottom();
                    }
                }
            }
        });
        userInterfaceObject.getEventController().addObserver(EventTypes.REPLACE_TOP_LEVEL_OBJECT, function() {
            textObjectViewController.replaceTopLevelObject();
        });
        userInterfaceObject.getEventController().addObserver(EventTypes.OPEN, function() {
            textObjectViewController.open();
        });
        userInterfaceObject.eventController.addObserver(EventTypes.CURSOR_HINT, function() {
            textObjectViewController.headText.cursorHint();
        });
        return userInterfaceObject;
    }

    private static createFunction_bodyElementIsEmpty(textObjectViewController : TextObjectViewController) : Function {
        return function() {
            if (!textObjectViewController.bodyAvailable()) {
                textObjectViewController.collapseWithoutAnimation();
            }
        }
    }

    public constructor(uio : UserInterfaceObject, props : RemotePropertiesOfSemsObject) {
        this.uio = uio;
        this.props = props;
    }

    public getUiElement() {
        return this.uio.uiElement;
    }

    public getSemsAddress() : string {
        return this.uio.semsAddress;
    }

    public getUserInterfaceObject() {
        return this.uio;
    }

    public getEventController() : EventController {
        return this.uio.eventController;
    }

    public focus() {
        this.getEventController().triggerEvent(EventTypes.FOCUS, null);
    }

    public takeCursorFromBottom() {
        this.getEventController().triggerEvent(EventTypes.TAKE_CURSOR_FROM_BOTTOM, null);
    }

    public triggerChangedEvent() {
        this.getEventController().triggerEvent(EventTypes.CHANGED, null);
    }
    
    public delete() {
        this.getEventController().triggerEvent(EventTypes.DELETED, null);
    }

    //////////////////////////////////////////////////////////
    // events:
    
    public toggleDefaultExpandedEvent() {
        this.props.set(DEFAULT_EXPANDED, !this.props.get(DEFAULT_EXPANDED));
        if (this.props.get(DEFAULT_EXPANDED)) {
            this.expandIfCollapsedAndBodyIsAvailable();
        }
    }

    public setDefaultExpanded(defaultExpanded : boolean) {
        this.props.set(DEFAULT_EXPANDED, defaultExpanded);
    }

    public toggleLogicalContextEvent() {
        this.context.toggleLogicalContextEvent();
    }

    public togglePrivateEvent() {
        this.props.set(IS_PRIVATE, !this.props.get(IS_PRIVATE));
    }

    //////////////////////////////////////////////////

    public scaleUp() {
        if (this.isCollapsed()) {
            if (this.bodyAvailable()) {
                this.expand();
            }
        } else {
            this.detailsView.scaleUp();
        }
    }

    public scaleDown() {
        if (this.isCollapsed()) {
            if (this.uio.viewContext != null) {
                this.uio.viewContext.focus();
                this.uio.viewContext.scaleDown();
            }
        } else {
            let scaledDown : boolean = false;
            if (this.detailsView.scaleDownIsPossible()) {
                this.detailsView.scaleDown();
                scaledDown = true;
            }
            if (this.context.scaleDownOfContextAsSubitemPossible()) {
                this.context.scaleDownContextAsSubitem();
                scaledDown = true;
            }
            if (!scaledDown) {
                if (this.props.get(DEFAULT_EXPANDED)) {
                    if (this.uio.viewContext != null) {
                        this.uio.viewContext.focus();
                        this.uio.viewContext.scaleDown();
                    }
                } else {
                    this.collapse();
                }
            }
        }
    }

    public scaleDownIsPossible() : boolean {
        if (this.isCollapsed()) {
            return false;
        } else {
            if (this.props.get(DEFAULT_EXPANDED)) {
                if (this.detailsView.scaleDownIsPossible()) {
                    return true;
                }
                if (this.context.scaleDownOfContextAsSubitemPossible()) {
                    return true;
                }
                return false;
            } else {
                return true;
            }
        }
    }

    private getTopLevelObject() : UserInterfaceObject {
        return this.uio.getTopLevelObject();
    }

    public isTopLevelObject() : boolean {
        return this.getTopLevelObject() == this.uio;
    }

    public getColumn() : Column {
        let topLevelObject = this.getTopLevelObject();
        let column : Column = topLevelObject.viewContext.columnOpt;
        return column;
    }

    public open() {
        if (this.isTopLevelObject()) {
            this.getColumn().moveToNextColumn(this.getUserInterfaceObject());
        } else {
            if (!this.isCollapsed()) {
                this.collapseWithoutAnimation();
            }
            this.headText.updateTextProperty();
            App.openObject(this.getSemsAddress());
        }
    }

    public openAfter() {
        this.headText.updateTextProperty();
        let topLevelObject = this.getTopLevelObject();
        topLevelObject.eventController.triggerEvent(EventTypes.SCALE_TO_LEVEL_ONE, null);
        let column : Column = topLevelObject.viewContext.columnOpt;
        let uio : UserInterfaceObject = column.createUIOAfter(topLevelObject, this.getSemsAddress());
        uio.focus();
        uio.scaleUp();
    }

    public openOverviewAfter() {
        let topLevelObject = this.getTopLevelObject();
        let column : Column = topLevelObject.viewContext.columnOpt;
        let uio : UserInterfaceObject = column.createUIOAfter(topLevelObject, OVERVIEW_ADDR);
        uio.focus();
        uio.scaleUp();
    }

    public replaceTopLevelObject() {
        this.openAfter();
        let topLevelObject = this.getTopLevelObject();
        let column : Column = topLevelObject.viewContext.columnOpt;
        column.addToDeletedListAndDelete(topLevelObject);
    }

    public focusColumn() {
        this.getColumn().focusColumnOrFirstObject();
    }

    public focusPrevColumn() {
        let topLevelObject = this.getTopLevelObject();
        let column : Column = topLevelObject.viewContext.columnOpt;
        column.userInterfaceObject.getEventController().triggerEvent(EventTypes.FOCUS_PREV_COLUMN, null);
    }

    public focusNextColumn() {
        let topLevelObject = this.getTopLevelObject();
        let column : Column = topLevelObject.viewContext.columnOpt;
        column.userInterfaceObject.getEventController().triggerEvent(EventTypes.FOCUS_NEXT_COLUMN, null);
    }

    public focusTopLevelObject() {
        this.getTopLevelObject().focus();
    }

    public focusNextTopLevelObject() {
        let topLevelObject = this.getTopLevelObject();
        let column : Column = topLevelObject.viewContext.columnOpt;
        column.focusNextTopLevelObject(topLevelObject);
    }

    public focusPrevTopLevelObject() {
        let topLevelObject = this.getTopLevelObject();
        let column : Column = topLevelObject.viewContext.columnOpt;
        column.focusPrevTopLevelObject(topLevelObject);
    }

    public moveToCurrentHouse() {
        let self = this;
        self.detailsData.ensureDetailsAreLoaded(function() {
            SemsServer.createTextObject("", function(addressOfNewObject) {
                ObjectLoader.ensureLoaded(addressOfNewObject, function() {
                    let detailsDataOfNewObject : DetailsData = DetailsData.map.get(addressOfNewObject);
                    detailsDataOfNewObject.ensureDetailsAreLoaded(function() { // XXX es gibt eigentlich keine Details
                        let props : RemotePropertiesOfSemsObject = App.objProperties.getPropertiesOfObject(self.getSemsAddress());
                        let propsOfNewObject : RemotePropertiesOfSemsObject = App.objProperties.getPropertiesOfObject(addressOfNewObject);
                        // copy properties
                        for (let property of props.keys()) {
                            propsOfNewObject.set(property, props.get(property));
                        }
                        // copy details
                        for (let i = 0; i < self.detailsData.getDetails().length; i++)  {
                            let detailAddress : string = self.detailsData.getDetails()[i];
                            detailsDataOfNewObject.createLinkDetailAtPostion(detailAddress, i);
                        }
                        // update context
                        for (let i = 0; i < self.detailsData.getDetails().length; i++)  {
                            let detailAddress : string = self.detailsData.getDetails()[i];
                            let propsOfDetail : RemotePropertiesOfSemsObject = App.objProperties.getPropertiesOfObject(detailAddress);
                            if (General.primEquals(propsOfDetail.get(CONTEXT), self.getSemsAddress())) {
                                propsOfDetail.set(CONTEXT, addressOfNewObject);
                            }
                        }
                        let viewContext = self.uio.viewContext; // after clear self.viewContext is not valid
                        // clear
                        Data.clear(self.getSemsAddress(), function() {
                            // update parent
                            if (viewContext != null) {
                                if (viewContext.onInformMove != null) {
                                    viewContext.onInformMove(self.getSemsAddress(), addressOfNewObject);
                                }
                            }
                            // mark as moved
                            props.set(TEXT, "[[moved to:]]");
                            self.detailsData.createLinkDetailAtPostion(addressOfNewObject, 0);
                        });
                    });
                });
            });
        });
    }

    public moveTopLevelObject_forward() {
        let column : Column = this.getColumn();
        column.viewMoveForward(this.getTopLevelObject());
    }

    public moveTopLevelObject_backward() {
        let column : Column = this.getColumn();
        column.viewMoveBackward(this.getTopLevelObject());
    }

    public getListOfChildUios() : Array<UserInterfaceObject> {
        if (this.isCollapsed()) {
            return [];
        } else {
            let children : Array<UserInterfaceObject> = [];
            if (this.context.showContextAsSubitem()) {
                children.push(this.context.getUioOfContextAsSubitem());
            }
            children = children.concat(this.detailsView.getListOfDetailUios());
            return children;
        }
    }

    public focusNextWord() {
        if (this.isCollapsed()) {
            this.getEventController().triggerEvent(EventTypes.FOCUS_NEXT_WORD_vc, null);
        } else {
            if (this.detailsView.hasContent()) {
                this.detailsView.focusFirstWord();
            } else {
                this.getEventController().triggerEvent(EventTypes.FOCUS_NEXT_WORD_vc, null);
            }
        }
    }

    public openObject() {
        let address = this.props.get(TEXT);
        let self = this;
        ObjectLoader.ensureLoaded(address, function() {
            self.ensureExpanded();
            self.detailsView.createLinkDetailAtPositionAndFocusIt(0, address);
        });
    }

    ///////////////////////////////////////////////////////////
    // HeadBodyControlling:
    
    public expandIfCollapsedAndBodyIsAvailable() {
        if (this.isCollapsed() && this.bodyAvailable()) {
            this.expand();
        }
    }

    private expand() {
        let self = this;
        this.createAndAnimateBody(function() {
            self.getEventController().triggerEvent(EventTypes.CHANGED, null);
        });
    }

    // wird nur aufgerufen, wenn auch ein Body vorhanden ist.
    private createAndAnimateBody(callback : Function) {
        let self = this;
        this.createBody(function() {
            self.headBody.expand(callback);
        });
    }

    public ensureExpandedIfBodyIsAvailable() {
        if (this.bodyAvailable()) {
            this.ensureExpanded();
        }
    }

    // darf auch aufgerufen werden, wenn gar kein Body vorhanden ist
    public ensureExpanded() {
        if (this.isCollapsed()) {
            this.createBody(function() {} );
            this.headBody.expandWithoutAnimation();
            this.getEventController().triggerEvent(EventTypes.CHANGED, null);
        }
    }

    private createBody(callback: Function) {
        let self = this;
        self.detailsData.ensureDetailsAreLoaded(function() {
            self.headBody.getBody().appendChild(self.context.getUiElementOfContextAsSubitem());
            self.headBody.getBody().appendChild(self.detailsView.createUiElement());
            callback();
        });
    }

    public collapse() {
        let self = this;
        this.headBody.collapse(function () {
            self.clearBody();
            self.triggerChangedEvent();
        });
    }

    public collapseWithoutAnimation() {
        this.headBody.collapseWithoutAnimation();
        this.clearBody();
        this.triggerChangedEvent();
    }

    private clearBody() {
        Html.removeAllChildren(this.headBody.getBody());
        this.detailsView.clear();
    }

    public bodyAvailable(): boolean {
        return this.detailsData.hasDetails() || this.context.showContextAsSubitem();
    }

    public isCollapsed() : boolean {
        return this.headBody.isCollapsed();
    }

    public exportRawText() {
        this.headText.updateTextProperty();
        App.createLabeledText_ensureLoaded("[exported text]", Export.getRawTextOfTree(this, 0), address => {
            const uio = ColumnManager.columns[0].createUIOAtPosition(0, address);
            uio.focus();
            uio.scaleUp();
        });
    }

    public exportHtml() {
        this.headText.updateTextProperty();
        App.createLabeledText_ensureLoaded("[exported html]", Export.getHtmlOfTree_Safe(this, 0).innerHTML, address => {
            const uio = ColumnManager.columns[0].createUIOAtPosition(0, address);
            uio.focus();
            uio.scaleUp();
        });
    }

    public getListOfDetailUio() : Array<UserInterfaceObject> {
        return this.detailsView.getListOfDetailUios();
    }

    public getText() : string {
        return this.props.get(TEXT) as string;
    }

    public countPlannedTime() {
        let hours : number = 0;
        for (let id of this.detailsData.getDetails()) {
            let textOfDetail : string = App.objProperties.get(id, TEXT);
            if (textOfDetail.match(/^-?\d+(,\d+)?\sf/)) {
                let firstWord : string = textOfDetail.split(' ')[0];
                let timeOfThisObject : number;
                timeOfThisObject = parseFloat(firstWord.replace(',', '.'));
                hours += timeOfThisObject;
            }
        }
        let newHoursBox : string = '[' + hours.toString().replace('.', ',') + ']';
        let textBefore : string = this.headText.getDisplayedText();
        let newText : string;
        let boxRegex = /\[.*\]/;
        if (textBefore.match(boxRegex)) {
            newText = textBefore.replace(boxRegex, newHoursBox);
        } else {
            newText = textBefore + ' ' + newHoursBox;
        }
        let wasFocused : boolean = this.headText.hasFocus();
        this.props.set(TEXT, newText);
        if (wasFocused) {
            this.focus();
        }
    }

    public childChanged() {
        if (this.getText().match(/^(Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag|fplan)/)) {
            this.countPlannedTime();
        }
    }

    public search() {
        this.headText.updateTextProperty();
        SemsServer.search(this.getSemsAddress(), (address : string) => {
            ObjectLoader.ensureLoaded(address, () => {
                let column;
                if (this.getColumn().getNextColumn()) {
                    column = this.getColumn().getNextColumn();
                } else {
                    column = this.getColumn().getPreviousColumn();
                }
                const uio = column.createUIOAtPosition(0, address);
                uio.scaleUp();
            });
        });
    }

    public searchLinkContexts() {
        SemsServer.searchLinkContexts(this.getSemsAddress(), (address : string) => {
            ObjectLoader.ensureLoaded(address, () => {
                const uio = ColumnManager.columns[0].createUIOAtPosition(0, address);
                uio.focus();
                uio.scaleUp();
            });
        });
    }

    // callback delivers detailTOVC
    public createContextDetail(text : string, position : number, callback? : ((detailTovc : TextObjectViewController) => void)) {
        this.ensureExpanded();
        this.detailsView.createContextDetailAtPosition(position, detailUio => {
            detailUio.tovcOpt.setText(text);
            if (callback) {
                callback(detailUio.tovcOpt);
            }
        });
    }

    public setText(text : string) {
        this.headText.setDisplayedText(text);
        this.headText.updateTextProperty();
    }
}