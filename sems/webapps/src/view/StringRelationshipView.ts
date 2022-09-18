import { App } from "../App";
import { ObjectLoader } from "../data/ObjectLoader";
import { EventTypes } from "../EventTypes";
import { AnimatedHeadBody } from "../general/AnimatedHeadBody";
import { FixRenderBug } from "../general/FixRenderBug";
import { Html } from "../general/Html";
import { Column } from "./Column";
import { HeadTextUtil } from "./HeadTextUtil";
import { KeyController } from "./KeyController";
import { TextObjectViewController } from "./TextObjectViewController";
import { UserInterfaceObject } from "./UserInterfaceObject";
import { View } from "./View";

export class StringRelationshipView {

    private headBody : AnimatedHeadBody = View.createStyledAnimatedHeadBody();
    private addressOfObject;
    private object_UserInterfaceObject : UserInterfaceObject;
    private uio : UserInterfaceObject;
    private keyController : KeyController;

    static create(stringRelationship : string, addressOfObject : string, viewContext : UserInterfaceObject) : StringRelationshipView {
        let stringRelationshipView = new StringRelationshipView();
        stringRelationshipView.uio = new UserInterfaceObject();
        stringRelationshipView.uio.stringRelationshipView_opt = stringRelationshipView;
        stringRelationshipView.keyController = new KeyController();
        stringRelationshipView.keyController.transmitKeyEventsTo(stringRelationshipView.uio);
        stringRelationshipView.uio.viewContext = viewContext;
        stringRelationshipView.addressOfObject = addressOfObject;
        stringRelationshipView.createHeadText(stringRelationship);
        //
        stringRelationshipView.uio.eventController.on(EventTypes.SCALE_UP, function() {
            if (stringRelationshipView.headBody.isCollapsed()) {
                stringRelationshipView.expand();
            } else {
                stringRelationshipView.object_UserInterfaceObject.eventController.triggerEvent(EventTypes.SCALE_UP, null);
            }
        });
        stringRelationshipView.uio.eventController.on(EventTypes.SCALE_DOWN, function() {
            stringRelationshipView.scaleDown();
        });
        stringRelationshipView.uio.eventController.on(EventTypes.FOCUS_NEXT, function() {
            if (!stringRelationshipView.headBody.isCollapsed()) {
                stringRelationshipView.object_UserInterfaceObject.focus();
            } else {
                stringRelationshipView.uio.eventController.triggerEvent(EventTypes.FOCUS_NEXT_ON_SAME_LEVEL, null);
            }
        });
        stringRelationshipView.uio.eventController.on(EventTypes.FOCUS, function() {
            stringRelationshipView.focus();
        });
        stringRelationshipView.uio.eventController.on(EventTypes.FOCUS_PREV_COLUMN, function() {
            stringRelationshipView.focusPrevColumn();
        });
        stringRelationshipView.uio.eventController.on(EventTypes.FOCUS_NEXT_COLUMN, function() {
            stringRelationshipView.focusNextColumn();
        });
        stringRelationshipView.uio.eventController.on(EventTypes.REPLACE_TOP_LEVEL_OBJECT, function() {
            ObjectLoader.ensureLoaded(stringRelationshipView.addressOfObject, function() {
                stringRelationshipView.createObject(stringRelationshipView.addressOfObject);
                stringRelationshipView.object_UserInterfaceObject.tovcOpt.replaceTopLevelObject();
            });
        });
        stringRelationshipView.uio.eventController.on(EventTypes.OPEN, function() {
            ObjectLoader.ensureLoaded(stringRelationshipView.addressOfObject, function() {
                stringRelationshipView.createObject(stringRelationshipView.addressOfObject);
                stringRelationshipView.object_UserInterfaceObject.tovcOpt.open();
            });
        });
        stringRelationshipView.uio.eventController.on(EventTypes.FOCUS_VIEW_CONTEXT, function() {
            stringRelationshipView.uio.viewContext.focus();
        });
        stringRelationshipView.uio.eventController.on(EventTypes.GO_TO_END_OF_LIST, function() {
            if (stringRelationshipView.headBody.isCollapsed()) {
                stringRelationshipView.uio.eventController.triggerEvent(EventTypes.GO_TO_END_OF_LIST_vc, null);
            } else {
                stringRelationshipView.object_UserInterfaceObject.focus();
            }
        });
        return stringRelationshipView;
    }

