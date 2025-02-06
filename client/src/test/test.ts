import type {TestG_NestedTestsA} from "@/tester/TestG_NestedTestsA";
import {test_tester_add} from "@/test/test_tester";
import {test_semi_add} from "@/test/test_semi";
import {
    assert,
    assert_notSameAs,
    assert_sameAs,
    createRandomString,
    getPathFromUrl,
    notNullUndefined,
    nullUndefined
} from "@/utils";
import {Entity} from "@/Entity";
import {testData} from "@/testData";
import {test_ui_add} from "@/test/test_ui";
import {Environment} from "@/Environment";
import {StarterA} from "@/StarterA";
import {test_path_add} from "@/test/test_path";

export function test_add(tests : TestG_NestedTestsA) {
    test_tester_add(tests);
    // test_ui_add(tests);
    // test_semi_add(tests);
    test_path_add(tests);
    tests.add('dependencies', async run => {
        let object = await run.app.createList();
        let dependency = await run.app.createList();
        let dependencyOfDependency = await run.app.createText('dependencyOfDependency');
        await object.listA.add(dependency);
        await dependency.listA.add(dependencyOfDependency);
        let context = await run.app.createText('context');
        object.context = object.getPath(context);

        let dependencies = await object.getDependencies();

        assert(dependencies.has(dependency), 'has dependency');
        assert(dependencies.has(dependencyOfDependency));
        assert(dependencies.has(context));
        assert_sameAs(dependencies.size, 3);
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
        let targetContainer = await run.app.createBoundEntity();
        targetContainer.installContainerA();
        object.text = 'foo';
        object.collapsible = true;
        let dependency = await run.app.createText('dependency');
        await object.listA.add(dependency);
        object.context = object.getPath(await run.app.createText('dummyContext'));
        let dependencyWithContext = await run.app.createText('dependency with context');
        await object.listA.add(dependencyWithContext);
        dependencyWithContext.context = dependencyWithContext.getPath(object);

        let copy : Entity = await object.deepCopy(targetContainer.containerA).run();

        assert_sameAs(copy.text, object.text);
        assert_sameAs(copy.collapsible, object.collapsible);
        assert_sameAs(copy.context, undefined);
        assert_sameAs((await copy.listA.getResolved(0)).text, 'dependency');
        assert_notSameAs(await copy.listA.getResolved(0), dependency);
        assert_sameAs(await (await copy.listA.getResolved(1)).context.resolve(), copy);
        assert_sameAs(copy.container, targetContainer);
    });
    tests.add('createBoundEntity', async run => {
        let entity = await run.app.createBoundEntity();

        assert_sameAs(run.app.entity.getPath(entity).listOfNames[0], entity.name);
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
        assert_sameAs(root.context.listOfNames[0], '..');
        assert_sameAs(root.context.listOfNames[1], '345');
        assert_sameAs(root.collapsible, false);
        assert_sameAs(root.listA.jsList.length, 2);
        assert_sameAs(root.listA.jsList[0].listOfNames[0], '..');
        assert_sameAs(root.listA.jsList[0].listOfNames[1], '567');
        assert_sameAs(root.listA.jsList[1].listOfNames[0], '..');
        assert_sameAs(root.listA.jsList[1].listOfNames[1], '..');
        assert_sameAs(root.listA.jsList[1].listOfNames[2], 'AnotherHouse');
        assert_sameAs(root.listA.jsList[1].listOfNames[3], '789');
    });
    tests.add('export', async run => {
        let container = run.app.unboundG.createTextWithList('the container');
        container.installContainerA();
        let subitemAndContained = await container.containerA.createText('subitem + contained');
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
        assert_sameAs(await containedAndSub.context.resolve(), container);
        assert(notNullUndefined(container.listA.jsList[0]));
    }, createFromJson => {
        createFromJson.add('testData', async run => {
            let container = run.app.unboundG.createFromJson(testData);

            assert_sameAs(container.text, 'demo website (container)');
        });
    });
    tests.addTestWithNestedTests('list', async run => {
        let list : Entity = run.app.unboundG.createList();

        assert_notSameAs(list.listA, undefined);
        assert_notSameAs(list.listA.jsList, undefined);
        assert_sameAs(list.getShortDescription(), 'list (0)');
    }, list => {
        list.add('findByText', async run => {
            let list : Entity = run.app.unboundG.createList();
            let subitem = run.app.unboundG.createText('findMe');
            list.listA.addDirect(subitem);

            let found = await list.listA.findByText('findMe');

            assert_sameAs(found, subitem);
        });
        list.add('insertPathAtPosition', async run => {
            let list : Entity = await run.app.createList();
            let listItem : Entity = run.app.unboundG.createText('subitem');

            await list.listA.insertPathAtPosition(run.app.direct(listItem).pathA, 0);

            assert_sameAs(await list.listA.jsList[0].resolve(), listItem);
        });
        list.add('insertObjectAtPosition', async run => {
            let list : Entity = await run.app.createList();
            let listItem : Entity = await run.app.createText('subitem');

            await list.listA.insertObjectAtPosition(listItem, 0);

            assert_sameAs(await list.listA.getResolved(0), listItem);
        });
        list.add('jsonWithoutContainedObjects', async run => {
            let list = await run.app.createList();
            let item = await run.app.createText('bar');
            await list.listA.add(item);

            let json : any = list.json_withoutContainedObjects();

            assert_sameAs(json.list.length, 1);
            assert_sameAs(json.list[0][1], item.name);
        });
    });
    tests.add('log', async run => {
        run.app.logG.toListOfStrings = true;
        let object = await run.app.createText('foo');

        object.log('Good morning!');

        assert_sameAs(run.app.logG.listOfStrings.join(), 'foo /// Good morning!');
    });
    tests.add('shortDescription', async run => {
        let text : Entity = run.app.unboundG.createText('1234567890'.repeat(3));

        let shortDescription = text.getShortDescription();

        assert_sameAs(shortDescription, '12345678901234567890');
    });
    tests.add('createAppFromEnvironment', async run => {
        let environment = new Environment();

        let app = environment.createApp();

        assert_sameAs(app.environment, environment);
    });
    tests.add('createStarter', async test => {
        let starterApplication = new Environment().createApp();

        let starter : StarterA = starterApplication.createStarter();

        assert(notNullUndefined(starter));
        assert_sameAs(starter.entity.getApp_typed(), starterApplication);
    });
    tests.addNestedTests('util', utilTests => {
        utilTests.add('randomString', async run => {
            assert_sameAs(createRandomString().length, 10);
            assert_notSameAs(createRandomString(), createRandomString());
        });
        utilTests.add('nullUndefined', async run => {
            assert(nullUndefined(null));
            assert(nullUndefined(undefined));
            assert(!nullUndefined(42));
            assert(notNullUndefined(42));
        });
        utilTests.addTestWithNestedTests('assert', async run => {
            try {
                assert(false);
            } catch (throwable) {
                let error = throwable as Error;
                assert_sameAs(error.message, 'AssertionError: condition must be fulfilled');
                return;
            }
            throw new Error();
        }, assertTests => {
            assertTests.add('sameAs', async run => {
                try {
                    assert_sameAs(42, 43);
                } catch (throwable) {
                    let error = throwable as Error;
                    if (error.message !== 'AssertionError: 42 !== 43') {
                        throw new Error();
                    }
                    return;
                }
                throw new Error();
            });
            assertTests.add('notSameAs', async run => {
                try {
                    assert_notSameAs(42, 42);
                } catch (throwable) {
                    let error = throwable as Error;
                    if (error.message !== 'AssertionError: 42 === 42') {
                        throw new Error();
                    }
                    return;
                }
                throw new Error();
            });
        });
    });
    tests.add('code', async run => {
        let name = 'nameOfCode';
        let jsFunction = () => {
            // do something
        };

        let code : Entity = run.app.entity.createCode(name, jsFunction);

        assert_sameAs(run.app.entity.containerA.mapNameEntity.get(name), code);
        assert_sameAs(code.codeG_jsFunction, jsFunction);
    });
    tests.add('getUrl', async run => {
        let container = await run.app.createText('#https://testdomain6.org');
        container.installContainerA();
        let subContainer = await container.containerA.createBoundEntity('foo');
        subContainer.installContainerA();
        let object = await subContainer.containerA.createBoundEntity('testName');

        let url = object.getUrl();

        assert_sameAs(url, 'https://testdomain6.org/foo/testName');
    });
    tests.add('delete', async run => {
        let container = await run.app.createText('container');
        container.installContainerA();
        let object = await container.containerA.createText('willBeDeleted');
        object.installListA();
        object.installContainerA();

        object.delete();

        assert_sameAs(container.containerA.mapNameEntity.size, 0);
        assert_sameAs(object.containerA, undefined);
        assert_sameAs(object.listA, undefined);
        assert_sameAs(object.text, undefined);
        assert_sameAs(object.name, undefined);
        assert_sameAs(object.container, undefined);
        assert_sameAs(object.app, run.app.entity);
    });
    tests.addTestWithNestedTests('shakeTree', async run => {
        let container = await run.app.createText('container');
        container.installContainerA();
        await container.containerA.createText('will be removed');
        container.installListA();
        let subitemAndContainer = await container.containerA.createText('subitem and container');
        await container.listA.add(subitemAndContainer);
        subitemAndContainer.installContainerA();
        await subitemAndContainer.containerA.createText('will also be removed');
        let containendContained = await subitemAndContainer.containerA.createText('contained contained');
        await container.listA.add(containendContained);
        let standaloneContainer = await container.containerA.createText('standalone container');
        standaloneContainer.installContainerA();

        await container.containerA.shakeTree();

        assert(container.containerA.mapNameEntity.has(standaloneContainer.name));
        assert_sameAs(container.containerA.mapNameEntity.size, 2);
        assert_sameAs(subitemAndContainer.containerA.mapNameEntity.size, 1);
    }, shakeTreeTests => {
        shakeTreeTests.add('withMultipleRoots', async run => {
            let container = await run.app.createText('container');
            container.installContainerA();
            let secondRoot = await container.containerA.createText('secondRoot');

            await run.app.shakeTree_withMultipleRoots([container, secondRoot], container.containerA);

            assert_sameAs(container.containerA.mapNameEntity.values().next().value, secondRoot);
        });
    });
    tests.addNestedTests('container', containerTests => {
        containerTests.add('countWithNestedEntities', async run => {
            let container = await run.app.createText('container');
            container.installContainerA();
            let nestedContainer = await container.containerA.createText('nested');
            nestedContainer.installContainerA();
            await nestedContainer.containerA.createText('nestedNested');
            await nestedContainer.containerA.createText('nestedNested2');

            let count = container.containerA.countWithNestedEntities();

            assert_sameAs(count, 3);
        });
    });
    tests.addTestWithNestedTests('pathInUrl', async run => {
        let url = new URL('https://einfaches-web.org/test/foo/?dummyParam');

        let path = getPathFromUrl(url);

        assert_sameAs(path, 'test_foo');
    }, pathInUrlTests => {
        pathInUrlTests.add('empty', async run => {
            let url = new URL('https://einfaches-web.org?dummyParam');

            let path = getPathFromUrl(url);

            assert_sameAs(path, '');
        });
        pathInUrlTests.add('index.html', async run => {
            let url = new URL('https://einfaches-web.org/index.html');

            let path = getPathFromUrl(url);

            assert_sameAs(path, '');
        });
    });
}