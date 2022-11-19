import { RemotePropertiesOfSemsObject } from "../data/RemotePropertiesOfSemsObject";
import { EventTypes } from "../EventTypes";
import { EventController } from "../general/EventController";
import { Column } from "./Column";
import { StringRelationshipView } from "./StringRelationshipView";
import { TextObjectViewController } from "./TextObjectViewController";
import { View } from "./View";
import { ViewTypes } from "./ViewTypes";

export class UserInterfaceObject {

    public viewType: ViewTypes;

    public semsAddress: string;
    public props: RemotePropertiesOfSemsObject;
    public uiElement: HTMLElement;

    // The suffix "opt" means, that the value is optionally.
    // A null-value means, that this uio has no value.
    public tovcOpt: TextObjectViewController = null;
    public columnOpt: Column = null;
    public stringRelationshipView_opt: StringRelationshipView = null;

    public eventController: EventController;
    public viewContext: UserInterfaceObject;

    public onDeleteEvent: Function;
    public onEnterEvent: Function;
    public onPasteNextEvent: Function;

    public onInformMove: Function;

    public lastFocusedSubitem: UserInterfaceObject;

    constructor() {
        this.eventController = new EventController(this);
        let self = this;
        this.eventController.addObserver(EventTypes.FOCUS_PREV, function() {
            self.focusPrev();
        });
        this.eventController.addObserver(EventTypes.FOCUS_NEXT, function() {
            self.focusNext();
        });
        this.eventController.addObserver(EventTypes.JUMP_BACKWARD, function () {
            self.jumpBackward();
        });
        this.eventController.addObserver(EventTypes.JUMP_FORWARD, function () {
            self.jumpForward();
        });
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

    public scaleDownIsPossible(): boolean {
        if (this.tovcOpt != null) {
            return this.tovcOpt.scaleDownIsPossible();
        } else {
            return false;
        }
    }

    public getTopLevelObject(): UserInterfaceObject {
        if (this.viewContext == null) {
            return this;
        } else {
            if (this.viewContext.columnOpt != null) {
                return this;
            } else {
                return this.viewContext.getTopLevelObject();
            }
        }
    }

    //////////////////////////////////////////////
    // Properties (deprecated - properties are public, no need for getters)

    public getSemsAddress(): string {
        return this.semsAddress;
    }

    public getViewContext(): UserInterfaceObject {
        return this.viewContext;
    }

    public getEventController() {
        return this.eventController;
    }

    //////////////////////////////////////////////

    public focusPrev() {
        let prevUio = this.getPrevUio();
        if (prevUio != null) {
            prevUio.focus();
        }
    }

    public focusNext() {
        let nextUio = this.getNextUio();
        if (nextUio != null) {
            nextUio.focus();
        }
    }

    public jumpBackward() {
        let currentUio: UserInterfaceObject = this;
        for (let i = 0; i < 7; i++) {
            let prevUio = currentUio.getPrevUio();
            if (prevUio != null && prevUio.columnOpt == null) {
                currentUio = prevUio;
            } else {
                break;
            }
        }
        currentUio.focus();
        currentUio.eventController.triggerEvent(EventTypes.CURSOR_HINT, null);
    }

    public jumpForward() {
        let currentUio: UserInterfaceObject = this;
        for (let i = 0; i < 7; i++) {
            let nextUio = currentUio.getNextUio();
            if (nextUio != null) {
                currentUio = nextUio;
            } else {
                break;
            }
        }
        currentUio.focus();
        currentUio.eventController.triggerEvent(EventTypes.CURSOR_HINT, null);
    }

    public getListOfChildUios(): Array<UserInterfaceObject> {
        if (this.tovcOpt != null) {
            return this.tovcOpt.getListOfChildUios();
        } else if (this.columnOpt != null) {
            return this.columnOpt.getListOfChildUios();
        } else if (this.stringRelationshipView_opt != null) {
            return this.stringRelationshipView_opt.getListOfChildUios();
        }
        return [];
    }

    public getPrevUio() : UserInterfaceObject {
        if (this.viewContext == null) {
            return null;
        } else {
            return this.viewContext.getPrevUioOfChildUio(this);
        }
    }

    public getPrevUioOfChildUio(childUio : UserInterfaceObject) : UserInterfaceObject {
        let children : Array<UserInterfaceObject> = this.getListOfChildUios();
        let position = children.indexOf(childUio);
        if (position > 0) {
            return children[position - 1].getLastUio();
        } else {
            return this;
        }
    }

    public getNextUio() : UserInterfaceObject {
        let children : Array<UserInterfaceObject> = this.getListOfChildUios();
        if (children.length > 0) {
            return children[0];
        } else {
            return this.getNextUio_skippingChildren();
        }
    }

    // returns the next UserInterfaceObject skipping the children of this
    public getNextUio_skippingChildren() : UserInterfaceObject {
        if (this.viewContext == null) {
            return null;
        } else {
            let parentUio = this.viewContext;
            let childrenOfParent : Array<UserInterfaceObject> = parentUio.getListOfChildUios();
            let position = childrenOfParent.indexOf(this);
            if (position + 1 < childrenOfParent.length) {
                return childrenOfParent[position + 1];
            } else {
                return parentUio.getNextUio_skippingChildren();
            }
        }
    }
    
    // Returns the last uio that belongs to this. If no childUio is available, then this is returned.
    public getLastUio() : UserInterfaceObject {
        let children : Array<UserInterfaceObject> = this.getListOfChildUios();
        if (children.length > 0) {
            return children[children.length - 1].getLastUio();
        } else {
            return this;
        }
    }

}