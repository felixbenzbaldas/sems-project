import {Entity} from "@/Entity";

export class AppA_TesterA {

    test: Entity;

    constructor(public entity : Entity) {
    }

    async run() {
        let run = await this.test.testG_run();
        await this.entity.appA.uiA.content.listA.add(run);
    }

}