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
import {tester_tester_add} from "@/test/tester_tester";
import {tester_semi_add} from "@/test/tester_semi";

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
            tests.add_withoutApp('failingDemoTest', async run => {
                run.appUi = tester.appA.createStarter().createAppWithUIWithCommands_editable().appA.uiA;
                assert(false);
            });
        }
        tester_tester_add(tests);
        this.uiTestG.addTo(test);
        tester_semi_add(tests);
        tests.add('dependencies', async run => {
            let object = await run.app.createList();
            let dependency = await run.app.createList();
            let dependencyOfDependency = await run.app.createText('dependencyOfDependency');
            await object.listA.add(dependency);
            await dependency.listA.add(dependencyOfDependency);

            let dependencies = await object.getDependencies();

            assert_sameAs(dependencies.size, 2);
            assert(dependencies.has(dependency), 'has dependency');
            assert(dependencies.has(dependencyOfDependency));
        });
        tests.add('shallowCopy', async run => {
            let object = await run.app.createList();
            object.text = 'foo';
            object.collapsible = true;
            let dependency = await run.app.createList();
            await object.listA.add(dependency);

            let copy : Entity = await object.shallowCopy();

            assert_sameAs(await copy.listA.getResolved(0), dependency);
            assert_sameAs(copy.text, object.text);
            assert_sameAs(copy.collapsible, object.collapsible);
        });
        tests.add('deepCopy', async run => {
            let object = await run.app.createList();
            object.text = 'foo';
            object.collapsible = true;
            let dependency = await run.app.createText('dependency');
            await object.listA.add(dependency);
            object.context = object.getPath(await run.app.createText('dummyContext'));
            let dependencyWithContext = await run.app.createText('dependency with context');
            await object.listA.add(dependencyWithContext);
            dependencyWithContext.context = dependencyWithContext.getPath(object);

            let copy : Entity = await object.deepCopy().run();

            assert_sameAs(copy.text, object.text);
            assert_sameAs(copy.collapsible, object.collapsible);
            assert_sameAs(copy.context, undefined);
            assert_sameAs((await copy.listA.getResolved(0)).text, 'dependency');
            assert_notSameAs(await copy.listA.getResolved(0), dependency);
            assert_sameAs(await (await copy.listA.getResolved(1)).context.pathA.resolve(), copy);
            assert_sameAs(copy.container, run.app.entity);
        });
        tests.add('createBoundEntity', async run => {
            let entity = await run.app.createBoundEntity();

            assert_sameAs(run.app.entity.getPath(entity).pathA.listOfNames[0], entity.name);
            assert_sameAs(run.app.entity, entity.container);
        });
        tests.add('createFromOldJson', async run => {
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

            let container = await run.app.unboundG.createFromOldJson(json);

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
            let container = run.app.unboundG.createTextWithList('the container');
            container.installContainerA();
            run.app.currentContainer = container;
            let subitemAndContained = await run.app.createText('subitem + contained');
            await container.listA.add(subitemAndContained);

            let exported = await container.export();

            run.app.entity.log('exported: ' + JSON.stringify(exported, null, 4));
            assert_sameAs(exported.text, 'the container');
            assert_sameAs(exported.list.length, 1);
            assert_sameAs(exported.objects[exported.list[0][0].toString()].text, 'subitem + contained');
        });
        tests.add('jsonWithoutContainedObjects', async run => {
            let object = run.app.unboundG.createTextWithList('object');
            object.context = run.app.createPath(['aName'], object);

            let json = object.json_withoutContainedObjects();

            run.app.entity.log('json: ' + JSON.stringify(json, null, 4));
            assert_sameAs(json.text, 'object');
            assert_sameAs(json.context[0], 'aName');
        });
        tests.addTestWithNestedTests('createFromJson', async run => {
            let json = {
                text: 'container + parent',
                list: [['0']],
                objects: {'0': {
                    text: 'contained + subitem',
                    context: ['..']
                }}
            };

            let container = run.app.unboundG.createFromJson(json);

            let containedAndSub = await container.listA.getResolved(0);
            assert_sameAs(container.text, 'container + parent');
            assert_sameAs(containedAndSub.text, 'contained + subitem');
            assert_sameAs(containedAndSub.container, container);
            assert_sameAs(containedAndSub.name, container.containerA.mapNameEntity.keys().next().value);
            assert_sameAs(await containedAndSub.context.pathA.resolve(), container);
            assert(notNullUndefined(container.listA.jsList.at(0).pathA));
        }, createFromJson => {
            createFromJson.add('testData', async run => {
                let container = run.app.unboundG.createFromJson(testData);

                assert_sameAs(container.text, 'demo website (container)');
            });
        });
        tests.addNestedTests('path', path => {
            path.addNestedTests('resolve', path_resolve => {
                path_resolve.add('direct', async run => {
                    let entity = run.app.createEntityWithApp();
                    let path = run.app.direct(entity);

                    let resolved = await path.pathA.resolve();

                    assert_sameAs(resolved, entity);
                });
                path_resolve.add('listOfNames', async run => {
                    let container = run.app.createEntityWithApp();
                    container.installContainerA();
                    let contained = await container.containerA.createBoundEntity();
                    let path = container.getPath(contained);

                    let resolved = await path.pathA.resolve();

                    assert_sameAs(resolved, contained);
                });
            });
        });
        tests.addNestedTests('list', list => {
            list.add('findByText', async run => {
                run.app.logG.toListOfStrings = true;
                let list : Entity = run.app.unboundG.createList();
                let subitem = run.app.unboundG.createText('findMe');
                list.listA.addDirect(subitem);

                let found = await list.listA.findByText('findMe');

                assert_sameAs(found, subitem);
            });
            list.add('insertPathAtPosition', async run => {
                let list : Entity = await run.app.createList();
                let listItem : Entity = await run.app.createText('subitem');

                await list.listA.insertPathAtPosition(run.app.direct(listItem).pathA, 0);

                assert_sameAs(await list.listA.jsList[0].pathA.resolve(), listItem);
            });
        });
        return test;
    }
}