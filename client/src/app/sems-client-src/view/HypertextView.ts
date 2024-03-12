import { App } from "../App";
import { TEXT } from "../Consts";
import { DetailsData } from "../data/DetailsData";
import { RemotePropertiesOfSemsObject } from "../data/RemotePropertiesOfSemsObject";
import { General } from "../general/General";
import { SemsServer } from "../SemsServer";
import { ContextIcon } from "./ContextIcon";
import { HypertextElementView } from "./HypertextElementView";
import { UserInterfaceObject } from "./UserInterfaceObject";
import { View } from "./View";


export class HypertextView {

    private headDiv: HTMLDivElement;
    private contextIcon: HTMLElement;

    public userInterfaceObject : UserInterfaceObject = new UserInterfaceObject();

    public static install(semsAddress : string) : UserInterfaceObject {
        let hypertextView : HypertextView = new HypertextView(semsAddress);
        return hypertextView.userInterfaceObject;
    }

    constructor(semsAddress : string) {
        this.headDiv = document.createElement("div");
        this.headDiv.style.maxWidth = "50rem";
        this.contextIcon = ContextIcon.createContextIconElement();
        ContextIcon.setBidirectional(this.contextIcon);
        this.headDiv.appendChild(this.contextIcon);
        //
        let detailsData : DetailsData = DetailsData.map.get(semsAddress);
        for (let i = 0; i < detailsData.getDetails().length; i++) {
            let detailSemsAddress : string = detailsData.getDetails()[i];
            let detailDetailsData : DetailsData = DetailsData.map.get(detailSemsAddress);
            let detailProps : RemotePropertiesOfSemsObject = App.objProperties.getPropertiesOfObject(detailSemsAddress);
            if (detailDetailsData.hasDetails()) {
                let hypertextElementView : HypertextElementView = new HypertextElementView(detailSemsAddress);
                this.headDiv.appendChild(hypertextElementView.getUiElement());
            } else {
                let anchor = General.createAndAdaptLinkElement();
                anchor.innerText = detailProps.get(TEXT);
                anchor.href = SemsServer.getAddressForObject(semsAddress);
                this.headDiv.appendChild(anchor);
            }
        }
        this.userInterfaceObject.uiElement = View.createDivWithDefaultMargin();
        this.userInterfaceObject.uiElement.appendChild(this.headDiv);
    }
}