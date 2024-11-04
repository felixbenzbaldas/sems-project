import type {Entity} from "@/Entity";
import {assert, assert_sameAs} from "@/utils";

export const appTest = (tester : Entity) => {
    let test = tester.createCode('appTest', (run : Entity) => {
    });
    test.testG_installNestedTestsA();
    if (tester.appA.environment.queryParams.has('withFailingDemoTest')) {
        test.testG_nestedTestsA.add('failingDemoTest', async (run : Entity) => {
            run.testRunA.appUi = tester.appA.createStarter().createAppWithUIWithCommands_editable().appA.uiA;
            assert(false);
        });
    }
    test.testG_nestedTestsA.add('semiKeyboardEvent', async run => {
        let appA = tester.appA.createStarter().createAppWithUI().appA;
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
        let appUi = tester.appA.createStarter().createAppWithUI_typed();
        let list = appUi.getApp().unboundG.createList_typed();
        let uiForList = appUi.createUiFor_typed(list.entity);
        await uiForList.update();
        list.jsList.push(appUi.getApp().unboundG.createText('subitem'));

        await list.entity.uis_update_addedListItem(0);

        assert_sameAs(1, uiForList.listG.uisOfListItems.length);
        assert(uiForList.htmlElement.innerHTML.includes('subitem'), 'update html');
    });
    test.testG_nestedTestsA.add('paste', async run => {
        let appUi = await tester.appA.createStarter().createAppWithUI_typed();
        await appUi.getApp().uiA.update(); // TODO should not be necessary
        await appUi.globalEventG.defaultAction();
        let uiForParent : Entity = appUi.content.uiA.listG.uisOfListItems[0];
        let toPaste = appUi.getApp().unboundG.createText('toPaste');
        appUi.clipboard = toPaste;

        await appUi.globalEventG.paste();

        return uiForParent.getObject().listA.jsList.at(1) === toPaste &&
            uiForParent.uiA.listG.uisOfListItems.at(1).uiA.object === toPaste &&
            appUi.focused.uiA.object === toPaste;
    });
    return test;
}