import { App } from "../App";
import { TEXT } from "../Consts";
import { DetailsData } from "../data/DetailsData";
import { RemotePropertiesOfSemsObject } from "../data/RemotePropertiesOfSemsObject";
import { AnimatedExpandAndCollapse } from "../general/AnimatedExpandAndCollapse";
import { FixRenderBug } from "../general/FixRenderBug";
import { General } from "../general/General";
import { Html } from "../general/Html";
import { SemsServer } from "../SemsServer";
import { HeadTextUtil } from "./HeadTextUtil";
import { UserInterfaceObject } from "./UserInterfaceObject";
import { View } from "./View";

export class HypertextElementView {

    private animatedExpandAndCollapse: AnimatedExpandAndCollapse;
    private linkElem: HTMLAnchorElement;

    private details: Array<UserInterfaceObject> = [];
    private semsAddress: string;
    
    public userInterfaceObject : UserInterfaceObject = new UserInterfaceObject();

    constructor(semsAddress: string) {
        this.semsAddress = semsAddress;
        this.userInterfaceObject.semsAddress = semsAddress;
        this.animatedExpandAndCollapse = new AnimatedExpandAndCollapse();
        this.animatedExpandAndCollapse.basisAnimationTime = 0.11;
        //
        this.linkElem = General.createAndAdaptLinkElement();
        this.linkElem.href = SemsServer.getAddressForObject(semsAddress);

        let props : RemotePropertiesOfSemsObject = App.objProperties.getPropertiesOfObject(semsAddress);
        this.linkElem.innerText = props.get(TEXT);
        FixRenderBug.setStyleForTextWithUnderline(this.linkElem);
        //
        this.enableDefaultClick();
        View.setDefaultBodyStyle(this.animatedExpandAndCollapse.getInnerDiv());
        HeadTextUtil.setStyle(this.linkElem);
    }

    public getUiElement() {
        return this.linkElem;
    }

    private clearBody() {
        Html.removeAllChildren(this.animatedExpandAndCollapse.getInnerDiv());
    }

    private enableDefaultClick() {
        let self = this;
        this.linkElem.onclick = function (ev) {
            if (ev.ctrlKey) {
                // default action (open link in new tab)
            } else {
                ev.preventDefault();
                if (self.animatedExpandAndCollapse.isCollapsed()) {
                    HeadTextUtil.mark_expanded(self.linkElem);
                    self.requestCreateAndAnimateBody();
                } else {
                    self.animatedExpandAndCollapse.collapse(function () {
                        HeadTextUtil.mark_collapsed_strongRels(self.linkElem);
                        self.clearBody();
                        self.details = [];
                        Html.remove(self.animatedExpandAndCollapse.getOuterDiv());
                    });
                }
            }
        };
        HeadTextUtil.mark_collapsed_strongRels(this.linkElem);
    }

    private requestCreateAndAnimateBody() {
        let self = this;
        Html.insertAfter(this.linkElem, this.animatedExpandAndCollapse.getOuterDiv());
        let detailsData : DetailsData = DetailsData.map.get(this.semsAddress);
        detailsData.ensureDetailsAreLoaded(function() {    
            self.createDetails();
            self.animatedExpandAndCollapse.expand(function () { });
        });
    }

    private createDetails() {
        let detailsData : DetailsData = DetailsData.map.get(this.semsAddress);
        for (let i = 0; i < detailsData.getDetails().length; i++) {
            let detailSemsAddress : string = detailsData.getDetails()[i];
            let detailUserInterfaceObject = View.createFromSemsAddress(detailSemsAddress, this.userInterfaceObject);
            this.animatedExpandAndCollapse.getInnerDiv().appendChild(detailUserInterfaceObject.uiElement);
            this.details.push(detailUserInterfaceObject);
        }
    }
}