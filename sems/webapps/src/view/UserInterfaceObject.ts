import { RemotePropertiesOfSemsObject } from "../data/RemotePropertiesOfSemsObject";
import { EventTypes } from "../EventTypes";
import { EventController } from "../general/EventController";
import { StringRelationshipView } from "./StringRelationshipView";
import { TextObjectViewController } from "./TextObjectViewController";
import { ViewTypes } from "./ViewTypes";

export class UserInterfaceObject {

    public viewType : ViewTypes;
    
    public semsAddress : string;
    public props : RemotePropertiesOfSemsObject;
    public uiElement : HTMLElement;

    // Optional contains an instance of TextObjectViewController.
    // A null-value means, that this uio has no tovc. 
    public tovcOpt : TextObjectViewController = null;

    public eventController : EventController;
    public viewContext: UserInterfaceObject;
    
    public onDeleteEvent: Function;
    public onEnterEvent: Function;
    public onPasteNextEvent: Function;

    public onInformMove: Function;

    public lastFocusedSubitem : UserInterfaceObject;

    public stringRelationshipView : StringRelationshipView;

    constructor() {
        this.eventController = new EventController(this);
    }

    public getUiElement() {
        return this.uiElement;
    }

    public focus() {
        this.eventController.triggerEvent(EventTypes.FOCUS, null);
    }

    public takeCursorFromBottom() {
        this.eventController.triggerEvent(EventTypes.TAKE_CURSOR_FROM_BOTTOM, null);
    }

    public triggerChangedEvent() {
        this.eventController.triggerEvent(EventTypes.CHANGED, null);
    }
    
    public delete() {
        this.getEventController().triggerEvent(EventTypes.DELETED, null);
    }

    public scaleUp() {
        if (this.tovcOpt != null) {
            this.tovcOpt.scaleUp();
        }
    }

    public scaleDown() {
        this.eventController.triggerEvent(EventTypes.SCALE_DOWN, null);
    }

    public scaleDownIsPossible() : boolean {
        if (this.tovcOpt != null) {
            return this.tovcOpt.scaleDownIsPossible();
        } else {
            return false;
        }
    }

    public getTopLevelObject() : UserInterfaceObject {
        if (this.viewContext == null) {
            return this;
        } else {
            if (this.viewContext.viewType == ViewTypes.COLUMN) {
                return this;
            } else {
                return this.viewContext.getTopLevelObject();
            }
        }
    }

    //////////////////////////////////////////////
    // Properties (deprecated - properties are public, no need for getters)

    public getSemsAddress() : string {
        return this.semsAddress;
    }

    public getViewContext() : UserInterfaceObject {
        return this.viewContext;
    }

    public getEventController() {
        return this.eventController;
    }
}