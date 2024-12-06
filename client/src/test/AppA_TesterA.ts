import {Entity} from "@/Entity";
import {
    assert,
    assert_notSameAs,
    assert_sameAs,
    assertFalse,
    downloadText,
    notNullUndefined,
    setWidth,
    textFileInput
} from "@/utils";
import {AppA_TesterA_UiTestG} from "@/test/AppA_TesterA_UiTestG";
import {testData} from "@/testData";

export class AppA_TesterA {

    test: Entity;
    uiTestG: AppA_TesterA_UiTestG;

    constructor(public entity : Entity) {
        this.uiTestG = new AppA_TesterA_UiTestG(entity);
    }

    async run() {
        let run = await this.test.testG_run();
        this.entity.appA.uiA.content.listA.addDirect(run);
    }

    createTestForSimpleSoftware() : Entity {
        let tester = this.entity;
        let test = tester.createCode('test', () => {});
        test.installContainerA();
        test.testG_installNestedTestsA();
        let tests = test.testG_nestedTestsA;
        if (tester.appA.environment.url.searchParams.has('withFailingDemoTest')) {
            tests.add('failingDemoTest', async run => {
                run.appUi = tester.appA.createStarter().createAppWithUIWithCommands_editable().appA.uiA;
                assert(false);
            });
        }
        this.uiTestG.addTo(test);
        tests.addNestedTests('semi', semi => {
            semi.add('keyboardEvent',  async run => {
                let appA = tester.appA.createStarter().createAppWithUI().appA;
                appA.testMode = true;
                run.appUi = appA.uiA;
                appA.uiA.content.listA.addDirect(
                    appA.unboundG.createButton('activate test-app', () => {
                    }),
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
            semi.add('contextIcon',  async run => {
                let appA = tester.appA.createStarter().createAppWithUI().appA;
                appA.testMode = true;
                run.appUi = appA.uiA;
                let parent = await appA.createText('parent');
                parent.installListA();
                let inContext = await appA.createText('inContext');
                let withoutContext = await appA.createText('withoutContext');
                let outOfContext = await appA.createText('outOfContext');
                let longText = await appA.createText('longText-'.repeat(25));
                inContext.context = inContext.getPath(parent);
                longText.context = longText.getPath(parent);
                outOfContext.context = outOfContext.getPath(await appA.createText('aDummyContext'));
                await parent.listA.add(inContext);
                await parent.listA.add(outOfContext);
                await parent.listA.add(withoutContext);
                await parent.listA.add(longText);
                await appA.uiA.content.listA.add(parent);
                await appA.uiA.update();
                let parentUi = appA.uiA.content.uiA.listG.uisOfListItems[0];
                assert_sameAs(parentUi.uiA.listG.uisOfListItems[0].uiA.headerG.contextIcon.innerText, '-');
                assert_sameAs(parentUi.uiA.listG.uisOfListItems[1].uiA.headerG.contextIcon.innerText, '/');
                assert_sameAs(parentUi.uiA.listG.uisOfListItems[2].uiA.headerG.contextIcon.innerText, '');
                appA.entity.log('human-test: The item withContext should show the appropriate contextIcon -');
                appA.entity.log('human-test: The contextIcon always appears left of the content - also for the long text.');
            });
            semi.add('contextAsSubitem',  async run => {
                let appA = tester.appA.createStarter().createAppWithUI().appA;
                appA.testMode = true;
                run.appUi = appA.uiA;
                appA.entity.uiA.editable = true;
                let parent = await appA.createText('parent');
                parent.installListA();
                let inContext = await appA.createText('inContext');
                let withoutContext = await appA.createText('withoutContext');
                let outOfContext = await appA.createText('outOfContext');
                inContext.context = inContext.getPath(parent);
                outOfContext.context = outOfContext.getPath(await appA.createText('aDummyContext'));
                outOfContext.installListA();
                await outOfContext.listA.add(await appA.createText('aDummySubitem'));
                await parent.listA.add(inContext);
                await parent.listA.add(outOfContext);
                await parent.listA.add(withoutContext);
                await appA.uiA.content.listA.add(parent);
                await appA.uiA.update();
                let parentUi = appA.uiA.content.uiA.listG.uisOfListItems[0];
                assertFalse(await parentUi.uiA.listG.uisOfListItems[0].uiA.hasContextAsSubitem());
                assert(await parentUi.uiA.listG.uisOfListItems[1].uiA.hasContextAsSubitem());
                assertFalse(await parentUi.uiA.listG.uisOfListItems[2].uiA.hasContextAsSubitem());
                //
                assert(await parentUi.uiA.listG.uisOfListItems[1].uiA.headerBodyG.hasBodyContent());
                appA.entity.log('human-test: outOfContext shows "contextAsSubitem"');
            });
            semi.add('upload',  async run => {
                let appUi = tester.appA.createStarter().createAppWithUI_typed();
                let appA = appUi.getApp();
                run.appUi = appUi;
                let html = appA.createEntityWithApp();
                appA.uiA.content.listA.addDirect(html);
                html.codeG_html = textFileInput((contents : any) => {
                    appA.uiA.content.listA.addDirect(appA.unboundG.createText(contents));
                    appA.uiA.update();
                });
                appA.entity.log('human-action: Click on upload -> choose a text file');
                appA.entity.log('human-test: The text of the file appears.');
            });
            semi.add('download',  async run => {
                let appUi = tester.appA.createStarter().createAppWithUI_typed();
                let appA = appUi.getApp();
                run.appUi = appUi;
                let html = appA.createEntityWithApp();
                appA.uiA.content.listA.addDirect(html);
                const fileContent = 'foo123';
                const fileName = 'testfile.txt';
                html.codeG_html = downloadText(fileContent, fileName, 'download');
                appA.entity.log('human-action: Click on download');
                appA.entity.log('human-test: A text file is downloaded.');
                appA.entity.log('human-test: The content of the downloaded file is ' + fileContent);
            });
            semi.add('setWidth',  async run => {
                run.appUi = tester.appA.createStarter().createAppWithUI_typed();
                let appA = run.appUi.getApp();
                let html = appA.createEntityWithApp();
                appA.uiA.content.listA.addDirect(html);
                html.codeG_html = document.createElement('div');
                let left = document.createElement('div');
                html.codeG_html.appendChild(left);
                let right = document.createElement('div');
                html.codeG_html.appendChild(right);
                html.codeG_html.style.display = 'flex';
                html.codeG_html.style.width = '30rem';
                html.codeG_html.style.height = '10rem';
                html.codeG_html.style.border = 'solid';
                left.style.width = '5rem'; // this is not 'strong' enough. You will need the setWidth function
                right.contentEditable = 'true';
                right.style.minWidth = '5rem';
                right.style.border = 'solid';
                right.innerText = 'Write some text here (multiple lines)!';

                setWidth(left, '5rem');

                appA.entity.log('human-action: write multiple lines in the text field');
                appA.entity.log('human-test: The text does not move.');
            });
        });
        tests.add('paste', async run => {
            let appUi = await tester.appA.createStarter().createAppWithUI_typed();
            await appUi.getApp().uiA.update(); // TODO should not be necessary
            await appUi.globalEventG.defaultAction();
            let uiForParent : Entity = appUi.content.uiA.listG.uisOfListItems[0];
            let toPaste = await appUi.getApp().createText('toPaste');
            appUi.clipboard = toPaste;

            await appUi.globalEventG.paste();

            assert_sameAs(await uiForParent.getObject().listA.getResolved(0), toPaste);
            assert_sameAs(uiForParent.uiA.listG.uisOfListItems[0].uiA.object, toPaste);
            assert_sameAs(appUi.focused.uiA.object, toPaste);
        });
        tests.add('dependencies', async run => {
            let app = tester.appA.createStarter().createApp_typed();
            let object = await app.createList();
            let dependency = await app.createList();
            let dependencyOfDependency = await app.createText('dependencyOfDependency');
            await object.listA.add(dependency);
            await dependency.listA.add(dependencyOfDependency);

            let dependencies = await object.getDependencies();

            assert_sameAs(dependencies.size, 2);
            assert(dependencies.has(dependency), 'has dependency');
            assert(dependencies.has(dependencyOfDependency));
        });
        tests.add('shallowCopy', async run => {
            let app = tester.appA.createStarter().createApp_typed();
            let object = await app.createList();
            object.text = 'foo';
            object.collapsible = true;
            let dependency = await app.createList();
            await object.listA.add(dependency);

            let copy : Entity = await object.shallowCopy();

            assert_sameAs(await copy.listA.getResolved(0), dependency);
            assert_sameAs(copy.text, object.text);
            assert_sameAs(copy.collapsible, object.collapsible);
        });
        tests.add('deepCopy', async run => {
            let app = tester.appA.createStarter().createApp_typed();
            let object = await app.createList();
            object.text = 'foo';
            object.collapsible = true;
            let dependency = await app.createText('dependency');
            await object.listA.add(dependency);

            let copy : Entity = await object.deepCopy().run();

            assert_sameAs(copy.text, object.text);
            assert_sameAs(copy.collapsible, object.collapsible);
            assert_sameAs((await copy.listA.getResolved(0)).text, 'dependency');
            assert_notSameAs(await copy.listA.getResolved(0), dependency);
            assert_sameAs(copy.container, app.entity);
        });
        tests.add('createBoundEntity', async run => {
            let app = tester.appA.createStarter().createApp_typed();

            let entity = await app.createBoundEntity();

            assert_sameAs(app.entity.getPath(entity).pathA.listOfNames[0], entity.name);
            assert_sameAs(app.entity, entity.container);
        });
        tests.add('createFromOldJson', async run => {
            let app = tester.appA.createStarter().createApp();
            let json = {
                "rootObject":"AHouse-0",
                "objects":[
                    {
                        "id":"AHouse-0",
                        "details":["AHouse-567", "AnotherHouse-789"],
                        "properties":{
                            "context":"AHouse-345",
                            "text":"foo bar",
                            "defaultExpanded":true
                        }
                    },
                    {
                        "id":"AHouse-567",
                        "properties":{
                            "text":"foo bar",
                            "defaultExpanded":false
                        }
                    }
                ]
            };

            let container = await app.appA.unboundG.createFromOldJson(json);

            assert_sameAs(container.containerA.mapNameEntity.size, 2);
            assert_sameAs(container.listA.jsList.length, 1);
            let root : Entity = await container.listA.getResolved(0);
            assert_sameAs(root.text, 'foo bar');
            assert_sameAs(root.name, '0');
            assert_sameAs(root.context.pathA.listOfNames[0], '..');
            assert_sameAs(root.context.pathA.listOfNames[1], '345');
            assert_sameAs(root.collapsible, false);
            assert_sameAs(root.listA.jsList.length, 2);
            assert_sameAs(root.listA.jsList[0].pathA.listOfNames[0], '..');
            assert_sameAs(root.listA.jsList[0].pathA.listOfNames[1], '567');
            assert_sameAs(root.listA.jsList[1].pathA.listOfNames[0], '..');
            assert_sameAs(root.listA.jsList[1].pathA.listOfNames[1], '..');
            assert_sameAs(root.listA.jsList[1].pathA.listOfNames[2], 'AnotherHouse');
            assert_sameAs(root.listA.jsList[1].pathA.listOfNames[3], '789');
        });
        tests.add('export', async run => {
            let app = tester.appA.createStarter().createApp();
            let container = app.appA.unboundG.createTextWithList('the container');
            container.installContainerA();
            app.appA.currentContainer = container;
            let subitemAndContained = await app.appA.createText('subitem + contained');
            await container.listA.add(subitemAndContained);

            let exported = await container.export();

            app.log('exported: ' + JSON.stringify(exported, null, 4));
            assert_sameAs(exported.text, 'the container');
            assert_sameAs(exported.list.length, 1);
            assert_sameAs(exported.objects[exported.list[0][0].toString()].text, 'subitem + contained');
        });
        tests.add('jsonWithoutContainedObjects', async run => {
            let app = tester.appA.createStarter().createApp();
            let object = app.appA.unboundG.createTextWithList('object');
            object.context = app.appA.createPath(['aName'], object);

            let json = object.json_withoutContainedObjects();

            app.log('json: ' + JSON.stringify(json, null, 4));
            assert_sameAs(json.text, 'object');
            assert_sameAs(json.context[0], 'aName');
        });
        tests.addTestWithNestedTests('createFromJson', async run => {
            let app = tester.appA.createStarter().createApp();
            let json = {
                text: 'container + parent',
                list: [['0']],
                objects: {'0': {
                    text: 'contained + subitem',
                    context: ['..']
                }}
            };

            let container = app.appA.unboundG.createFromJson(json);

            let containedAndSub = await container.listA.getResolved(0);
            assert_sameAs(container.text, 'container + parent');
            assert_sameAs(containedAndSub.text, 'contained + subitem');
            assert_sameAs(containedAndSub.container, container);
            assert_sameAs(containedAndSub.name, container.containerA.mapNameEntity.keys().next().value);
            assert_sameAs(await containedAndSub.context.pathA.resolve(), container);
            assert(notNullUndefined(container.listA.jsList.at(0).pathA));
        }, createFromJson => {
            createFromJson.add('testData', async run => {
                let app = tester.appA.createStarter().createApp();

                let container = app.appA.unboundG.createFromJson(testData);

                assert_sameAs(container.text, 'demo website (container)');
            });
        });
        tests.addNestedTests('path', path => {
            path.addNestedTests('resolve', path_resolve => {
                path_resolve.add('direct', async run => {
                    let appA = tester.appA.createStarter().createApp_typed();
                    let entity = appA.createEntityWithApp();
                    let path = appA.direct(entity);

                    let resolved = await path.pathA.resolve();

                    assert_sameAs(resolved, entity);
                });
                path_resolve.add('listOfNames', async run => {
                    let appA = tester.appA.createStarter().createApp_typed();
                    let container = appA.createEntityWithApp();
                    container.installContainerA();
                    let contained = await container.containerA.createBoundEntity();
                    let path = container.getPath(contained);

                    let resolved = await path.pathA.resolve();

                    assert_sameAs(resolved, contained);
                });
            });
        });
        tests.addNestedTests('list', list => {
            list.add('findByText', async test => {
                let appA = tester.appA.createStarter().createApp_typed();
                appA.logG.toListOfStrings = true;
                let list : Entity = appA.unboundG.createList();
                let subitem = appA.unboundG.createText('findMe');
                list.listA.addDirect(subitem);

                let found = await list.listA.findByText('findMe');

                assert_sameAs(found, subitem);
            });
            list.add('insertPathAtPosition', async test => {
                let appA = tester.appA.createStarter().createApp_typed();
                let list : Entity = await appA.createList();
                let listItem : Entity = await appA.createText('subitem');

                await list.listA.insertPathAtPosition(appA.direct(listItem).pathA, 0);

                assert_sameAs(await list.listA.jsList[0].pathA.resolve(), listItem);
            });
        });
        return test;
    }
}