import {StarterA} from "@/StarterA";
import type {Entity} from "@/Entity";
import {Environment} from "@/Environment";
import {websiteData} from "@/website-data";

export class AppA_TestA_ModelG {

    constructor(private entity: Entity) {
    }

    createTests() {
        return [
            this.createTest('modelTest_objectCreation', async test => {
                test.test_app = await this.entity.appA.createStarter().createAppWithUIWithCommands_editable_updateUi();

                return test.test_app.uiA.getRawText().includes('default action');
            }),
            this.createTest('modelTest_newSubitem', async test => {
                let app = await this.entity.appA.createStarter().createAppWithUIWithCommands_editable_updateUi();
                await app.updateUi();
                await app.appA.uiA.globalEventG.defaultAction();

                await app.uiA.click('new subitem');

                let firstObject = await app.appA.uiA.content.list.getObject(0);
                return firstObject.list.jsList.length == 1;
            }),
            this.createTest('modelTest_makeCollapsible', async test => {
                let app = await this.entity.appA.createStarter().createAppWithUIWithCommands_editable_updateUi();
                await app.appA.uiA.globalEventG.defaultAction();

                await app.uiA.click('toggle collapsible');

                return (await app.appA.uiA.content.list.getObject(0)).collapsible;
            }),
            this.createTest('modelTest_collapsed', async test => {
                let app = await this.entity.appA.createStarter().createAppWithUIWithCommands_editable_updateUi();
                await app.appA.uiA.globalEventG.defaultAction();
                await app.appA.uiA.globalEventG.newSubitem();
                let firstObjectUi = app.appA.uiA.content.uiA.listG.uisOfListItems.at(0);
                let firstObject = firstObjectUi.uiA.object;
                (await firstObject.list.getObject(0)).text = 'do-not-show-me';
                firstObject.collapsible = true;
                firstObjectUi.collapsed = true;
                await firstObjectUi.uiA.update();

                let rawText = app.uiA.getRawText();

                return !rawText.includes('do-not-show-me');
            }),
            this.createTest('modelTest_click_nonEditableText', async test => {
                let app = await this.entity.appA.createStarter().createAppWithUIWithCommands_editable_updateUi();
                await app.appA.uiA.globalEventG.defaultAction();
                await app.appA.uiA.globalEventG.newSubitem();
                let firstObjectUi = app.appA.uiA.content.uiA.listG.uisOfListItems.at(0);
                let firstObject = firstObjectUi.uiA.object;
                firstObject.text = 'clickMe';
                firstObject.editable = false;
                firstObject.collapsible = true;
                await firstObjectUi.uiA.update();

                await app.uiA.click('clickMe');

                return app.appA.uiA.content.uiA.listG.uisOfListItems.at(0).collapsed === false;
            }),
            this.createTest('modelTest_tester', async test => {
                let tester = await this.entity.appA.createStarter().createTest();
                test.test_app = tester;
                tester.appA.logG.toListOfStrings = true;

                await tester.appA.testA.runAndDisplay([
                    tester.appA.testA.createFailingDemoTest(),
                    tester.appA.testA.createTest('aSuccessfulTest', async () => {
                        return true;
                    })
                ]);

                await tester.uiA.click('failed with');
                await tester.uiA.click('ui');
                await tester.uiA.click('log');
                await tester.uiA.click('successful tests')
                let rawText = tester.uiA.getRawText();
                return rawText.includes('failed tests') &&
                    rawText.includes('failing demo test') &&
                    rawText.includes('stacktrace') &&
                    rawText.includes('demo error in test') &&
                    rawText.includes('a dummy log') &&
                    rawText.includes('default action') &&
                    rawText.includes('successful tests') &&
                    rawText.includes('aSuccessfulTest');
            }),
            this.createTest('modelTest_website', async test => {
                let environment = new Environment();
                environment.jsonData = websiteData;
                let website = await environment.createApp().appA.createStarter().createWebsite();
                test.test_app = website;
                website.appA.logG.toListOfStrings = true;

                await website.uiA.update();

                let rawText = website.uiA.getRawText();
                return !rawText.includes('demo website (container)') &&
                    rawText.includes('collapsible parent') &&
                    rawText.includes('subitem') &&
                    rawText.includes('Home');
            }),
            this.createTest('modelTest_objectViewer', async test => {
                let environment = new Environment();
                environment.jsonData = websiteData;
                let objectViewer = await environment.createApp().appA.createStarter().createObjectViewer('2'); // see const websiteData
                test.test_app = objectViewer;
                objectViewer.appA.logG.toListOfStrings = true;
                let rawText = objectViewer.uiA.getRawText();
                test.test_app.log(rawText);
                return rawText === 'collapsible parentsubitem' && test.test_app.uiA.countEditableTexts() === 0;
            }),
            this.createTest('modelTest_cut', async test => {
                let app = await this.entity.appA.createStarter().createAppWithUIWithCommands_editable_updateUi();
                test.test_app = app;
                app.appA.logG.toListOfStrings = true;
                await app.appA.uiA.globalEventG.defaultAction();
                let firstObject = await app.appA.uiA.content.list.getObject(0);
                firstObject.text = 'cutted';
                await app.updateUi();

                await app.uiA.click('cut');

                let rawText = app.uiA.getRawText();
                app.log('rawText = ' + rawText);
                return !rawText.includes('cutted');
            }),
            this.createTest('modelTest_pasteNext', async test => {
                let app = await this.entity.appA.createStarter().createAppWithUIWithCommands_editable_updateUi();
                test.test_app = app;
                app.appA.logG.toListOfStrings = true;
                await app.appA.uiA.globalEventG.defaultAction();
                let firstObject = await app.appA.uiA.content.list.getObject(0);
                firstObject.text = 'first object';
                app.appA.uiA.clipboard = await app.appA.createText('pasted object');
                await app.uiA.click('paste next');

                let rawText = app.uiA.getRawText();
                app.log('rawText = ' + rawText);
                return rawText.includes('pasted object');
            }),
            this.createTest('modelTest_extraUiForText', async test => {
                let app = this.entity.appA.createStarter().createAppWithUI();
                test.test_app = app;
                app.appA.logG.toListOfStrings = true;
                let object = app.appA.unboundG.createText('foo');
                let ui : Entity = app.appA.uiA.createUiFor(object);
                await object.uis_update();

                let rawText = ui.uiA.getRawText();

                app.log('raw text = ' + rawText);
                return rawText === 'foo';
            })
        ];
    }

    private createTest(name: string, testAction: (test: Entity) => Promise<any>) {
        return this.entity.appA.testA.createTest(name, testAction);
    }
}