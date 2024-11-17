import {Entity} from "@/Entity";
import {StarterA} from "@/StarterA";
import {AppA} from "@/AppA";
import {
    assert,
    assert_notSameAs,
    assert_sameAs,
    assertFalse,
    createRandomString,
    notNullUndefined,
    nullUndefined
} from "@/utils";
import {ContainerA} from "@/ContainerA";
import {AppA_TestA_UiG} from "@/test/AppA_TestA_UiG";
import {AppA_TestA_ModelG} from "@/test/AppA_TestA_ModelG";
import {AppA_TestA_SemiG} from "@/test/AppA_TestA_SemiG";
import {AppA_TestA_PathG} from "@/test/AppA_TestA_PathG";
import {Environment} from "@/Environment";
import {testData} from "@/testData";

class TestResults {
    successful : Array<Entity> = [];
    failed : Array<Entity> = [];
}

export class AppA_TestA {

    private readonly appA : AppA;
    readonly uiG: AppA_TestA_UiG;
    readonly modelG: AppA_TestA_ModelG;
    readonly semiG: AppA_TestA_SemiG;
    readonly pathG: AppA_TestA_PathG;
    withFailingDemoTest: boolean;

    constructor(private entity : Entity) {
        this.appA = entity.appA;
        this.uiG = new AppA_TestA_UiG(entity);
        this.modelG = new AppA_TestA_ModelG(entity);
        this.semiG = new AppA_TestA_SemiG(entity);
        this.pathG = new AppA_TestA_PathG(entity);
    }

    async createRunAndDisplay() {
        return this.runAndDisplay(this.createTests());
    }

    async runAndDisplay(tests : Array<Entity>) {
        this.appA.uiA.content.listA.jsList = [];
        let testResults : TestResults = await this.run(tests);
        if (testResults.failed.length > 0) {
            await this.appA.uiA.content.listA.add(this.appA.unboundG.createTextWithList('failed tests (' + testResults.failed.length + ')',
                ...testResults.failed));
        }
        await this.appA.uiA.content.listA.add(
            this.appA.unboundG.createCollapsible('successful tests (' + testResults.successful.length + ')',
                ...testResults.successful),
            this.appA.unboundG.createText(''),
            this.appA.unboundG.createText('Note: There are also (old) tests which can be run with JUnit/Vitest.'));
        await this.appA.uiA.content.updateUi();
    }

    async run(tests : Array<Entity>) : Promise<TestResults> {
        let testResults = new TestResults();
        for (let test of tests) {
            let success;
            try {
                success = await test.action();
            } catch (error) {
                success = false;
                test.test_result_error = error;
                test.test_result = false;
            }
            if (success) {
                testResults.successful.push(test);
            } else {
                testResults.failed.push(test);
            }
        }
        return testResults;
    }

    createTest(name: string, action: (test: Entity) => Promise<any>) : Entity {
        let test = this.appA.unboundG.createText(name);
        test.isTest = true;
        test.action = async () => {
            test.test_result = await action(test) !== false;
            return test.test_result;
        }
        return test;
    }

    createFailingDemoTest(): Entity {
        return this.createTest('failing demo test (don\'t worry - this test always fails)', async test => {
            test.test_app = await this.appA.createStarter().createAppWithUIWithCommands_editable_updateUi();
            test.test_app.appA.logG.toListOfStrings = true;
            test.test_app.log('a dummy log');
            throw new Error('demo error in test');
        });
    }

