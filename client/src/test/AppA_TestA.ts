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
import {AppA_TestA_UiG} from "@/test/AppA_TestA_UiG";
import {AppA_TestA_ModelG} from "@/test/AppA_TestA_ModelG";
import {AppA_TestA_SemiG} from "@/test/AppA_TestA_SemiG";
import {AppA_TestA_PathG} from "@/test/AppA_TestA_PathG";
import {Environment} from "@/Environment";

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
            this.appA.uiA.content.listA.addDirect(this.appA.unboundG.createTextWithList('failed tests (' + testResults.failed.length + ')',
                ...testResults.failed));
        }
        this.appA.uiA.content.listA.addDirect(
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
                assert_sameAs(await list.listA.getResolved(0), listItem);
            }),
            this.createTest('createStarter', async test => {
                let starterApplication = new Entity();
                starterApplication.appA = new AppA(starterApplication);
                starterApplication.appA.environment = new Environment();
                starterApplication.text = 'starter app';

                let starter : StarterA = starterApplication.appA.createStarter();

                assert(notNullUndefined(starter));
                assert_sameAs(starter.entity.app, starterApplication);
            }),
            this.createTest('nullUndefined', async test => {
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
                    assert_sameAs(error.message, 'AssertionError: condition must be fulfilled');
                    return;
                }
                throw new Error();
            }),
            this.createTest('assert_sameAs', async test => {
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
            }),
            this.createTest('assert_notSameAs', async test => {
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
            }),
            this.createTest('code', async test => {
                let app : Entity = this.appA.createStarter().createApp();
                let name = 'nameOfCode';

                let code : Entity = app.createCode(name, () => {
                    // do something
                });

                assert_sameAs(app.containerA.mapNameEntity.get(name), code);
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