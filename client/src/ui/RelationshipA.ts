import type {Entity} from "@/Entity";
import type {UiA} from "@/ui/UiA";

export class UiA_RelationshipA {
    bodyContentUi : UiA;
    constructor(public entity : Entity) {
    }

    async update() {
        this.bodyContentUi = await this.entity.uiA.createSubUiFor_transmitEditability(this.entity.uiA.getObject().relationshipA.to);
    }
}