    createTests() : Array<Entity> {
        let tests = [
            this.createTest('environment_createApp', async test => {
                let environment = new Environment();

                let app = environment.createApp();

                return app.appA.environment === environment;
            }),
            this.createTest('tester', async test => {
                let tester = await this.appA.createStarter().createTest();

                let testResults : TestResults = await tester.appA.testA.run([tester.appA.testA.createFailingDemoTest()]);

                let dummyTestRun = testResults.failed.at(0);
                return dummyTestRun.test_result_error.toString().includes('demo error in test') &&
                    dummyTestRun.test_app.appA.logG.listOfStrings.join().includes('a dummy log') &&
                    testResults.successful.length == 0;
            }),
            this.createTest('export', async test => {
                let app = this.appA.createStarter().createApp();
                test.test_app = app;
                app.appA.logG.toListOfStrings = true;
                let container = app.appA.unboundG.createTextWithList('the container');
                container.installContainerA();
                app.appA.currentContainer = container;
                let subitemAndContained = await app.appA.createText('subitem + contained');
                await container.listA.add(subitemAndContained);

                let exported = await container.export();

                app.log('exported: ' + JSON.stringify(exported, null, 4));
                return exported.text === 'the container' &&
                    exported.list.length === 1 &&
                    exported.objects[exported.list[0][0].toString()].text === 'subitem + contained';
            }),
            this.createTest('createFromJson', async test => {
                let app = this.appA.createStarter().createApp();
                test.test_app = app;
                app.appA.logG.toListOfStrings = true;
                let json = {text: 'container + parent', list: [['0']], objects: {'0': {text: 'contained + subitem'}}};

                let container = app.appA.unboundG.createFromJson(json);

                let containedAndSub = await container.listA.getResolved(0);
                return container.text === 'container + parent' &&
                    containedAndSub.text === 'contained + subitem' &&
                    containedAndSub.container === container &&
                    containedAndSub.name === container.containerA.mapNameEntity.keys().next().value &&
                    container.listA.jsList.at(0).pathA;
            }),
            this.createTest('createFromJson (testData)', async test => {
                let app = this.appA.createStarter().createApp();
                test.test_app = app;
                app.appA.logG.toListOfStrings = true;
                let json = testData;

                let container = app.appA.unboundG.createFromJson(json);

                return container.text === 'demo website (container)';
            }),
            this.createTest('create random string', async test => {
                test.test_app = this.appA.createStarter().createApp();
                let app = test.test_app;
                app.appA.logG.toListOfStrings = true;
                return createRandomString().length == 10 &&
                    createRandomString() != createRandomString();
            }),
            this.createTest('list_insertObjectAtPosition', async test => {
                test.test_app = this.appA.createStarter().createApp();
                let app = test.test_app;
                app.appA.logG.toListOfStrings = true;
                let list : Entity = await app.appA.createList();
                let listItem : Entity = await app.appA.createText('subitem');

                await list.listA.insertObjectAtPosition(listItem, 0);

                app.log('path = ' + list.listA.jsList.at(0).getShortDescription());
                return await list.resolve(list.listA.jsList.at(0)) === listItem;
            }),
            this.createTest('list_findByText', async test => {
                test.test_app = this.appA.createStarter().createApp();
                let app = test.test_app;
                app.appA.logG.toListOfStrings = true;
                let list : Entity = await app.appA.createList();
                let subitem = await app.appA.createText('findMe');
                await list.listA.add(subitem);

                let found = await list.listA.findByText('findMe');

                assert_sameAs(found, subitem);
            }),
            this.createTest('createStarter', async test => {
                let starterApplication = new Entity();
                starterApplication.appA = new AppA(starterApplication);
                starterApplication.appA.environment = new Environment();
                starterApplication.text = 'starter app';

                let starter : StarterA = starterApplication.appA.createStarter();

                return starter && starter.entity.app === starterApplication;
            }),
            this.createTest('nullUndefined', async test => {
                test.test_app = this.appA.createStarter().createApp();
                let app = test.test_app;
                assert(nullUndefined(null));
                assert(nullUndefined(undefined));
                assert(!nullUndefined(42));
                assert(notNullUndefined(42));
            }),
            this.createTest('assert', async test => {
                try {
                    assert(false);
                } catch (throwable) {
                    let error = throwable as Error;
                    return error.message === 'AssertionError: condition must be fulfilled';
                }
                return false;
            }),
            this.createTest('assert_sameAs', async test => {
                try {
                    assert_sameAs(42, 43);
                } catch (throwable) {
                    let error = throwable as Error;
                    return error.message === 'AssertionError: 42 !== 43';
                }
                return false;
            }),
            this.createTest('assert_notSameAs', async test => {
                try {
                    assert_notSameAs(42, 42);
                } catch (throwable) {
                    let error = throwable as Error;
                    return error.message === 'AssertionError: 42 === 42';
                }
                return false;
            }),
            this.createTest('code', async test => {
                let app : Entity = this.appA.createStarter().createApp();
                let name = 'nameOfCode';

                let code : Entity = app.createCode(name, () => {
                    // do something
                });

                assert_sameAs(app.containerA.mapNameEntity.get(name), code);
            }),
            this.createTest('runTest', async () => {
                let app : Entity = this.appA.createStarter().createApp();
                let name = 'testName';
                let test : Entity = app.createCode(name, () => {
                    // test
                });

                let testRun : Entity = await test.testG_run();

                assert(testRun.testRunA.resultG_success);
                assert_sameAs(testRun.testRunA.test, test);
            }),
            this.createTest('runTest_withNestedTest', async () => {
                let app : Entity = this.appA.createStarter().createApp();
                let name = 'testName';
                let test : Entity = app.createCode(name, () => {});
                test.testG_installNestedTestsA();
                let nestedTest = test.testG_nestedTestsA.add('nestedTest', () => {});

                let testRun : Entity = await test.testG_run();

                assert(testRun.testRunA.resultG_success, 'testRun->success');
                assert_sameAs(testRun.testRunA.test, test);
                let nestedTestRun = await testRun.testRunA.nestedRuns.listA.getResolved(0);
                assert(nestedTestRun.testRunA.resultG_success, 'nestedTestRun->success');
                assert_sameAs(nestedTestRun.testRunA.test, nestedTest);
            }),
            this.createTest('runTest_withFailingNestedTest', async () => {
                let app : Entity = this.appA.createStarter().createApp();
                let test : Entity = app.createCode('foo', () => {});
                test.testG_installNestedTestsA();
                test.testG_nestedTestsA.add('nestedTest', () => {
                    assert(false);
                });

                let testRun : Entity = await test.testG_run();

                assertFalse(testRun.testRunA.resultG_success);
                assertFalse((await testRun.testRunA.nestedRuns.listA.getResolved(0)).testRunA.resultG_success);
            }),
            this.createTest('runTest_failing', async () => {
                let app : Entity = this.appA.createStarter().createApp();
                let name = 'testName';
                let test : Entity = app.createCode(name, (testRun : Entity) => {
                    assert(false);
                });

                let testRun : Entity = await test.testG_run();

                assertFalse(testRun.testRunA.resultG_success);
                assert_notSameAs(testRun.testRunA.resultG_error, undefined);
            }),
            ...this.pathG.createTests(),
            ...this.uiG.createTests(),
            ...this.modelG.createTests(),
            ...this.semiG.createTests()
        ];
        if (this.withFailingDemoTest) {
            tests.push(this.createFailingDemoTest());
        }
        return tests;
    }
}