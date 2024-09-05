import type {Entity} from "@/Entity";

export class AppA_TestA {

    constructor(private entity : Entity) {
        this.createSpecifications();
    }

    createSpecifications() {
        this.entity.appA.ui.content.list.add(this.entity.appA.simple_createText(
            'Specification: This specification appears, when visiting test page.'));
    }
}