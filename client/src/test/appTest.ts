import type {Entity} from "@/Entity";
import {assert} from "@/utils";

export const appTest = (app : Entity) => {
    let test = app.createFormalText('appTest', (run : Entity) => {
    });
    test.testG_installNestedTestsA();
    test.testG_nestedTestsA.add('failingDummyTest', (run : Entity) => {
        run.testRunA.appUi = app.appA.createStarter().createAppWithUIWithCommands_editable().appA.uiA;
        assert(false);
    });
    return test;
}