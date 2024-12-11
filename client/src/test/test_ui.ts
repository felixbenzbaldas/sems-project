import type {TestG_NestedTestsA} from "@/tester/TestG_NestedTestsA";
import {assert, assert_sameAs, assertFalse, notNullUndefined, nullUndefined} from "@/utils";
import type {Entity} from "@/Entity";
import type {UiA} from "@/ui/UiA";
import {Environment} from "@/Environment";

export function test_ui_add(tests : TestG_NestedTestsA) {
    tests.addNestedTests('ui', uiTests => {
        uiTests.addUiTest('updateAddedSubitem', async run => {
            let list = run.app.unboundG.createTextWithList('parent');
            let uiForList = run.appUi.createUiFor_typed(list);
            await uiForList.update();
            list.listA.addDirect(run.appUi.getApp().unboundG.createText('subitem'));

            await list.uis_update_addedListItem(0);

            assert_sameAs(1, uiForList.listG.uisOfListItems.length);
            assert(uiForList.headerBodyG.bodyIsVisible());
        });
        uiTests.addUiTest('updateRemovedSubitem', async run => {
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
        uiTests.addUiTest('mark', async run => {
            await run.appUi.update();
            run.appUi.clipboard_lostContext = true;
            let object = await run.app.createEntityWithApp();
            let objectUi = run.appUi.createUiFor_typed(object);
            await objectUi.update();

            await objectUi.mark();

            assert_sameAs(run.appUi.clipboard, object);
            assertFalse(run.appUi.clipboard_lostContext);
        });
        uiTests.addUiTestWithNestedTests('cut', async run => {
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
        uiTests.addUiTest('showContainerMark', async run => {
            let markedContainer = run.app.createEntityWithApp();
            markedContainer.installContainerA();
            markedContainer.installListA();
            run.app.entity.containerA.bind(markedContainer, 'sa9llaMlry'); // TODO should not be hardcoded
            markedContainer.text = 'marked container';
            run.appUi.content.listA.addDirect(markedContainer);

            let ui = run.appUi.createUiFor_typed(markedContainer);

            assert(ui.showContainerMark());
        });
        uiTests.addUiTestWithNestedTests('toggleCollapsible', async run => {
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
        uiTests.addUiTest('setContext', async run => {
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
        uiTests.addUiTestWithNestedTests('removeContext', async run => {
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
                    await subject.listA.add(await run.app.createText('dummySubitem'));
                    let uiSubject = run.appUi.createUiFor_typed(subject);
                    await uiSubject.update();

                    await uiSubject.toggleContext();

                    assertFalse(uiSubject.collapsed);
                    assert_sameAs(uiSubject.bodyG.content_contextAsSubitem_htmlElement.innerHTML, '');
                });
                whenOutOfContext.addUiTest('andCollapsible', async run => {
                    let subject = await run.app.createText('subject');
                    let oldContext = await run.app.createText('oldContext')
                    subject.context = subject.getPath(oldContext);
                    subject.collapsible = true;
                    let uiSubject = run.appUi.createUiFor_typed(subject);
                    await uiSubject.update();
                    assert(uiSubject.collapsed);
                    assert_sameAs(uiSubject.headerG.divForContentAndBodyIcon.style.cursor, 'pointer');

                    await uiSubject.toggleContext();

                    assert(uiSubject.collapsed);
                    assert_sameAs(uiSubject.headerG.divForContentAndBodyIcon.style.cursor, 'default');

                });
            });
        });
        uiTests.addUiTestWithNestedTests('newSubitem', async run => {
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
        uiTests.addUiTestWithNestedTests('defaultAction', async run => {
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
        uiTests.addNestedTests('tester', (tester) => {
            tester.addUiTestWithNestedTests('run', async outerRun => {
                let test = outerRun.app.entity.createCode('dummyTest', () => {
                });
                let run = await test.testG_run();
                let ui = outerRun.appUi.createUiFor_typed(run);
                await ui.update();

                assert(ui.collapsed);
            }, (runTest) => {
                runTest.addUiTest('failingNestedTest', async outerRun => {
                    let dummyTest = outerRun.app.entity.createCode('dummyTest', () => {
                    });
                    dummyTest.testG_installNestedTestsA();
                    dummyTest.testG_nestedTestsA.add_withoutApp('failingNestedTest', async () => {
                        assert(false);
                    });
                    let run = await dummyTest.testG_run();
                    let ui = outerRun.appUi.createUiFor_typed(run);
                    await ui.update();

                    assertFalse(ui.collapsed);
                });
            });
        });
        uiTests.addUiTestWithNestedTests('paste', async run => {
            let parent = await run.app.createText('parent');
            let toPaste = await run.app.createText('toPaste');
            let uiForParent = run.appUi.createUiFor_typed(parent);
            await uiForParent.update();
            run.appUi.clipboard = toPaste;

            await uiForParent.paste();

            assert_sameAs(await parent.listA.getResolved(0), toPaste);
            assert_sameAs(uiForParent.listG.uisOfListItems[0].uiA.object, toPaste);
            assert_sameAs(run.appUi.focused.uiA.object, toPaste);
            assert_sameAs(toPaste.context, undefined);
        }, pasteTest => {
            pasteTest.addUiTest('lostContext', async run => {
                let parent = await run.app.createText('parent');
                let toPaste = await run.app.createText('toPaste');
                let uiForParent = run.appUi.createUiFor_typed(parent);
                await uiForParent.update();
                run.appUi.clipboard = toPaste;
                run.appUi.clipboard_lostContext = true;

                await uiForParent.paste();

                assert_sameAs(await toPaste.context.pathA.resolve(), parent);
                assertFalse(run.appUi.clipboard_lostContext);
            });
            pasteTest.addUiTest('onApp', async run => {
                await run.appUi.entity.uiA.update(); // TODO should not be necessary
                let toPaste = await run.app.createText('toPaste');
                run.appUi.clipboard = toPaste;
                run.appUi.clipboard_lostContext = true;

                await run.appUi.globalEventG.paste();

                assert_sameAs(toPaste.context, undefined);
                assert_sameAs(await run.appUi.content.listA.getResolved(0), toPaste);
            });
            pasteTest.addUiTestWithNestedTests('pasteNext', async run => {
                let firstItem = await run.app.createText('firstItem');
                let toPaste = await run.app.createText('toPaste');
                let parent = await run.app.createTextWithList('parent', firstItem);
                let uiForParent: Entity = run.appUi.createUiFor(parent);
                await uiForParent.uiA.update();
                run.appUi.clipboard = toPaste;

                await uiForParent.uiA.listG.uisOfListItems[0].uiA.pasteNext();

                assert_sameAs(await parent.listA.getResolved(1), toPaste);
                assert_sameAs(uiForParent.uiA.listG.uisOfListItems.at(1).uiA.object, toPaste);
                assert_sameAs(run.appUi.focused.uiA.object, toPaste);
            }, pasteNextTest => {
                pasteNextTest.addUiTest('parentIsPlainList', async run => {
                    let firstItem = await run.app.createText('firstItem');
                    let toPaste = await run.app.createText('toPaste');
                    let parent = await run.app.createList();
                    await parent.listA.add(firstItem);
                    let uiForParent: UiA = run.appUi.createUiFor_typed(parent);
                    await uiForParent.update();
                    run.appUi.clipboard = toPaste;
                    run.appUi.clipboard_lostContext = true;

                    await uiForParent.listG.uisOfListItems[0].uiA.pasteNext();

                    assert(run.appUi.clipboard_lostContext);
                });
            });
        });
        uiTests.add_withoutApp('getUrl', async run => {
            let environment = new Environment();
            environment.url = new URL('https://testdomain1.org');
            let appUi = environment.createApp().appA.createStarter().createAppWithUI_typed();
            let object = await appUi.entity.containerA.createBoundEntity('testName');

            let url = appUi.createUiFor_typed(object).getUrl();

            assert_sameAs(url, 'https://testdomain1.org/?path=testName');
        });
        uiTests.addNestedTests('meta', metaTests => {
            metaTests.addUiTestWithNestedTests('show', async run => {
                let object = await run.app.createTextWithList('test', await run.app.createText('subitem'));
                let ui = run.appUi.createUiFor_typed(object);
                await ui.update();

                await ui.showMeta();

                assert(ui.metaIsDisplayed());
            }, showMetaTest => {
                showMetaTest.addUiTest('withoutSubitem', async run => {
                    let object = await run.app.createText('test');
                    let ui = run.appUi.createUiFor_typed(object);
                    await ui.update();

                    await ui.showMeta();

                    assert(ui.headerBodyG.bodyIsVisible());
                    assert(ui.metaIsDisplayed());
                });
                showMetaTest.addUiTest('semi', async run => {
                    let createUi: () => Promise<HTMLElement> = async () => {
                        let environment = new Environment();
                        environment.url = new URL('https://testdomain1.org');
                        let appUi = environment.createApp().appA.createStarter().createAppWithUI_typed();
                        await appUi.entity.uiA.update();
                        let app = appUi.getApp();
                        let object = await app.createTextWithList('test', await app.createText('subitem'));
                        let ui = appUi.createUiFor_typed(object);
                        await ui.update();

                        await ui.showMeta();

                        return ui.htmlElement;
                    }
                    let html = await run.app.createBoundEntity();
                    html.codeG_html = await createUi();
                    await run.appUi.content.listA.add(html);
                    run.app.entity.log('human-test: the meta is displayed');
                    run.app.entity.log('human-test: the meta contains a hide button');
                    run.app.entity.log('human-test: when clicking the button, the meta disappears (the subitem stays)');
                    run.app.entity.log('human-test: with context-click the meta appears');
                });
            });
            metaTests.addUiTest('hide', async run => {
                let object = await run.app.createText('test');
                let ui = run.appUi.createUiFor_typed(object);
                await ui.update();
                await ui.showMeta();

                await ui.hideMeta();

                assert(!ui.headerBodyG.bodyIsVisible());
            });
        });
        uiTests.addUiTest('setLink', async run => {
            let createUi: () => Promise<HTMLElement> = async () => {
                let appUi = new Environment().createApp().appA.createStarter().createAppWithUI_typed();
                await appUi.entity.uiA.update();
                let app = appUi.getApp();
                let object = await app.createText('Link');
                let ui = appUi.createUiFor_typed(object);
                await ui.update();
                let url = 'http://localhost:1234';
                appUi.input.input.text = url;
                appUi.focused = ui.entity;

                await appUi.globalEventG.setLink();

                assert_sameAs(object.link, url);
                assert_sameAs(appUi.input.get(), '');
                return ui.htmlElement;
            }
            let html = await run.app.createBoundEntity();
            html.codeG_html = await createUi();
            await run.appUi.content.listA.add(html);
        });
    });
}