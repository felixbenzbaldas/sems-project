import {Entity} from "@/Entity";
import {AppA} from "@/AppA";
import {AppA_TestA_UiG} from "@/test/old-tester/AppA_TestA_UiG";
import {AppA_TestA_ModelG} from "@/test/old-tester/AppA_TestA_ModelG";
import {AppA_TestA_SemiG} from "@/test/old-tester/AppA_TestA_SemiG";

class TestResults {
    successful : Array<Entity> = [];
    failed : Array<Entity> = [];
}

export class AppA_TestA {

    private readonly appA : AppA;
    readonly uiG: AppA_TestA_UiG;
    readonly modelG: AppA_TestA_ModelG;
    readonly semiG: AppA_TestA_SemiG;
    withFailingDemoTest: boolean;

    constructor(private entity : Entity) {
        this.appA = entity.appA;
        this.uiG = new AppA_TestA_UiG(entity);
        this.modelG = new AppA_TestA_ModelG(entity);
        this.semiG = new AppA_TestA_SemiG(entity);
    }

    async createRunAndDisplay() {
        return this.runAndDisplay(this.createTests());
    }

    async runAndDisplay(tests : Array<Entity>) {
        // this.appA.uiA.content.listA.jsList = [];
        // let testResults : TestResults = await this.run(tests);
        // if (testResults.failed.length > 0) {
        //     this.appA.uiA.content.listA.addDirect(this.appA.unboundG.createTextWithList('failed tests (' + testResults.failed.length + ')',
        //         ...testResults.failed));
        // }
        // this.appA.uiA.content.listA.addDirect(
        //     this.appA.unboundG.createCollapsible('successful tests (' + testResults.successful.length + ')',
        //         ...testResults.successful),
        //     this.appA.unboundG.createText(''),
        //     this.appA.unboundG.createText('Note: There are also (old) tests which can be run with JUnit/Vitest.'));
        // await this.appA.uiA.content.updateUi();
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

    // createFailingDemoTest(): Entity {
        // return this.createTest('failing demo test (don\'t worry - this test always fails)', async test => {
        //     test.test_app = await this.appA.createStarter().createAppWithUIWithCommands_editable_updateUi();
        //     test.test_app.appA.logG.toListOfStrings = true;
        //     test.test_app.log('a dummy log');
        //     throw new Error('demo error in test');
        // });
    // }

    createTests() : Array<Entity> {
        // let tests = [
            // this.createTest('tester', async test => {
            //     let tester = await this.appA.createStarter().createTest();
            //
            //     let testResults : TestResults = await tester.appA.testA.run([tester.appA.testA.createFailingDemoTest()]);
            //
            //     let dummyTestRun = testResults.failed.at(0);
            //     return dummyTestRun.test_result_error.toString().includes('demo error in test') &&
            //         dummyTestRun.test_app.appA.logG.listOfStrings.join().includes('a dummy log') &&
            //         testResults.successful.length == 0;
            // }),
            // ...this.uiG.createTests(),
            // ...this.modelG.createTests(),
            // ...this.semiG.createTests()
        // ];
        // if (this.withFailingDemoTest) {
        //     tests.push(this.createFailingDemoTest());
        // }
        // return tests;
        return undefined;
    }
}