import type {Entity} from "@/Entity";

export class AppA_TestA {

    constructor(private entity : Entity) {
        this.createResults();
    }

    createResults() {
        this.entity.appA.ui.content.list.add(this.entity.appA.simple_createText(
            '[OK] The tester can show this text.'));
    }
}