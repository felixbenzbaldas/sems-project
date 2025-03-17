import type {Entity} from "@/Entity";
import type {UiA} from "@/ui/UiA";

export class UiA_ParameterizedActionA {
    bodyContentUi: UiA;
    constructor(public entity : Entity) {
    }

    async bodyContentG_update() {
        let bodyContent = this.entity.getApp().unboundG.createList();
        bodyContent.listA.addDirect(this.entity.getApp().unboundG.createText('bodyContentUi'));
        let parameters = await this.entity.getApp().createList();
        await parameters.set('name', await this.entity.getApp().createText(''));
        bodyContent.listA.addDirect(parameters);
        // TODO
        this.bodyContentUi = await this.entity.uiA.createSubUiFor(bodyContent);
    }
}