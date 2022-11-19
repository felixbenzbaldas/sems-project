import { App } from "../App";
import { CONTEXT } from "../Consts";
import { EventTypes } from "../EventTypes";
import { Html } from "../general/Html";
import { RemotePropertiesOfSemsObject } from "../data/RemotePropertiesOfSemsObject";
import { ContextIcon } from "./ContextIcon";
import { StringRelationshipView } from "./StringRelationshipView";
import { UserInterfaceObject } from "./UserInterfaceObject";
import { General } from "../general/General";
import { TextObjectViewController } from "./TextObjectViewController";

export class Context {

    private contextIconElement : HTMLElement
    private contextAsSubitem : StringRelationshipView;
    private userInterfaceObject : UserInterfaceObject;
    private containerForContextAsSubitem : HTMLElement;
    private textObjectViewController : TextObjectViewController;

    private dataObserver : Function;
    private props : RemotePropertiesOfSemsObject;

    public onContextAsSubitemIsEmpty : Function = General.emptyFunction;

    public static create(userInterfaceObject: UserInterfaceObject) : Context {
        let context = new Context();
        context.textObjectViewController = userInterfaceObject.tovcOpt;
        context.userInterfaceObject = userInterfaceObject;
        context.props = App.objProperties.getPropertiesOfObject(context.getSemsAddress());
        context.contextIconElement = ContextIcon.createContextIconElement();
        context.containerForContextAsSubitem = document.createElement("div");
        context.updateContextIcon();
        context.dataObserver = function(property : string) {
            if (General.primEquals(property, CONTEXT)) {
                context.updateContextIcon();
                context.updateContextAsSubitem();
            }
        }
        App.objEvents.addObserver(context.getSemsAddress(), EventTypes.PROPERTY_CHANGE, context.dataObserver);
        context.userInterfaceObject.getEventController().addObserver(EventTypes.DELETED, function() {
            context.delete();
        });
        return context;
    }

    //////////////////////////////////////////

    public getUiElementOfContextAsSubitem() : HTMLElement {
        this.updateContextAsSubitem();
        return this.containerForContextAsSubitem;
    }

    public updateContextAsSubitem() {
        if (this.showContextAsSubitem()) {
            if (this.contextAsSubitem == null) {
                this.clearAndCreateContextAsSubitem();
            } else {
                if (this.getProps().get(CONTEXT) != this.contextAsSubitem.getAddressOfObject()) {
                    this.clearAndCreateContextAsSubitem();
                } else {
                    this.contextAsSubitem.ensureCollapsed();
                }
            }
        } else {
            this.removeContextAsSubitem();
        }
    }

    private clearAndCreateContextAsSubitem() {
        Html.removeAllChildren(this.containerForContextAsSubitem);
        let text;
        if (App.EN_VERSION) {
            text = "Context";
        } else {
            text = "Kontext";
        }
        this.contextAsSubitem = StringRelationshipView.create(text, this.getProps().get(CONTEXT), this.userInterfaceObject);
        let self = this;
        this.contextAsSubitem.getUserInterfaceObject().eventController.on(EventTypes.FOCUS_NEXT_ON_SAME_LEVEL, function() {
            if (self.textObjectViewController.detailsView.hasContent()) {
                self.textObjectViewController.detailsView.takeFocusFromTop();
            } else {
                self.userInterfaceObject.eventController.triggerEvent(EventTypes.FOCUS_NEXT_ON_SAME_LEVEL, null);
            }
        });
        this.contextAsSubitem.getUserInterfaceObject().eventController.on(EventTypes.FOCUS_PREV, function() {
            self.userInterfaceObject.focus();
        });
        this.contextAsSubitem.getUserInterfaceObject().eventController.on(EventTypes.GO_TO_END_OF_LIST_vc, function() {
            if (self.textObjectViewController.detailsView.hasContent()) {
                self.textObjectViewController.detailsView.focusLastObject();
            } else {
                self.userInterfaceObject.eventController.triggerEvent(EventTypes.GO_TO_END_OF_LIST_vc, null);
            }
        });
        this.containerForContextAsSubitem.appendChild(this.contextAsSubitem.getUiElement());
    }

    private removeContextAsSubitem() {
        Html.removeAllChildren(this.containerForContextAsSubitem);
        this.contextAsSubitem = null;
        this.onContextAsSubitemIsEmpty();
    }

    public showContextAsSubitem() : boolean {
        return this.hasLogcialContextAndVisualContextIsNotLogicalContext();
    }

    //////////////////////////////////////////

    public getUiElementOfContextIcon() : HTMLElement {
        return this.contextIconElement;
    }

    private updateContextIcon() {
        if (this.hasViewContext()) {
            if (this.visualContextIsLogicalContext()) {
                ContextIcon.setBidirectional(this.contextIconElement);
            } else {
                ContextIcon.setUnidirectional(this.contextIconElement);
            }
        } else {
            // context icon must be empty
        }
    }

    public hasLogcialContextAndVisualContextIsNotLogicalContext() {
        if (!this.hasLogicalContext()) {
            return false;
        } else {
            return !this.visualContextIsLogicalContext();
        }
    }
    
    public hasLogicalContext() : boolean {
        return this.props.get(CONTEXT) != null;
    }
    
    public visualContextIsLogicalContext(): boolean {
        if (this.hasViewContext()) {
            return this.userInterfaceObject.getViewContext().getSemsAddress() == this.getProps().get(CONTEXT);
        } else {
            return false;
        }
    }

    public hasViewContext() : boolean {
        return this.userInterfaceObject.getViewContext() != null;
    }
    
    public toggleLogicalContextEvent() {
        let self = this;
        if (self.hasLogicalContext()) {
            self.getProps().set(CONTEXT, null);
        } else {
            self.getProps().set(CONTEXT, self.userInterfaceObject.getViewContext().getSemsAddress());
        }
    }
    
    private getProps() : RemotePropertiesOfSemsObject {
        return this.props;
    }

    private delete() {
        App.objEvents.removeObserver(this.getSemsAddress(), EventTypes.PROPERTY_CHANGE, this.dataObserver);
    }

    private getSemsAddress() {
        return this.userInterfaceObject.getSemsAddress();
    }
    
    public deleteContextIfDisplayedInContext() {
        if (this.props.get(CONTEXT) != null) {
            if (General.primEquals(this.userInterfaceObject.getViewContext().semsAddress, this.props.get(CONTEXT))) {
                this.props.set(CONTEXT, null);
            }
        }
    }

    public scaleDownOfContextAsSubitemPossible() : boolean {
        if (this.contextAsSubitem != null) {
            return this.contextAsSubitem.scaleDownIsPossible();
        } else {
            return false;
        }
    }

    public scaleDownContextAsSubitem() {
        if (this.contextAsSubitem != null) {
            this.contextAsSubitem.scaleDown();
        }
    }

    public focusContextAsSubitem() {
        this.contextAsSubitem.focus();
    }

    public contextAsSubitem_takeFocusFromBottom() {
        this.contextAsSubitem.takeFocusFromBottom();
    }

    // note: this returns the UIO of the StringRelationshipView!
    public getUioOfContextAsSubitem() {
        return this.contextAsSubitem.getUserInterfaceObject();
    }
}