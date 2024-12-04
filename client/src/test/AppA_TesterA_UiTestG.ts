import type {Entity} from "@/Entity";
import {ContainerA} from "@/ContainerA";
import {assert, assert_sameAs, assertFalse, notNullUndefined, nullUndefined} from "@/utils";

export class AppA_TesterA_UiTestG {

    name : string;
    test : Entity;

    constructor(public entity : Entity) {
        this.name = 'ui';
    }

    addTo(boundParent : Entity) {
        this.test = boundParent.testG_nestedTestsA.add(this.name, ()=>{});
        this.test.installContainerA()
        this.test.testG_installNestedTestsA();
        this.addTests();
    }

    addTests() {
        this.addTest('updateAddedSubitem', async run => {
            let appUi = this.entity.appA.createStarter().createAppWithUI_typed();
            let list = appUi.getApp().unboundG.createList_typed();
            let uiForList = appUi.createUiFor_typed(list.entity);
            await uiForList.update();
            list.addDirect(appUi.getApp().unboundG.createText('subitem'));

            await list.entity.uis_update_addedListItem(0);

            assert_sameAs(1, uiForList.listG.uisOfListItems.length);
            assert(uiForList.htmlElement.innerHTML.includes('subitem'), 'update html');
        });
        this.addTest('updateRemovedSubitem', async run => {
            let appUi = this.entity.appA.createStarter().createAppWithUI_typed();
            let list = appUi.getApp().unboundG.createList_typed();
            list.addDirect(appUi.getApp().unboundG.createText('subitem-one'));
            list.addDirect(appUi.getApp().unboundG.createText('subitem-two'));
            let uiForList = appUi.createUiFor_typed(list.entity);
            await uiForList.update();
            list.jsList.splice(0, 1);

            await list.entity.uis_update_removedListItem(0);

            assert_sameAs(1, uiForList.listG.uisOfListItems.length);
            assert(!uiForList.htmlElement.innerHTML.includes('subitem-one'), 'update html');
            assert(uiForList.htmlElement.innerHTML.includes('subitem-two'), 'update html');
        });
        this.addTest('cut', async run => {
            let appUi = this.entity.appA.createStarter().createAppWithUI_typed();
            run.testRunA.appUi = appUi;
            let appA = appUi.entity.appA;
            let child = await appA.createText('child');
            let parent = await appA.createList();
            await parent.listA.add(child);
            child.context = child.getPath(parent);
            let parentUi = appUi.createUiFor_typed(parent);
            await parentUi.update();
            let childUi = parentUi.listG.uisOfListItems[0].uiA;
            childUi.textG.htmlElement.innerText = 'unsaved text';

            await childUi.cut();

            assert_sameAs(parent.listA.jsList.length, 0);
            assert_sameAs(child.text, 'unsaved text');
            assert_sameAs(child.context, null);
        });
        this.addTest('showContainerMark', async run => {
            let appUi = this.entity.appA.createStarter().createAppWithUI_typed();
            run.testRunA.appUi = appUi;
            let appA = appUi.entity.appA;
            let markedContainer = appA.createEntityWithApp();
            markedContainer.installContainerA();
            markedContainer.installListA();
            appA.entity.containerA.bind(markedContainer,'sa9llaMlry'); // TODO should not be hardcoded
            markedContainer.text = 'marked container';
            appUi.content.listA.addDirect(markedContainer);

            let ui = appUi.createUiFor_typed(markedContainer);

            assert(ui.showContainerMark());
        });
        this.addTest('setContext', async run => {
            let appUi = this.entity.appA.createStarter().createAppWithUI_typed();
            let appA = appUi.entity.appA;
            let subitem = await appA.createText('subitem');
            let parent = await appA.createList();
            parent.installListA();
            await parent.listA.add(subitem);
            let uiParent = appUi.createUiFor_typed(parent);
            await uiParent.update();
            let uiSubitem = uiParent.listG.uisOfListItems[0].uiA;

            uiSubitem.setContext();

            assert(notNullUndefined(subitem.context));
            assert_sameAs(await subitem.context.pathA.resolve(), parent);
        });
        this.addTest('removeContext', async run => {
            let appUi = this.entity.appA.createStarter().createAppWithUI_typed();
            let appA = appUi.entity.appA;
            let subitem = await appA.createText('subitem');
            let parent = await appA.createList();
            parent.installListA();
            await parent.listA.add(subitem);
            subitem.context = subitem.getPath(parent);
            let uiParent = appUi.createUiFor_typed(parent);
            await uiParent.update();
            let uiSubitem = uiParent.listG.uisOfListItems[0].uiA;

            uiSubitem.removeContext();

            assert(nullUndefined(subitem.context));
        });
        this.test.testG_nestedTestsA.addTestWithNestedTests('newSubitem', async run => {
            let appUi = this.entity.appA.createStarter().createAppWithUI_typed();
            let appA = appUi.entity.appA;
            await appUi.entity.uiA.update();
            await appUi.globalEventG.newSubitem();

            await appUi.globalEventG.newSubitem();

            let firstObj = await appUi.content.listA.getResolved(0);
            let created = await firstObj.listA.getResolved(0);
            assert(notNullUndefined(created));
            assert_sameAs((await created.context.pathA.resolve()), firstObj);
            let createdUi = appUi.content.uiA.listG.uisOfListItems[0].uiA.listG.uisOfListItems[0];
            assert_sameAs(appUi.focused, createdUi);
        }, newSubitem => {
            newSubitem.add('onApp', async run => {
                let appUi = this.entity.appA.createStarter().createAppWithUI_typed();
                await appUi.entity.uiA.update();

                await appUi.globalEventG.newSubitem();

                let created = await appUi.content.listA.getResolved(0);
                assert(notNullUndefined(created));
                assert(nullUndefined(created.context));
                let createdUi = appUi.content.uiA.listG.uisOfListItems[0];
                assert_sameAs(appUi.focused, createdUi);
            });
        });
        this.test.testG_nestedTestsA.addTestWithNestedTests('defaultAction', async run => {
            let appUi = this.entity.appA.createStarter().createAppWithUI_typed();
            let appA = appUi.entity.appA;
            await appUi.entity.uiA.update();
            await appUi.globalEventG.newSubitem();
            await appUi.globalEventG.newSubitem();

            await appUi.globalEventG.defaultAction();

            let firstObj = await appUi.content.listA.getResolved(0);
            let created = await firstObj.listA.getResolved(1);
            assert(notNullUndefined(created));
            assert_sameAs((await created.context.pathA.resolve()), firstObj);
            let createdUi = appUi.content.uiA.listG.uisOfListItems[0].uiA.listG.uisOfListItems[1];
            assert_sameAs(appUi.focused, createdUi);
        }, defaultActionTest => {
            defaultActionTest.add('withAppAsParent', async run => {
                let appUi = this.entity.appA.createStarter().createAppWithUI_typed();
                await appUi.entity.uiA.update();
                await appUi.globalEventG.newSubitem();

                await appUi.globalEventG.defaultAction();

                let created = await appUi.content.listA.getResolved(1);
                assert(notNullUndefined(created));
                assert(nullUndefined(created.context));
                let createdUi = appUi.content.uiA.listG.uisOfListItems[1];
                assert_sameAs(appUi.focused, createdUi);
            });
        });
        this.test.testG_nestedTestsA.addNestedTests('tester', (tester) => {
            tester.addTestWithNestedTests('run', async outerRun => {
                let appUi = this.entity.appA.createStarter().createAppWithUI_typed();
                let appA = appUi.entity.appA;
                let test = appA.entity.createCode('dummyTest', ()=>{});
                let run = await test.testG_run();
                let ui = appUi.createUiFor_typed(run);
                await ui.update();

                assert(ui.collapsed);
            }, (runTest) => {
                runTest.add('failingNestedTest', async outerRun => {
                    let appUi = this.entity.appA.createStarter().createAppWithUI_typed();
                    let appA = appUi.entity.appA;
                    let test = appA.entity.createCode('dummyTest', ()=>{});
                    test.testG_installNestedTestsA();
                    test.testG_nestedTestsA.add('failingNestedTest', () => {
                        assert(false);
                    });
                    let run = await test.testG_run();
                    let ui = appUi.createUiFor_typed(run);
                    await ui.update();

                    assertFalse(ui.collapsed);
                });
            });
        });
    }

    addTest(name : string, jsFunction: (testRun: Entity) => void) {
        this.test.testG_nestedTestsA.add(name, jsFunction);
    }
}