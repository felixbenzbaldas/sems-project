import type {Entity} from "@/Entity";

export class TestA_NestedTestsA {

    constructor(private entity : Entity) {
    }

    install() {
        if (!this.entity.listA) {
            this.entity.installListA();
        }
    }

    async add(name: string, jsFunction: (testRun: Entity) => void) : Promise<Entity> {
        let nestedTest : Entity = this.entity.getApp().createFormalText(name, jsFunction);
        await this.entity.listA.add(nestedTest);
        return nestedTest;
    }
}