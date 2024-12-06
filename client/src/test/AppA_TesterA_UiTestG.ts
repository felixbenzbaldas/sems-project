import type {Entity} from "@/Entity";
import {ContainerA} from "@/ContainerA";
import {assert, assert_sameAs, assertFalse, notNullUndefined, nullUndefined} from "@/utils";
import type {TestG_NestedTestsA} from "@/test/TestG_NestedTestsA";

export class AppA_TesterA_UiTestG {

    name : string;
    tests : TestG_NestedTestsA;

    constructor(public entity : Entity) {
        this.name = 'ui';
    }

    addTo(boundParent : Entity) {
        let test = boundParent.testG_nestedTestsA.add_withoutApp(this.name, ()=>{});
        test.installContainerA()
        test.testG_installNestedTestsA();
        this.tests = test.testG_nestedTestsA;
        this.addTests();
    }

    addTests() {
        this.tests.addUiTest('updateAddedSubitem', async run => {
            let list = run.appUi.getApp().unboundG.createList_typed();
            let uiForList = run.appUi.createUiFor_typed(list.entity);
            await uiForList.update();
            list.addDirect(run.appUi.getApp().unboundG.createText('subitem'));

            await list.entity.uis_update_addedListItem(0);

            assert_sameAs(1, uiForList.listG.uisOfListItems.length);
            assert(uiForList.htmlElement.innerHTML.includes('subitem'), 'update html');
        });
        this.tests.addUiTest('updateRemovedSubitem', async run => {
            let list = run.appUi.getApp().unboundG.createList_typed();
            list.addDirect(run.appUi.getApp().unboundG.createText('subitem-one'));
            list.addDirect(run.appUi.getApp().unboundG.createText('subitem-two'));
            let uiForList = run.appUi.createUiFor_typed(list.entity);
            await uiForList.update();
            list.jsList.splice(0, 1);

            await list.entity.uis_update_removedListItem(0);

            assert_sameAs(1, uiForList.listG.uisOfListItems.length);
            assert(!uiForList.htmlElement.innerHTML.includes('subitem-one'), 'update html');
            assert(uiForList.htmlElement.innerHTML.includes('subitem-two'), 'update html');
        });
        this.tests.addUiTestWithNestedTests('cut', async run => {
            let child = await run.app.createText('child');
            let parent = await run.app.createTextWithList('parent', child);
            child.context = child.getPath(parent);
            let parentUi = run.appUi.createUiFor_typed(parent);
            await parentUi.update();
            let childUi = parentUi.listG.uisOfListItems[0].uiA;
            childUi.textG.htmlElement.innerText = 'unsaved text';

            await childUi.cut();

            assert_sameAs(run.appUi.clipboard, child);
            assert_sameAs(parent.listA.jsList.length, 0);
            assert_sameAs(child.text, 'unsaved text');
            assert_sameAs(child.context, null);
            assert(run.appUi.clipboard_lostContext);
        }, cutTest => {
            cutTest.addUiTest('withoutContext', async run => {
                let child = await run.app.createText('child');
                let parent = await run.app.createTextWithList('parent', child);
                let parentUi = run.appUi.createUiFor_typed(parent);
                await parentUi.update();
                let childUi = parentUi.listG.uisOfListItems[0].uiA;

                await childUi.cut();

                assertFalse(run.appUi.clipboard_lostContext);
            });
            cutTest.addUiTest('outOfContext', async run => {
                let child = await run.app.createText('child');
                child.context = child.getPath(await run.app.createText('dummyContext'));
                let parent = await run.app.createTextWithList('parent', child);
                let parentUi = run.appUi.createUiFor_typed(parent);
                await parentUi.update();
                let childUi = parentUi.listG.uisOfListItems[0].uiA;

                await childUi.cut();

                assertFalse(run.appUi.clipboard_lostContext);
            });
        });
        this.tests.addUiTest('showContainerMark', async run => {
            let markedContainer = run.app.createEntityWithApp();
            markedContainer.installContainerA();
            markedContainer.installListA();
            run.app.entity.containerA.bind(markedContainer,'sa9llaMlry'); // TODO should not be hardcoded
            markedContainer.text = 'marked container';
            run.appUi.content.listA.addDirect(markedContainer);

            let ui = run.appUi.createUiFor_typed(markedContainer);

            assert(ui.showContainerMark());
        });
        this.tests.addUiTestWithNestedTests('toggleCollapsible', async run => {
            let parent = await run.app.createText('parent');
            parent.installListA();
            let subitem = await run.app.createText('subitem');
            await parent.listA.add(subitem);
            let uiParent = run.appUi.createUiFor_typed(parent);
            await uiParent.update();

            await uiParent.toggleCollapsible();

            assert(uiParent.getObject().collapsible);
            assert_sameAs(uiParent.headerG.bodyIcon.innerText, '_');
        }, collapsibleTest => {
            collapsibleTest.addUiTest('makeNonCollapsible', async run => {
                let parent = await run.app.createText('parent');
                parent.collapsible = true; // <-- important
                parent.installListA();
                let subitem = await run.app.createText('subitem');
                await parent.listA.add(subitem);
                let uiParent = run.appUi.createUiFor_typed(parent);
                await uiParent.update();

                await uiParent.toggleCollapsible();

                assert(uiParent.headerBodyG.bodyIsVisible());
            });
        });
        this.tests.addUiTest('setContext', async run => {
            let subitem = await run.app.createText('subitem');
            let parent = await run.app.createText('parent');
            parent.installListA();
            await parent.listA.add(subitem);
            let uiParent = run.appUi.createUiFor_typed(parent);
            await uiParent.update();
            let uiSubitem = uiParent.listG.uisOfListItems[0].uiA;
            let secondUiSubitem = run.appUi.createUiFor_typed(subitem);
            await secondUiSubitem.update();

            await uiSubitem.toggleContext();

            assert(notNullUndefined(subitem.context));
            assert_sameAs(await subitem.context.pathA.resolve(), parent);
            assert_sameAs(uiSubitem.headerG.contextIcon.innerText, '-');
            assert(secondUiSubitem.headerBodyG.bodyIsVisible());
        });
        this.tests.addUiTestWithNestedTests('removeContext', async run => {
            let subitem = await run.app.createText('subitem');
            let parent = await run.app.createText('parent');
            parent.installListA();
            await parent.listA.add(subitem);
            subitem.context = subitem.getPath(parent);
            let uiParent = run.appUi.createUiFor_typed(parent);
            await uiParent.update();
            let uiSubitem = uiParent.listG.uisOfListItems[0].uiA;

            await uiSubitem.toggleContext();

            assert(nullUndefined(subitem.context));
            assert_sameAs(uiParent.listG.uisOfListItems[0].uiA.headerG.contextIcon.innerText, '');
        }, removeContextTest => {
            removeContextTest.addUiTestWithNestedTests('whenOutOfContext', async run => {
                let subject = await run.app.createText('subject');
                let oldContext = await run.app.createText('oldContext')
                subject.context = subject.getPath(oldContext);
                let uiSubject = run.appUi.createUiFor_typed(subject);
                await uiSubject.update();
                assertFalse(uiSubject.collapsed);

                await uiSubject.toggleContext();

                assert(uiSubject.collapsed);
            }, whenOutOfContext => {
                whenOutOfContext.addUiTest('withSubitem', async run => {
                    let subject = await run.app.createText('subject');
                    let oldContext = await run.app.createText('oldContext')
                    subject.context = subject.getPath(oldContext);
                    subject.installListA();
                    await subject.listA.add(await run.app.createText('dummySubitem'))
                    let uiSubject = run.appUi.createUiFor_typed(subject);
                    await uiSubject.update();
                    assertFalse(uiSubject.collapsed);

                    await uiSubject.toggleContext();

                    assertFalse(uiSubject.collapsed);
                    assert_sameAs(uiSubject.bodyG.content_contextAsSubitem_htmlElement.innerHTML, '');
                });
            });
        });
        this.tests.addUiTestWithNestedTests('newSubitem', async run => {
            await run.appUi.entity.uiA.update();
            await run.appUi.globalEventG.newSubitem();

            await run.appUi.globalEventG.newSubitem();

            let firstObj = await run.appUi.content.listA.getResolved(0);
            let created = await firstObj.listA.getResolved(0);
            assert(notNullUndefined(created));
            assert_sameAs((await created.context.pathA.resolve()), firstObj);
            let createdUi = run.appUi.content.uiA.listG.uisOfListItems[0].uiA.listG.uisOfListItems[0];
            assert_sameAs(run.appUi.focused, createdUi);
        }, newSubitem => {
            newSubitem.addUiTest('onApp', async run => {
                await run.appUi.entity.uiA.update();

                await run.appUi.globalEventG.newSubitem();

                let created = await run.appUi.content.listA.getResolved(0);
                assert(notNullUndefined(created));
                assert(nullUndefined(created.context));
                let createdUi = run.appUi.content.uiA.listG.uisOfListItems[0];
                assert_sameAs(run.appUi.focused, createdUi);
            });
        });
        this.tests.addUiTestWithNestedTests('defaultAction', async run => {
            await run.appUi.entity.uiA.update();
            await run.appUi.globalEventG.newSubitem();
            await run.appUi.globalEventG.newSubitem();

            await run.appUi.globalEventG.defaultAction();

            let firstObj = await run.appUi.content.listA.getResolved(0);
            let created = await firstObj.listA.getResolved(1);
            assert(notNullUndefined(created));
            assert_sameAs((await created.context.pathA.resolve()), firstObj);
            let createdUi = run.appUi.content.uiA.listG.uisOfListItems[0].uiA.listG.uisOfListItems[1];
            assert_sameAs(run.appUi.focused, createdUi);
        }, defaultActionTest => {
            defaultActionTest.addUiTest('withAppAsParent', async run => {
                await run.appUi.entity.uiA.update();
                await run.appUi.globalEventG.newSubitem();

                await run.appUi.globalEventG.defaultAction();

                let created = await run.appUi.content.listA.getResolved(1);
                assert(notNullUndefined(created));
                assert(nullUndefined(created.context));
                let createdUi = run.appUi.content.uiA.listG.uisOfListItems[1];
                assert_sameAs(run.appUi.focused, createdUi);
            });
        });
        this.tests.addNestedTests('tester', (tester) => {
            tester.addUiTestWithNestedTests('run', async outerRun => {
                let test = outerRun.app.entity.createCode('dummyTest', ()=>{});
                let run = await test.testG_run();
                let ui = outerRun.appUi.createUiFor_typed(run);
                await ui.update();

                assert(ui.collapsed);
            }, (runTest) => {
                runTest.addUiTest('failingNestedTest', async outerRun => {
                    let dummyTest = outerRun.app.entity.createCode('dummyTest', ()=>{});
                    dummyTest.testG_installNestedTestsA();
                    dummyTest.testG_nestedTestsA.add_withoutApp('failingNestedTest', () => {
                        assert(false);
                    });
                    let run = await dummyTest.testG_run();
                    let ui = outerRun.appUi.createUiFor_typed(run);
                    await ui.update();

                    assertFalse(ui.collapsed);
                });
            });
        });
    }
}