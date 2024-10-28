import type {Entity} from "@/Entity";
import {assert} from "@/utils";

export const appTest = (app : Entity) => {
    let test = app.createFormalText('appTest', (run : Entity) => {
    });
    test.testG_installNestedTestsA();
    test.testG_nestedTestsA.nestedTests.listA.jsList.push(app.createFormalText('failing dummy test', (run : Entity) => {
        assert(false);
    }));
    return test;
}