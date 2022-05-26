import { App } from "../App";
import { TEXT } from "../Consts";
import { DetailsData } from "../data/DetailsData";
import { RemotePropertiesOfSemsObject } from "../data/RemotePropertiesOfSemsObject";
import { UserInterfaceObject } from "./UserInterfaceObject";
import { View } from "./View";

export class LinkView {

    public static install(semsAddress) : UserInterfaceObject {
        let userInterfaceObject : UserInterfaceObject = new UserInterfaceObject();
        userInterfaceObject.uiElement = View.createDivWithDefaultMargin();
        let linkElement = document.createElement("a");
        linkElement.style.fontFamily = App.fontFamily;
        userInterfaceObject.uiElement.appendChild(linkElement);
        let detailsData : DetailsData = DetailsData.map.get(semsAddress);
        linkElement.href = LinkView.getTextOfDetailAtPosition(0, semsAddress);
        //
        if (detailsData.getDetails().length > 1) {
            linkElement.innerText = LinkView.getTextOfDetailAtPosition(1, semsAddress);
        } else {
            linkElement.innerText = LinkView.getTextOfDetailAtPosition(0, semsAddress);
        }
        return userInterfaceObject;
    }

    private static getTextOfDetailAtPosition(position : number, semsAddress) {
        let detailsData : DetailsData = DetailsData.map.get(semsAddress);
        let detailProps : RemotePropertiesOfSemsObject = App.objProperties.getPropertiesOfObject(detailsData.getDetails()[position]);
        return detailProps.get(TEXT);
    }
}