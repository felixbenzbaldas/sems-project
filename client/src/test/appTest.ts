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
    test.testG_nestedTestsA.add('semiKeyboardEvent', async run => {
        let appA = app.appA.createStarter().createAppWithUI().appA;
        run.testRunA.appUi = appA.uiA;
        await appA.uiA.content.listA.add(
            appA.unboundG.createButton('activate test-app', () => {}),
        );
        appA.logG.toListOfStrings = true;
        appA.logG.toConsole = true;
        appA.entity.log('human-action: click \'activate test-app\'');
        appA.entity.log('human-test: when pressing keys, the according key events are logged.');
    });
    return test;
}