import type {Entity} from "@/Entity";
import type {ContainerA} from "@/ContainerA";

export class TestG_NestedTestsA {

    nestedTests : Entity;

    constructor(public entity : Entity) {
    }

    install() {
        this.nestedTests = this.entity.getApp().appA.unboundG.createList();
    }

    add(name: string, jsFunction: (testRun: Entity) => void) : Entity {
        let nestedTest : Entity = this.entity.createCode(name, jsFunction);
        this.nestedTests.listA.addDirect(nestedTest);
        return nestedTest;
    }

    addTestWithNestedTests(name: string, jsFunction : (testRun: Entity) => void, creator : ((nestedTestsA : TestG_NestedTestsA) => void)) {
        let test = this.add(name, jsFunction);
        test.testG_installNestedTestsA();
        test.installContainerA();
        creator(test.testG_nestedTestsA);
    }

    addNestedTests(name: string, creator : ((nestedTestsA : TestG_NestedTestsA) => void)) {
        this.addTestWithNestedTests(name, ()=>{}, creator);
    }
}