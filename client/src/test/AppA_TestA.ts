import type {Entity} from "@/Entity";
import {Starter} from "@/Starter";
import type {AppA} from "@/core/AppA";
import {setCaret} from "@/utils";

class TestResults {
    successful : Array<Entity> = [];
    failed : Array<Entity> = [];
}

export class AppA_TestA {

    private readonly appA : AppA;
    withFailingDemoTest: boolean;

    constructor(private entity : Entity) {
        this.appA = entity.appA;
    }

    async createRunAndDisplay() {
        return this.runAndDisplay(this.createTests());
    }

    async runAndDisplay(tests : Array<Entity>) {
        this.appA.uiA.content.list.jsList = [];
        let testResults : TestResults = await this.run(tests);
        if (testResults.failed.length > 0) {
            await this.appA.uiA.content.list.addAndUpdateUi(this.appA.simple_createTextWithList('FAILED',
                ...testResults.failed));
        }
        await this.appA.uiA.content.list.addAndUpdateUi(
            this.appA.simple_createTextWithList('successful tests: ' + testResults.successful.length),
            this.appA.simple_createText(''),
            this.appA.simple_createTextWithList('specifications',
                this.appA.simple_createText('A collapsed item has the icon [...].'),
            ));
    }

    async run(tests : Array<Entity>) : Promise<TestResults> {
        let testResults = new TestResults();
        for (let test of tests) {
            let success;
            try {
                success = await test.action();
            } catch (error) {
                success = false;
                test.test_result_error = error.toString();
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

    createTests() : Array<Entity> {
        let tests = [
            this.createTest('create application', async test => {
                let app = Starter.createApp();

                return app.text === 'easy application';
            }),
            this.createTest('tester', async test => {
                let tester = await Starter.createTest();

                let testResults : TestResults = await tester.appA.testA.run([tester.appA.testA.createTest('dummyTestWithError', async dummyTest => {
                    dummyTest.test_app = Starter.createApp();
                    dummyTest.test_app.appA.logG.toListOfStrings = true;
                    dummyTest.test_app.log('dummyLog');
                    throw 'testError';
                })]);

                let dummyTestRun = testResults.failed.at(0);
                return dummyTestRun.test_result_error === 'testError' &&
                    dummyTestRun.test_app.appA.logG.listOfStrings.join().includes('dummyLog') &&
                    testResults.successful.length == 0;
            }),
            ...this.createUiTests(),
            ...this.createModelTests(),
            ...this.createSemiAutomatedTests()
        ];
        if (this.withFailingDemoTest) {
            tests.push(this.createTest('failing demo test (don\'t worry - this test always fails)', async test => {
                test.test_app = await Starter.createAppWithUIWithCommands_updateUi();
                test.test_app.appA.logG.toListOfStrings = true;
                test.test_app.log('a dummy log');
                throw 'demo error in test';
            }));
        }
        return tests;
    }

    createTest(name: string, action: (test: Entity) => Promise<any>) : Entity {
        let test = this.appA.simple_createText(name);
        test.isTest = true;
        test.action = async () => {
            test.test_result = await action(test);
            return test.test_result;
        }
        return test;
    }

    createUiTests() {
        return [
            this.createTest('ui_makeCollapsible', async test => {
                let app = Starter.createAppWithUI();
                await app.appA.uiA.globalEventG.defaultAction();

                await app.appA.uiA.globalEventG.toggleCollapsible();

                return (await app.appA.uiA.content.list.getObject(0)).collapsible;
            }),
            this.createTest('ui_collapse', async test => {
                let app = Starter.createAppWithUI();
                await app.appA.uiA.globalEventG.defaultAction();
                await app.appA.uiA.globalEventG.toggleCollapsible();
                await app.appA.uiA.globalEventG.newSubitem();
                let firstObject = await app.appA.uiA.content.list.getObject(0);
                app.appA.uiA.focused = firstObject;

                await app.appA.uiA.globalEventG.expandOrCollapse();

                return firstObject.collapsed;
            }),
            this.createTest('ui_collapsible', async test => {
                let app = Starter.createAppWithUI();
                let collapsible = app.appA.simple_createCollapsible('', app.appA.simple_createText(''));

                await collapsible.updateUi();

                return collapsible.collapsed;
            }),
            this.createTest('ui_newSubitem', async test => {
                let app = Starter.createAppWithUI();
                await app.appA.uiA.globalEventG.defaultAction();

                await app.appA.uiA.globalEventG.newSubitem();

                let firstObject = await app.appA.uiA.content.list.getObject(0);
                return firstObject.list.jsList.length == 1
                    && (await firstObject.list.getObject(0)).text === '';
            })
        ]
    }

    createModelTests() {
        return [
            this.createTest('modelTest_objectCreation', async test => {
                test.test_app = await Starter.createAppWithUIWithCommands_updateUi();

                return test.test_app.uiG.getRawText().includes('default action');
            }),
            this.createTest('modelTest_newSubitem', async test => {
                let app = await Starter.createAppWithUIWithCommands_updateUi();
                await app.updateUi();
                await app.appA.uiA.globalEventG.defaultAction();

                await app.uiG.click('new subitem');

                let firstObject = await app.appA.uiA.content.list.getObject(0);
                return firstObject.list.jsList.length == 1;
            }),
            this.createTest('modelTest_makeCollapsible', async test => {
                let app = await Starter.createAppWithUIWithCommands_updateUi();
                await app.appA.uiA.globalEventG.defaultAction();

                await app.uiG.click('toggle collapsible');

                return (await app.appA.uiA.content.list.getObject(0)).collapsible;
            }),
            this.createTest('modelTest_collapsed', async test => {
                let app = await Starter.createAppWithUIWithCommands_updateUi();
                await app.appA.uiA.globalEventG.defaultAction();
                await app.appA.uiA.globalEventG.newSubitem();
                let firstObject = await app.appA.uiA.content.list.getObject(0);
                (await firstObject.list.getObject(0)).text = 'do-not-show-me';
                firstObject.collapsible = true;
                firstObject.collapsed = true;
                await app.uiG.update();

                let rawText = app.uiG.getRawText();

                return !rawText.includes('do-not-show-me');
            }),
            this.createTest('modelTest_clickOnStaticText', async test => {
                let app = await Starter.createAppWithUIWithCommands_updateUi();
                await app.appA.uiA.globalEventG.defaultAction();
                await app.appA.uiA.globalEventG.newSubitem();
                let firstObject = await app.appA.uiA.content.list.getObject(0);
                firstObject.text = 'clickMe';
                firstObject.editable = false;
                firstObject.collapsible = true;
                firstObject.collapsed = true;
                await firstObject.updateUi();

                await app.uiG.click('clickMe');

                return !firstObject.collapsed;
            }),
            this.createTest('modelTest_tester', async test => {
                let tester = await Starter.createTest();
                test.test_app = tester;
                tester.appA.logG.toListOfStrings = true;

                await tester.appA.testA.runAndDisplay([
                    tester.appA.testA.createTest('dummyTestWithError', async dummyTest => {
                        dummyTest.test_app = await Starter.createAppWithUIWithCommands_updateUi();
                        dummyTest.test_app.appA.logG.toListOfStrings = true;
                        dummyTest.test_app.log('dummyLog');
                        throw 'testError';
                    })
                ]);

                await tester.uiG.click('ui');
                await tester.uiG.click('log');
                let rawText = tester.uiG.getRawText();
                return rawText.includes('FAILED') &&
                    rawText.includes('dummyTestWithError') &&
                    rawText.includes('testError') &&
                    rawText.includes('dummyLog') &&
                    rawText.includes('default action') &&
                    rawText.includes('successful tests:') &&
                    rawText.includes('0');
            }),
        ];
    }

    createSemiAutomatedTests() {
        return [
            this.createTest('semiAutomatedTest_html', async test => {
                test.test_app = await Starter.createAppWithUIWithCommands_updateUi();
                let html = test.test_app.appA.createEntityWithApp();
                html.dangerous_html = document.createElement('div');
                html.dangerous_html.innerText = 'show me';
                await test.test_app.appA.uiA.content.list.addAndUpdateUi(html);
                test.test_app.appA.logG.toListOfStrings = true;
                test.test_app.log('human-test: the text "show me" appears');
                return true;
            }),
            this.createTest('semiAutomatedTest_setCaret', async test => {
                test.test_app = await Starter.createAppWithUIWithCommands_updateUi();
                let html = test.test_app.appA.createEntityWithApp();
                html.dangerous_html = document.createElement('div');
                html.dangerous_html.innerText = 'test';
                html.dangerous_html.contentEditable = 'true';
                html.dangerous_html.style.margin = '1rem';
                await test.test_app.appA.uiA.content.list.addAndUpdateUi(html, test.test_app.appA.simple_createButton('setCaret', () => {

                    setCaret(html.dangerous_html, 2);

                }));
                test.test_app.appA.logG.toListOfStrings = true;
                test.test_app.log('human-test: when clicking the button, the caret is set to the middle of the word "test"');
                return true;
            }),
            this.createTest('semiAutomatedTest_cursorStyle', async test => {
                test.test_app = await Starter.createAppWithUIWithCommands_updateUi();
                let appA = test.test_app.appA;
                await appA.uiA.globalEventG.defaultAction();
                await appA.uiA.globalEventG.toggleCollapsible();
                await appA.uiA.globalEventG.newSubitem();
                appA.logG.toListOfStrings = true;
                test.test_app.log('human-test: cursor style on collapsible object (outside text): pointer');
                test.test_app.log('human-test: cursor style on non-collapsible object (outside text): default');
                test.test_app.log('human-test: cursor style on editable text: text');
                test.test_app.log('human-test: cursor style on non-editable, non-collapsible text: default');
                test.test_app.log('human-test: cursor style on non-editable, collapsible text: pointer');
                return true;
            })
        ];
    }
}