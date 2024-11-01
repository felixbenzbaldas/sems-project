import type {Entity} from "@/Entity";
import {assert, assert_sameAs} from "@/utils";

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
    test.testG_nestedTestsA.add('updateAddedSubitem', async run => {
        let appUi = app.appA.createStarter().createAppWithUI_typed();
        let list = appUi.entity.appA.unboundG.createList();
        let uiForList = appUi.createUiFor(list);
        await uiForList.uiA.update();
        list.listA.jsList.push(appUi.entity.appA.unboundG.createText('subitem'));

        await list.uis_update_addedListItem(0);

        assert_sameAs(1, uiForList.uiA.listG.uisOfListItems.length);
    });
    return test;
}