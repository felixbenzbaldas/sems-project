import type {Entity} from "@/Entity";
import type {ContainerA} from "@/ContainerA";
import type {TestRunA} from "@/test/TestRunA";

export class TestG_NestedTestsA {

    nestedTests : Entity;

    constructor(public entity : Entity) {
    }

    install() {
        this.nestedTests = this.entity.getApp().appA.unboundG.createList();
    }

    add(name: string, jsFunction: (run: TestRunA) => void) : Entity {
        let nestedTest : Entity = this.entity.createCode(name, jsFunction);
        this.nestedTests.listA.addDirect(nestedTest);
        return nestedTest;
    }

    addTestWithNestedTests(name: string, jsFunction : (run: TestRunA) => void, creator : ((nestedTestsA : TestG_NestedTestsA) => void)) {
        let test = this.add(name, jsFunction);
        test.testG_installNestedTestsA();
        test.installContainerA();
        creator(test.testG_nestedTestsA);
    }

    addNestedTests(name: string, creator : ((nestedTestsA : TestG_NestedTestsA) => void)) {
        this.addTestWithNestedTests(name, ()=>{}, creator);
    }
}