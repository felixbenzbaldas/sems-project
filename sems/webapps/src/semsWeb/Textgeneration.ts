import { App } from "../App";
import { TEXT } from "../Consts";
import { DetailsData } from "../data/DetailsData";
import { RemotePropertiesOfSemsObject } from "../data/RemotePropertiesOfSemsObject";
import { UserInterfaceObject } from "../view/UserInterfaceObject";

export class Textgeneration {
    public static generateEmail(uio : UserInterfaceObject) {
        let html : HTMLElement = document.createElement("div");
        let props : RemotePropertiesOfSemsObject = App.objProperties.getPropertiesOfObject(uio.semsAddress);
        let detailsData : DetailsData = DetailsData.map.get(uio.semsAddress);
        html.appendChild(Textgeneration.getParagraph("Hello " + props.get(TEXT) + ","));
        html.appendChild(Textgeneration.getParagraph("you have new sems objects!"));
        let anchorElement : HTMLAnchorElement = document.createElement("a");
        anchorElement.innerText = "Click here!";
        anchorElement.href = "http://sems-web.de/?" + detailsData.getDetails()[0];
        let paragraph : HTMLParagraphElement = document.createElement("p");
        paragraph.appendChild(anchorElement);
        html.appendChild(paragraph);
        html.appendChild(Textgeneration.getParagraph("Regards"));
        html.appendChild(Textgeneration.getParagraph("Max"));
        alert(html.innerHTML);
    }

    public static getParagraph(text : string) : HTMLParagraphElement {
        let paragraph : HTMLParagraphElement = document.createElement("p");
        paragraph.innerText = text;
        return paragraph;
    }
}