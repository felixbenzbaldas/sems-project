import type {Entity} from "@/Entity";
import {assert} from "@/utils";

export const appTest = (app : Entity) => {
    let test = app.createFormalText('appTest', (run : Entity) => {
    });
    test.testG_installNestedTestsA();
    test.testG_nestedTestsA.add('failingDummyTest', async (run : Entity) => {
        run.testRunA.appUi = app.appA.createStarter().createAppWithUIWithCommands_editable().appA.uiA;
        assert(false);
    });
    test.testG_nestedTestsA.add('semiKeyboardEvent', async run => {
        let appA = app.appA.createStarter().createAppWithUI().appA;
        appA.testMode = true;
        run.testRunA.appUi = appA.uiA;
        await appA.uiA.content.listA.add(
            appA.unboundG.createButton('activate test-app', () => {}),
            appA.unboundG.createButton('switch off testMode', () => {
                appA.testMode = false;
            })
        );
        appA.logG.toListOfStrings = true;
        appA.logG.toConsole = true;
        appA.entity.log('human-action: click \'activate test-app\'');
        appA.entity.log('human-test: when pressing keys, the according key events are logged.');
        appA.entity.log('human-action: click \'switch off testMode\'');
        appA.entity.log('human-test: now the keys are not logged.');
    });
    return test;
}