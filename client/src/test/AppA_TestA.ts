import type {Entity} from "@/Entity";
import {Starter} from "@/Starter";
import type {AppA} from "@/core/AppA";

export class AppA_TestA {

    private readonly appA : AppA;
    withFailingDemoTest: boolean;

    constructor(private entity : Entity) {
        this.appA = entity.appA;
    }

    async run() {
        this.appA.ui.content.list.jsList = [];
        let successCounter = 0;
        let failedTests = [];
        for (let test of this.createTests()) {
            let testResult;
            try {
                testResult = await test.action();
            } catch (error) {
                testResult = false;
                this.entity.log('error in test: ' + error);
            }
            if (testResult) {
                successCounter++;
            } else {
                failedTests.push(test);
            }
        }
        if (failedTests.length > 0) {
            await this.appA.ui.content.list.add(this.appA.simple_createTextWithList('FAILED',
                ...failedTests.map(test => this.appA.simple_createText(test.text))));
        }
        await this.appA.ui.content.list.add(
            this.appA.simple_createTextWithList('successful tests: ' + successCounter),
            this.appA.simple_createText(''),
            this.appA.simple_createTextWithList('specifications',
                this.appA.simple_createText('The tester shows this specification.'),
                this.appA.simple_createText('Can show failing demo test.')));
    }

    createTests() : Array<Entity> {
        let tests = [
            this.test('create application', async test => {
                let app = Starter.createApp();

                return app.text === 'Sems application';
            }),
            this.test('ui_makeCollapsible', async test => {
                let app = Starter.createAppWithUI();
                await app.appA.ui.globalEvent_defaultAction();

                await app.appA.ui.globalEvent_makeCollapsible();

                return (await app.appA.ui.content.list.getObject(0)).collapsible;
            }),
            this.test('ui_newSubitem', async test => {
                let app = Starter.createAppWithUI();
                await app.appA.ui.globalEvent_defaultAction();

                await app.appA.ui.globalEvent_newSubitem();

                let firstObject = await app.appA.ui.content.list.getObject(0);
                return firstObject.list.jsList.length == 1
                    && (await firstObject.list.getObject(0)).text === '';
            }),
            this.test('gui_objectCreation', async test => {
                let app = Starter.createAppWithUIWithCommands();
                await app.update();

                return app.guiG.getRawText().includes('default action');
            }),
            this.test('gui_newSubitem', async test => {
                let app = Starter.createAppWithUIWithCommands();
                await app.update();
                await app.appA.ui.globalEvent_defaultAction();

                await app.guiG.click('new subitem');

                let firstObject = await app.appA.ui.content.list.getObject(0);
                return firstObject.list.jsList.length == 1;
            })
        ];
        if (this.withFailingDemoTest) {
            tests.push(this.test('failing demo test (don\'t worry - this test always fails)', async test => {
                throw 'demo error in test';
            }));
        }
        return tests;
    }

    private test(name: string, action: (test: Entity) => Promise<any>) : Entity {
        let test = this.appA.simple_createText(name);
        test.action = async () => {
            return await action(test);
        }
        return test;
    }
}