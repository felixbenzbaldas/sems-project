import type {Entity} from "@/Entity";
import type {UiA} from "@/ui/UiA";
import {div, textElem} from "@/utils";

export class UiA_RelationshipA {
    headerContentG_htmlElementG = div();
    bodyContentUi : UiA;
    constructor(public entity : Entity) {
    }

    async update() {
        this.bodyContentUi = await this.entity.uiA.createSubUiFor_transmitEditability(this.entity.uiA.getObject().relationshipA.to);
    }

    async headerContentG_update() {
        this.headerContentG_htmlElementG.style.display = 'flex';
        this.headerContentG_htmlElementG.appendChild(textElem('['));
        this.headerContentG_htmlElementG.appendChild(this.entity.uiA.textG.htmlElement);
        let bracketRight = textElem(']');
        bracketRight.style.marginLeft = '0.2rem';
        this.headerContentG_htmlElementG.appendChild(bracketRight);
    }

}