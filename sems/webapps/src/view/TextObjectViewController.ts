import { App } from "../App";
import { CONTEXT, DEFAULT_EXPANDED, IS_PRIVATE, OVERVIEW_ADDR, TEXT } from "../Consts";
import { Data } from "../data/Data";
import { DetailsData } from "../data/DetailsData";
import { ObjectLoader } from "../data/ObjectLoader";
import { RemotePropertiesOfSemsObject } from "../data/RemotePropertiesOfSemsObject";
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

    public static map : Map<UserInterfaceObject, TextObjectViewController> = new Map();
    
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
        TextObjectViewController.map.set(userInterfaceObject, textObjectViewController);
        textObjectViewController.detailsData = DetailsData.map.get(semsAddress);
        //
        textObjectViewController.context = Context.create(userInterfaceObject);
        textObjectViewController.context.onContextAsSubitemIsEmpty = TextObjectViewController.createFunction_bodyElementIsEmpty(textObjectViewController);
        textObjectViewController.detailsView = DetailsView.create(userInterfaceObject, textObjectViewController);
        textObjectViewController.detailsView.onEmpty = TextObjectViewController.createFunction_bodyElementIsEmpty(textObjectViewController);
        textObjectViewController.detailsView.onLostFocus = function() {
            userInterfaceObject.eventController.triggerEvent(EventTypes.FOCUS, null);
        };
        textObjectViewController.headText = HeadText.create(textObjectViewController);
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
            if (textObjectViewController.isCollapsed() && textObjectViewController.bodyAvailable()) {
                textObjectViewController.expandIfCollapsedAndBodyIsAvailable();
            } else {
                textObjectViewController.ensureExpanded();
                let semsAddressOfPasteObject = App.clipboard;
                ObjectLoader.ensureLoaded(semsAddressOfPasteObject, function() {
                    textObjectViewController.detailsView.createLinkDetailAtPositionAndFocusIt(0, semsAddressOfPasteObject);
                });
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
        userInterfaceObject.eventController.addObserver(EventTypes.FOCUS_NEXT, function() {
            textObjectViewController.focusNext();
        });
        userInterfaceObject.eventController.addObserver(EventTypes.JUMP_FORWARD, function() {
            textObjectViewController.jumpForward();
        });
        userInterfaceObject.eventController.addObserver(EventTypes.JUMP_BACKWARD, function() {
            textObjectViewController.jumpBackward();
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
                    textObjectViewController.detailsView.createContextDetailAtPositionAndFocusIt(0);
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
            textObjectViewController.copyEvent();
            textObjectViewController.headText.updateTextProperty();
            userInterfaceObject.onDeleteEvent();
        });
        userInterfaceObject.eventController.addObserver(EventTypes.COPY, function() {
            textObjectViewController.copyEvent();
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
        userInterfaceObject.getEventController().addObserver(EventTypes.FOCUS_LAST_WORD, function() {
            if (textObjectViewController.isCollapsed()) {
                textObjectViewController.headText.getSemsText().focusLastWord();
            } else {
                if (textObjectViewController.detailsView.hasContent()) {
                    textObjectViewController.detailsView.focusLastWord();
                } else {
                    textObjectViewController.headText.getSemsText().focusLastWord();
                }
            }
        });
        userInterfaceObject.getEventController().addObserver(EventTypes.FOCUS_FIRST_WORD, function() {
            textObjectViewController.headText.getSemsText().focusFirstWord();
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

    public copyEvent() {
        App.clipboard = this.getSemsAddress();
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
        let column : Column = Column.map.get(topLevelObject.viewContext);
        return column;
    }

    public open() {
        if (!this.isCollapsed()) {
            this.collapseWithoutAnimation();
        }
        App.openObject(this.getSemsAddress());
    }

    public openAfter() {
        let topLevelObject = this.getTopLevelObject();
        topLevelObject.eventController.triggerEvent(EventTypes.SCALE_TO_LEVEL_ONE, null);
        let column : Column = Column.map.get(topLevelObject.viewContext);
        let uio : UserInterfaceObject = column.createUIOAfter(topLevelObject, this.getSemsAddress());
        uio.focus();
        uio.scaleUp();
    }

    public openOverviewAfter() {
        let topLevelObject = this.getTopLevelObject();
        let column : Column = Column.map.get(topLevelObject.viewContext);
        let uio : UserInterfaceObject = column.createUIOAfter(topLevelObject, OVERVIEW_ADDR);
        uio.focus();
        uio.scaleUp();
    }

    public replaceTopLevelObject() {
        this.openAfter();
        let topLevelObject = this.getTopLevelObject();
        let column : Column = Column.map.get(topLevelObject.viewContext);
        column.addToDeletedListAndDelete(topLevelObject);
    }

    public focusColumn() {
        this.getColumn().focusColumnOrFirstObject();
    }

    public focusPrevColumn() {
        let topLevelObject = this.getTopLevelObject();
        let column : Column = Column.map.get(topLevelObject.viewContext);
        column.userInterfaceObject.getEventController().triggerEvent(EventTypes.FOCUS_PREV_COLUMN, null);
    }

    public focusNextColumn() {
        let topLevelObject = this.getTopLevelObject();
        let column : Column = Column.map.get(topLevelObject.viewContext);
        column.userInterfaceObject.getEventController().triggerEvent(EventTypes.FOCUS_NEXT_COLUMN, null);
    }

    public focusTopLevelObject() {
        this.getTopLevelObject().focus();
    }

    public focusNextTopLevelObject() {
        let topLevelObject = this.getTopLevelObject();
        let column : Column = Column.map.get(topLevelObject.viewContext);
        column.focusNextTopLevelObject(topLevelObject);
    }

    public focusPrevTopLevelObject() {
        let topLevelObject = this.getTopLevelObject();
        let column : Column = Column.map.get(topLevelObject.viewContext);
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

    public focusNext() {
        if (this.isCollapsed()) {
            this.getEventController().triggerEvent(EventTypes.FOCUS_NEXT_ON_SAME_LEVEL, null);
        } else {
            if (this.context.showContextAsSubitem()) {
                this.context.focusContextAsSubitem();
            } else if (this.detailsView.hasContent()) {
                this.detailsView.takeFocusFromTop();
            } else {
                this.getEventController().triggerEvent(EventTypes.FOCUS_NEXT_ON_SAME_LEVEL, null);
            }
        }
    }

    public jumpBackward() {
        let currentUio = this.uio;
        for (let i = 0; i < 7; i++) {
            let prevUio = View.getPrevUio(currentUio);
            if (prevUio != null) {
                currentUio = prevUio;
            }
        }
        currentUio.focus();
        currentUio.eventController.triggerEvent(EventTypes.CURSOR_HINT, null);
    }

    public jumpForward() {
        let currentUio = this.uio;
        for (let i = 0; i < 7; i++) {
            let nextUio = View.getNextUio(currentUio);
            if (nextUio != null) {
                currentUio = nextUio;
            }
        }
        currentUio.focus();
        currentUio.eventController.triggerEvent(EventTypes.CURSOR_HINT, null);
    }

    public hasChildUio() : boolean {
        // TODO ignoring contextAsSubitm at the moment
        if (this.isCollapsed()) {
            return false;
        } else {
            return this.detailsView.getNumberOfDetails() > 0;
        }
    }
    public getFirstChildUio() : UserInterfaceObject {
        // TODO skipping contextAsSubitm at the moment
        return this.detailsView.getUioAtPosition(0);
    }

    

    public hasNextChildUio(childUio : UserInterfaceObject) {
        let position = this.detailsView.getPositionOfDetailUIO(childUio);
        return position + 1 < this.detailsView.getNumberOfDetails();
    }

    // check hasNextChildUio before!
    public getNextChildUio(childUio : UserInterfaceObject) {
        let position = this.detailsView.getPositionOfDetailUIO(childUio);
        return this.detailsView.getUioAtPosition(position + 1);
    }

    public getPrevUio(childUio : UserInterfaceObject) {
        let position = this.detailsView.getPositionOfDetailUIO(childUio);
        if (position == 0) {
            return this.uio;
        } else {
            let prevUioOnSameLevel : UserInterfaceObject = this.detailsView.getUioAtPosition(position - 1);
            let tocv : TextObjectViewController = TextObjectViewController.map.get(prevUioOnSameLevel);
            return tocv.getLastUio();
        }
    }

    // Returns the last uio that belongs to this. If no childUio is available, then the own uio is returned.
    public getLastUio() : UserInterfaceObject {
        if (this.hasChildUio()) {
            let lastChildUio : UserInterfaceObject = this.detailsView.getUioAtPosition(this.detailsView.getNumberOfDetails() - 1);
            let tovc : TextObjectViewController = TextObjectViewController.map.get(lastChildUio);
            return tovc.getLastUio();
        } else {
            return this.uio;
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
        this.ensureExpanded();
        let textArea : HTMLTextAreaElement = document.createElement("textarea");
        this.headBody.getBody().appendChild(textArea);
        this.headText.updateTextProperty();
        textArea.value = this.props.get(TEXT);
    }

    public exportFourObjectsSafe_Html() {
        console.log("exportFourObjectsSafe_Html v1");
        this.ensureExpanded();
        let textArea : HTMLTextAreaElement = document.createElement("textarea");
        Html.insertChildAtPosition(this.headBody.getBody(), textArea, 0);
        this.headText.updateTextProperty();
        let text : string;
        let div : HTMLDivElement = document.createElement('div');
        //
        div.appendChild(Export.getHtmlOfTree_Safe(this, 0));
        //
        let nextTovc : TextObjectViewController = TextObjectViewController.map.get(View.getNextUioOnSameLevel_skippingParents(this.uio));
        div.appendChild(Export.getHtmlOfTree_Safe(nextTovc, 0));
        //
        let nextNextTovc = TextObjectViewController.map.get(View.getNextUioOnSameLevel_skippingParents(nextTovc.getUserInterfaceObject()));
        div.appendChild(Export.getHtmlOfTree_Safe(nextNextTovc, 0));
        //
        let nextNextNextTovc = TextObjectViewController.map.get(View.getNextUioOnSameLevel_skippingParents(nextNextTovc.getUserInterfaceObject()));
        div.appendChild(Export.getHtmlOfTree_Safe(nextNextNextTovc, 0));
        //
        text = div.innerHTML;
        textArea.value = text;
    }

    public getListOfDetailUio() : Array<UserInterfaceObject> {
        return this.detailsView.getListOfDetailUios();
    }

    // public exportFourObjectsSafe() {
    //     this.ensureExpanded();
    //     let textArea : HTMLTextAreaElement = document.createElement("textarea");
    //     Html.insertChildAtPosition(this.headBody.getBody(), textArea, 0);
    //     this.headText.updateTextProperty();
    //     let text : string = '';
    //     text += this.getRawTextOfTree_Safe(0);
    //     //
    //     text += '\n';
    //     let nextTovc : TextObjectViewController = TextObjectViewController.map.get(View.getNextUioOnSameLevel_skippingParents(this.uio));
    //     text += nextTovc.getRawTextOfTree_Safe(0);
    //     //
    //     text += '\n';
    //     let nextNextTovc = TextObjectViewController.map.get(View.getNextUioOnSameLevel_skippingParents(nextTovc.getUserInterfaceObject()));
    //     text += nextNextTovc.getRawTextOfTree_Safe(0);
    //     //
    //     text += '\n';
    //     let nextNextNextTovc = TextObjectViewController.map.get(View.getNextUioOnSameLevel_skippingParents(nextNextTovc.getUserInterfaceObject()));
    //     text += nextNextNextTovc.getRawTextOfTree_Safe(0);
    //     //
    //     textArea.value = text;
    // }

    // public getRawTextOfTree_Safe(level : number) : string{
    //     let text : string = "";
    //     if (level == 0) {
    //         text += this.getTextSafe().toLocaleUpperCase();
    //         text += '\n';
    //         if (!this.isCollapsed() &&!this.textHasXXXMark()) {
    //             text += '\n';
    //             text += this.detailsView.getRawTextOfTree(level + 1);
    //             text += '\n';
    //         }
    //     } else {
    //         for (let i = 1; i < level - 1; i++) {
    //             text += '  ';
    //         }
    //         if (level > 1) {
    //             text += '- ';
    //         }
    //         text += this.getTextSafe();
    //         if (!this.isCollapsed() && !this.textHasXXXMark()) {
    //             text += '\n';
    //             text += this.detailsView.getRawTextOfTree(level + 1);
    //         }
    //     }
    //     return text;
    // }

    public getText() : string {
        return this.props.get(TEXT) as string;
    }

}