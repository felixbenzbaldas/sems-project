import { App } from "../App";
import { DEFAULT_EXPANDED, TEXT } from "../Consts";
import { RemotePropertiesOfSemsObject } from "../data/RemotePropertiesOfSemsObject";
import { AnimatedHeadBody } from "../general/AnimatedHeadBody";
import { General } from "../general/General";
import { Column } from "./Column";
import { HypertextView } from "./HypertextView";
import { ImageView } from "./ImageView";
import { LinkView } from "./LinkView";
import { TextObjectViewController } from "./TextObjectViewController";
import { UserInterfaceObject } from "./UserInterfaceObject";
import { ViewTypes } from "./ViewTypes";

export class View {
    static DEFAULT_MARGIN_TOP = "0.05rem";
    static DEFAULT_MARGIN_BOTTOM = "0.05rem";
    static DEFAULT_MARGIN_LEFT = "0.35rem";
    static DEFAULT_PADDING_LEFT = "0.6rem";
    static DEFAULT_PADDING_BOTTOM = "0rem";
    static DEFAULT_PADDING_TOP = "0rem";
    static DEFAULT_BORDER_WIDTH = "0.1rem";
    static MAX_WIDTH_FOR_TEXT = "50rem";

    static placeholderDiv_Factor = 0.9;

    // pre-condition: object is loaded
    public static createFromSemsAddress(semsAddress : string, viewContext : UserInterfaceObject) : UserInterfaceObject {
        let props : RemotePropertiesOfSemsObject = App.objProperties.getPropertiesOfObject(semsAddress);
        let text : string = props.get(TEXT);
        if (App.LOCAL_MODE) {
            if (text.startsWith("#img")) {
                return ImageView.installImage(semsAddress);
            }
        } else {
            if (text.startsWith("[Error: object does not exist or access denied.]")) {
                let userInterfaceObject : UserInterfaceObject = new UserInterfaceObject();
                userInterfaceObject.uiElement = document.createElement("div");
                return userInterfaceObject;
            } else if (text.startsWith("#img")) {
                return ImageView.installImage(semsAddress);
            } else if (text.startsWith("#link")) {
                return LinkView.install(semsAddress);
            } else if (text.startsWith("#htext")) {
                return HypertextView.install(semsAddress);
            }
        }
        return TextObjectViewController.installTextObjectViewController(semsAddress, viewContext);
    }

    static createDivWithDefaultMargin_innerHtml(innerHtml) {
        let div = View.createDivWithDefaultMargin();
        div.innerHTML = innerHtml;
        return div;
    }

    static createDivWithDefaultMargin() {
        let div = document.createElement("div");
        View.setDefaultMargin(div);
        return div;
    }
    
    static setDefaultMargin(htmlElement) {
        htmlElement.style.marginTop = View.DEFAULT_MARGIN_TOP;
        htmlElement.style.marginBottom = View.DEFAULT_MARGIN_BOTTOM;
        htmlElement.style.marginLeft = View.DEFAULT_MARGIN_LEFT;
        htmlElement.style.marginRight = "0rem";
    }

    static setDefaultBodyStyle(htmlElement : HTMLElement) {
        htmlElement.style.paddingLeft = View.DEFAULT_PADDING_LEFT;
        htmlElement.style.paddingBottom = View.DEFAULT_PADDING_BOTTOM;
        htmlElement.style.paddingTop = View.DEFAULT_PADDING_TOP;
        htmlElement.style.paddingRight = "0rem";
        //
        htmlElement.style.borderLeft = "solid";
        htmlElement.style.borderColor = App.fontColor;
        htmlElement.style.borderLeftWidth = View.DEFAULT_BORDER_WIDTH;
    }

    
    public static createStyledAnimatedHeadBody() {
        let hb = AnimatedHeadBody.create();
        View.setDefaultMargin(hb.getUiElement());
        View.setDefaultBodyStyle(hb.getBody());
        return hb;
    }

    // avoid endless recursion
    public static hasSuperiorInDefaultExpandedChain(userInterfaceObject : UserInterfaceObject, address : string) : boolean {
        if (userInterfaceObject.semsAddress == null) {
            return false;
        } else {
            if (App.objProperties.get(userInterfaceObject.getSemsAddress(), DEFAULT_EXPANDED)) {
                if (userInterfaceObject.viewContext == null) {
                    return false;
                } else {
                    if (General.primEquals(address, userInterfaceObject.viewContext.getSemsAddress())) {
                        return true;
                    } else {
                        return View.hasSuperiorInDefaultExpandedChain(userInterfaceObject.viewContext, address);
                    }
                }
            }
        }
    }

    public static getNextUioOnSameLevel_skippingParents(uio : UserInterfaceObject) {
        let parentTovc : TextObjectViewController = uio.viewContext.tovcOpt;
        let position = parentTovc.detailsView.getPositionOfDetailUIO(uio);
        if (position + 1 < parentTovc.detailsView.getNumberOfDetails()) {
            return parentTovc.detailsView.getUioAtPosition(position + 1);
        } else {
            let nextParentTovc : TextObjectViewController =
                View.getNextUioOnSameLevel_skippingParents(uio.viewContext).tovcOpt;
            if (!nextParentTovc.isCollapsed()) {
                return nextParentTovc.detailsView.getUioAtPosition(0);
            } else {
                return null;
            }
        }
    }

}