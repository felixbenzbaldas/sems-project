import type {Entity} from "@/Entity";
import {Starter} from "@/Starter";
import type {AppA} from "@/core/AppA";
import {setCaret} from "@/utils";
import {ContainerA} from "@/core/ContainerA";
import {websiteData} from "@/website-data";

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
            await this.appA.uiA.content.list.addAndUpdateUi(this.appA.unboundG.createTextWithList('failed tests (' + testResults.failed.length + ')',
                ...testResults.failed));
        }
        await this.appA.uiA.content.list.addAndUpdateUi(
            this.appA.unboundG.createCollapsible('successful tests (' + testResults.successful.length + ')',
                ...testResults.successful),
            this.appA.unboundG.createText(''),
            this.appA.unboundG.createText('Note: There are also (old) tests which can be run with JUnit/Vitest.'));
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

    createTests() : Array<Entity> {
        let tests = [
            this.createTest('create application', async test => {
                let app = Starter.createApp();

                return app.text === 'easy application';
            }),
            this.createTest('tester', async test => {
                let tester = await Starter.createTest();

                let testResults : TestResults = await tester.appA.testA.run([tester.appA.testA.createFailingDemoTest()]);

                let dummyTestRun = testResults.failed.at(0);
                return dummyTestRun.test_result_error.toString().includes('demo error in test') &&
                    dummyTestRun.test_app.appA.logG.listOfStrings.join().includes('a dummy log') &&
                    testResults.successful.length == 0;
            }),
            this.createTest('export', async test => {
                let app = Starter.createApp();
                test.test_app = app;
                app.appA.logG.toListOfStrings = true;
                let container = app.appA.unboundG.createTextWithList('the container');
                container.containerA = new ContainerA(container);
                app.appA.currentContainer = container;
                let subitemAndContained = await app.appA.createText('subitem + contained');
                await container.list.addAndUpdateUi(subitemAndContained);

                let exported = await container.export();

                app.log('exported: ' + JSON.stringify(exported, null, 4));
                return exported.text === 'the container' &&
                    exported.list.length === 1 &&
                    exported.objects[exported.list[0][0].toString()].text === 'subitem + contained';
            }),
            this.createTest('createFromJson', async test => {
                let app = Starter.createApp();
                test.test_app = app;
                app.appA.logG.toListOfStrings = true;
                let json = {text: 'container + parent', list: [['0']], objects: {'0': {text: 'contained + subitem'}}};

                let container = app.appA.unboundG.createFromJson(json);

                let containedAndSub = await container.list.getObject(0);
                return container.text === 'container + parent' &&
                    containedAndSub.text === 'contained + subitem' &&
                    containedAndSub.container === container &&
                    containedAndSub.name === container.containerA.mapNameEntity.keys().next().value &&
                    container.list.jsList.at(0).pathA;
            }),
            this.createTest('createFromJson (website-data)', async test => {
                let app = Starter.createApp();
                test.test_app = app;
                app.appA.logG.toListOfStrings = true;
                let json = websiteData;

                let container = app.appA.unboundG.createFromJson(json);

                return container.text === 'demo website';
            }),
            this.createTest('getPath of contained', async test => {
                test.test_app = Starter.createApp();
                let app = test.test_app;
                let text = await app.appA.createText('');

                let path: Entity = app.getPath(text);

                return path.pathA.listOfNames.length === 1 &&
                    path.pathA.listOfNames.at(0) === text.name;
            }),
            this.createTest('getPath of contained of contained', async test => {
                test.test_app = Starter.createApp();
                let app = test.test_app;
                app.appA.logG.toListOfStrings = true;
                let container = await app.appA.createText('container');
                container.containerA = new ContainerA(container);
                let containedContained = await container.containerA.createText('containedContained');

                let path: Entity = app.getPath(containedContained);

                return path.pathA.listOfNames.length === 2 &&
                    path.pathA.listOfNames.at(0) === container.name &&
                    path.pathA.listOfNames.at(1) === containedContained.name;
            }),
            this.createTest('getPath of container', async test => {
                test.test_app = Starter.createApp();
                let app = test.test_app;
                let text = await app.appA.createText('');

                let path: Entity = text.getPath(app);

                return path.pathA.listOfNames.length === 1 &&
                    path.pathA.listOfNames.at(0) === '..';
            }),
            this.createTest('getPath of contained of contained of container', async test => {
                test.test_app = Starter.createApp();
                let app = test.test_app;
                app.appA.logG.toListOfStrings = true;
                let container = await app.appA.createText('container');
                container.containerA = new ContainerA(container);
                let containedContained = await container.containerA.createText('containedContained');
                let text = await app.appA.createText('foo');

                let path: Entity = text.getPath(containedContained);

                return path.pathA.listOfNames.length === 3 &&
                    path.pathA.listOfNames.at(0) === '..' &&
                    path.pathA.listOfNames.at(1) === container.name &&
                    path.pathA.listOfNames.at(2) === containedContained.name;
            }),
            this.createTest('getPath of container (which has a container itself)', async test => {
                test.test_app = Starter.createApp();
                let app = test.test_app;
                app.appA.logG.toListOfStrings = true;
                let container = await app.appA.createText('container');
                container.containerA = new ContainerA(container);
                let containedContained = await container.containerA.createText('containedContained');
                let text = await app.appA.createText('foo');

                let path: Entity = containedContained.getPath(container);

                return path.pathA.listOfNames.length === 1 &&
                    path.pathA.listOfNames.at(0) === '..';
            }),
            ...this.createUiTests(),
            ...this.createModelTests(),
            ...this.createSemiAutomatedTests()
        ];
        if (this.withFailingDemoTest) {
            tests.push(this.createFailingDemoTest());
        }
        return tests;
    }

    createTest(name: string, action: (test: Entity) => Promise<any>) : Entity {
        let test = this.appA.unboundG.createText(name);
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
                let collapsible = app.appA.unboundG.createCollapsible('', app.appA.unboundG.createText(''));

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
            }),
            this.createTest('ui_switchCurrentContainer', async test => {
                let app = Starter.createAppWithUI();
                await app.appA.uiA.globalEventG.defaultAction();

                await app.appA.uiA.globalEventG.switchCurrentContainer();

                return app.appA.currentContainer === app.appA.uiA.focused &&
                    app.appA.currentContainer.containerA;
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
                    tester.appA.testA.createFailingDemoTest(),
                    tester.appA.testA.createTest('aSuccessfulTest', async () => {
                        return true;
                    })
                ]);

                await tester.uiG.click('failed with');
                await tester.uiG.click('ui');
                await tester.uiG.click('log');
                await tester.uiG.click('successful tests')
                let rawText = tester.uiG.getRawText();
                return rawText.includes('failed tests') &&
                    rawText.includes('failing demo test') &&
                    rawText.includes('stacktrace') &&
                    rawText.includes('demo error in test') &&
                    rawText.includes('a dummy log') &&
                    rawText.includes('default action') &&
                    rawText.includes('successful tests') &&
                    rawText.includes('1') &&
                    rawText.includes('aSuccessfulTest');
            }),
            this.createTest('modelTest_website', async test => {
                let website = await Starter.createWebsite2();
                test.test_app = website;
                website.appA.logG.toListOfStrings = true;

                await website.uiG.update();

                let rawText = website.uiG.getRawText();
                return rawText.includes('demo website');
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
                await test.test_app.appA.uiA.content.list.addAndUpdateUi(html, test.test_app.appA.unboundG.createButton('setCaret', () => {

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
            }),
            this.createTest('semiAutomatedTest_expand/collapse', async test => {
                test.test_app = await Starter.createAppWithUIWithCommands_updateUi();
                let appA = test.test_app.appA;
                await appA.uiA.globalEventG.defaultAction();
                await appA.uiA.globalEventG.toggleCollapsible();
                await appA.uiA.globalEventG.newSubitem();
                appA.logG.toListOfStrings = true;
                test.test_app.log('human-test: expanded collapsible has the icon: _');
                test.test_app.log('human-test: collapsed collapsible has the icon: [...]');
                test.test_app.log('human-test: non-collapsible has no icon');
                return true;
            }),
            this.createTest('semiAutomatedTest_placeholderArea', async test => {
                test.test_app = await Starter.createAppWithUIWithCommands_updateUi();
                let appA = test.test_app.appA;
                let html = appA.createEntityWithApp();
                html.dangerous_html = document.createElement('div');
                html.dangerous_html.style.height = '15rem';
                html.dangerous_html.style.backgroundColor = 'gold';
                html.dangerous_html.style.width = '15rem';
                let collapsible = appA.unboundG.createCollapsible('scroll down and then collapse me', html);
                collapsible.collapsed = false;
                collapsible.editable = false;
                appA.uiA.content.list.jsList.push(collapsible);
                appA.logG.toListOfStrings = true;
                test.test_app.log('info: The placeholder-area is an area which is inserted at the bottom of the site. ' +
                    'It is necessary to avoid unwanted movements when collapsing a big item.');

                test.test_app.log('human-test: The content above the item never moves, when collapsing it.');
                test.test_app.log('human-test: When scrolling to the bottom, you still see a rest of the application-content');
                test.test_app.log('human-test: The placeholder-area adapts its size when resizing the window.');
                return true;
            }),
        ];
    }

    createFailingDemoTest(): Entity {
        return this.createTest('failing demo test (don\'t worry - this test always fails)', async test => {
            test.test_app = await Starter.createAppWithUIWithCommands_updateUi();
            test.test_app.appA.logG.toListOfStrings = true;
            test.test_app.log('a dummy log');
            throw new Error('demo error in test');
        });
    }
}