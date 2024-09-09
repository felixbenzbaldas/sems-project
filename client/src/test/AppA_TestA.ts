import type {Entity} from "@/Entity";
import {Starter} from "@/Starter";
import type {AppA} from "@/core/AppA";

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
        this.appA.ui.content.list.jsList = [];
        let testResults : TestResults = await this.run(tests);
        if (testResults.failed.length > 0) {
            await this.appA.ui.content.list.add(this.appA.simple_createTextWithList('FAILED',
                ...testResults.failed));
        }
        await this.appA.ui.content.list.add(
            this.appA.simple_createTextWithList('successful tests: ' + testResults.successful.length),
            this.appA.simple_createText(''),
            this.appA.simple_createTextWithList('specifications',
                this.appA.simple_createText('Can show failing demo test.'),
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
                test.log('error: ' + error);
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
            this.test('create application', async test => {
                let app = Starter.createApp();

                return app.text === 'Sems application';
            }),
            this.test('test', async test => {
                let tester = await Starter.createTest();

                let testResults : TestResults = await tester.appA.testA.run([tester.appA.testA.test('dummyTestWithError', async () => {
                    throw 'testError';
                })]);

                return testResults.failed.at(0).test_result_error === 'testError' &&
                    testResults.successful.length == 0;
            }),
            ...this.createUiTests(),
            ...this.createGuiTests()
        ];
        if (this.withFailingDemoTest) {
            tests.push(this.test('failing demo test (don\'t worry - this test always fails)', async test => {
                throw 'demo error in test';
            }));
        }
        return tests;
    }

    test(name: string, action: (test: Entity) => Promise<any>) : Entity {
        let test = this.appA.simple_createText(name);
        test.action = async () => {
            test.test_result = await action(test);
            return test.test_result;
        }
        return test;
    }

    createUiTests() {
        return [
            this.test('ui_makeCollapsible', async test => {
                let app = Starter.createAppWithUI();
                await app.appA.ui.globalEvent_defaultAction();

                await app.appA.ui.globalEvent_toggleCollapsible();

                return (await app.appA.ui.content.list.getObject(0)).collapsible;
            }),
            this.test('ui_collapse', async test => {
                let app = Starter.createAppWithUI();
                await app.appA.ui.globalEvent_defaultAction();
                await app.appA.ui.globalEvent_toggleCollapsible();
                await app.appA.ui.globalEvent_newSubitem();
                let firstObject = await app.appA.ui.content.list.getObject(0);
                app.appA.ui.focused = firstObject;

                await app.appA.ui.globalEvent_toggleCollapsed();

                return firstObject.collapsed;
            }),
            this.test('ui_collapsible', async test => {
                let app = Starter.createAppWithUI();
                let collapsible = app.appA.simple_createCollapsible('', app.appA.simple_createText(''));

                await collapsible.update();

                return collapsible.collapsed;
            }),
            this.test('ui_newSubitem', async test => {
                let app = Starter.createAppWithUI();
                await app.appA.ui.globalEvent_defaultAction();

                await app.appA.ui.globalEvent_newSubitem();

                let firstObject = await app.appA.ui.content.list.getObject(0);
                return firstObject.list.jsList.length == 1
                    && (await firstObject.list.getObject(0)).text === '';
            })]
    }

    createGuiTests() {
        return [
            this.test('gui_objectCreation', async test => {
                let app = await Starter.createAppWithUIWithCommands();
                await app.update();

                return app.guiG.getRawText().includes('default action');
            }),
            this.test('gui_newSubitem', async test => {
                let app = await Starter.createAppWithUIWithCommands();
                await app.update();
                await app.appA.ui.globalEvent_defaultAction();

                await app.guiG.click('new subitem');

                let firstObject = await app.appA.ui.content.list.getObject(0);
                return firstObject.list.jsList.length == 1;
            }),
            this.test('gui_makeCollapsible', async test => {
                let app = await Starter.createAppWithUIWithCommands();
                await app.appA.ui.globalEvent_defaultAction();

                await app.guiG.click('toggle collapsible');

                return (await app.appA.ui.content.list.getObject(0)).collapsible;
            }),
            this.test('gui_collapsed', async test => {
                let app = await Starter.createAppWithUIWithCommands();
                await app.appA.ui.globalEvent_defaultAction();
                await app.appA.ui.globalEvent_newSubitem();
                let firstObject = await app.appA.ui.content.list.getObject(0);
                await (await firstObject.list.getObject(0))
                    .setText('do-not-show-me');
                firstObject.collapsible = true;
                firstObject.collapsed = true;
                await firstObject.update();

                let rawText = app.guiG.getRawText();

                return !rawText.includes('do-not-show-me');
            }),
            this.test('gui_clickOnStaticText', async test => {
                let app = await Starter.createAppWithUIWithCommands();
                await app.appA.ui.globalEvent_defaultAction();
                await app.appA.ui.globalEvent_newSubitem();
                let firstObject = await app.appA.ui.content.list.getObject(0);
                firstObject.text = 'clickMe';
                firstObject.editable = false;
                firstObject.collapsible = true;
                firstObject.collapsed = true;
                await firstObject.update();

                await app.guiG.click('clickMe');

                return !firstObject.collapsed;
            }),
            this.test('gui_test', async test => {
                let tester = await Starter.createTest();

                await tester.appA.testA.runAndDisplay([
                    tester.appA.testA.test('dummyTestWithError', async ()=> {
                        throw 'testError';
                    })
                ]);

                let rawText = tester.guiG.getRawText();
                return rawText.includes('FAILED') &&
                    rawText.includes('dummyTestWithError') &&
                    rawText.includes('testError') &&
                    rawText.includes('successful tests:') &&
                    rawText.includes('0');
            })
        ];
    }
}