    private createHeadText(stringProperty : string) {
        FixRenderBug.setStyleForTextWithUnderline(this.headBody.getHead());
        this.headBody.getHead().innerText = "[" + stringProperty + "]";
        this.headBody.getHead().style.fontSize = "0.9rem";
        if (App.LOCAL_MODE) {
            this.headBody.getHead().style.color = App.secondColor;
        } else {
            this.headBody.getHead().style.color = App.thirdColor;
        }
        HeadTextUtil.setStyle(this.headBody.getHead());
        let self = this;
        this.headBody.getHead().onclick = function (ev : MouseEvent) {
            ev.preventDefault();
            self.focus();
            if (self.headBody.isCollapsed()) {
                self.expand();
            } else {
                self.collapse();
            }
        };
        HeadTextUtil.mark_collapsed_strongRels(this.headBody.getHead());
    }

    public expand() {
        let self = this;
        HeadTextUtil.mark_expanded(self.headBody.getHead());
        ObjectLoader.ensureLoaded(self.addressOfObject, function(){
            self.createObject(self.addressOfObject);
            self.headBody.expand(function () { });
        });
    }

    public collapse() {
        let self = this;
        self.headBody.collapse(function() {
            HeadTextUtil.mark_collapsed_strongRels(self.headBody.getHead());
            self.clearBody();
        });
    }

    public getUiElement() {
        return this.headBody.getUiElement();
    }

    private clearBody() {
        Html.removeAllChildren(this.headBody.getBody());
        if (this.object_UserInterfaceObject != null) {
            this.object_UserInterfaceObject.delete();
        }
        this.object_UserInterfaceObject = null;
    }

    private createObject(semsAddress : string) {
        this.object_UserInterfaceObject = View.createFromSemsAddress(semsAddress, null);
        this.object_UserInterfaceObject.viewContext = this.uio;
        let self = this;
        this.object_UserInterfaceObject.eventController.on(EventTypes.FOCUS_PREV, function() {
            self.focus();
        });
        this.object_UserInterfaceObject.eventController.on(EventTypes.FOCUS_NEXT_ON_SAME_LEVEL, function() {
            self.uio.eventController.triggerEvent(EventTypes.FOCUS_NEXT_ON_SAME_LEVEL, null);
        });
        this.object_UserInterfaceObject.eventController.on(EventTypes.GO_TO_END_OF_LIST_vc, function() {
            self.uio.eventController.triggerEvent(EventTypes.GO_TO_END_OF_LIST_vc, null);
        });
        this.headBody.getBody().appendChild(this.object_UserInterfaceObject.getUiElement());
    }

    public getAddressOfObject() : string {
        return this.addressOfObject;
    }

    public ensureCollapsed() {
        this.headBody.collapseWithoutAnimation();
        HeadTextUtil.mark_collapsed_strongRels(this.headBody.getHead());
        this.clearBody();
    }

    public focus() {
        App.deleteFocus();
        App.manualFocus = this;
        App.focusedUIO = this.uio;
        if (App.LOCAL_MODE) {
            this.headBody.getHead().style.color = App.thirdColor;
        }
    }

    public takeFocusFromBottom() {
        if (this.headBody.isCollapsed()) {
            this.focus();
        } else {
            this.object_UserInterfaceObject.takeCursorFromBottom();
        }
    }

    public blur() {
        App.manualFocus = null;
        App.focusedUIO = null;
        if (App.LOCAL_MODE) {
            this.headBody.getHead().style.color = App.secondColor;
        }
    }

    public triggerKeyDown(ev: KeyboardEvent) {
        this.keyController.triggerKeyDown(ev);
        
    }

    public triggerKeyUp(ev: KeyboardEvent) {
        this.keyController.triggerKeyUp(ev);
    }

    
    private getTopLevelObject() : UserInterfaceObject {
        return this.uio.getTopLevelObject();
    }

    private getColumn() : Column {
        let topLevelObject = this.getTopLevelObject();
        let column : Column = topLevelObject.viewContext.columnOpt;
        return column;
    }

    
    private focusPrevColumn() {
        let topLevelObject = this.getTopLevelObject();
        let column : Column = topLevelObject.viewContext.columnOpt;
        column.userInterfaceObject.getEventController().triggerEvent(EventTypes.FOCUS_PREV_COLUMN, null);
    }

    private focusNextColumn() {
        let topLevelObject = this.getTopLevelObject();
        let column : Column = topLevelObject.viewContext.columnOpt;
        column.userInterfaceObject.getEventController().triggerEvent(EventTypes.FOCUS_NEXT_COLUMN, null);
    }

    public getUserInterfaceObject() {
        return this.uio;
    }

    public scaleDownIsPossible() {
        return !this.headBody.isCollapsed();
    }

    public scaleDown() {
        if (!this.headBody.isCollapsed()) {
            if (this.object_UserInterfaceObject.scaleDownIsPossible()) {
                this.object_UserInterfaceObject.scaleDown();
            } else {
                this.collapse();
            }
        } else {
            if (this.uio.viewContext != null) {
                this.uio.viewContext.focus();
                this.uio.viewContext.scaleDown();
            }
        }
    }
}