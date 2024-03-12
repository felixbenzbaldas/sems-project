import { App } from "../App";
import { TEXT } from "../Consts";
import { DetailsData } from "../data/DetailsData";
import { RemotePropertiesOfSemsObject } from "../data/RemotePropertiesOfSemsObject";
import { UserInterfaceObject } from "./UserInterfaceObject";
import { View } from "./View";
import { ViewTypes } from "./ViewTypes";

export class ImageView {

    public imgElement : HTMLImageElement;
    public fitWidthOnClick : boolean = true;

    public static installImage(semsAddress : string) : UserInterfaceObject {
        let userInterfaceObject : UserInterfaceObject = new UserInterfaceObject();
        userInterfaceObject.viewType = ViewTypes.IMG;
        userInterfaceObject.semsAddress = semsAddress;
        let imageView = new ImageView();
        userInterfaceObject.uiElement = View.createDivWithDefaultMargin();
        imageView.imgElement = document.createElement("img");
        userInterfaceObject.uiElement.appendChild(imageView.imgElement);
        userInterfaceObject.uiElement.style.maxWidth = "50rem";
        userInterfaceObject.uiElement.style.padding = "0.3rem";
        let detailsData : DetailsData = DetailsData.map.get(semsAddress);
        let detailProps : RemotePropertiesOfSemsObject = App.objProperties.getPropertiesOfObject(detailsData.getDetails()[0]);
        imageView.imgElement.src = App.getResourcesPath() + detailProps.get(TEXT);
        const defaultHeight = "17rem";
        imageView.imgElement.style.height = defaultHeight;
        //
        imageView.imgElement.style.cursor = "pointer";
        imageView.imgElement.onclick = function() {
            if (imageView.fitWidthOnClick) {
                imageView.imgElement.style.height = "auto";
                imageView.imgElement.style.maxWidth = "100%";
                imageView.fitWidthOnClick = false;
            } else {
                imageView.imgElement.style.height = defaultHeight;
                imageView.imgElement.style.maxWidth = "100rem";
                imageView.fitWidthOnClick = true;
            }
        }
        return userInterfaceObject;
    }
}