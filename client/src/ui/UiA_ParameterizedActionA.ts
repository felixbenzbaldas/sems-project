import type {Entity} from "@/Entity";
import type {UiA} from "@/ui/UiA";

export class UiA_ParameterizedActionA {
    bodyContentUi: UiA;
    constructor(public entity : Entity) {
    }

    async bodyContentG_update() {
        let bodyContent = this.entity.getApp().unboundG.createList();
        bodyContent.listA.addDirect(this.entity.getApp().unboundG.createText('bodyContentUi'));
        this.bodyContentUi = await this.entity.uiA.createSubUiFor(bodyContent);
    }
}