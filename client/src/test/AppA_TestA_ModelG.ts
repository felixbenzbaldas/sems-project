import {Starter} from "@/Starter";
import type {Entity} from "@/Entity";

export class AppA_TestA_ModelG {

    constructor(private entity: Entity) {
    }

    createTests() {
        return [
            this.createTest('modelTest_objectCreation', async test => {
                test.test_app = await Starter.createAppWithUIWithCommands_updateUi();

                return test.test_app.uiA.getRawText().includes('default action');
            }),
            this.createTest('modelTest_newSubitem', async test => {
                let app = await Starter.createAppWithUIWithCommands_updateUi();
                await app.updateUi();
                await app.appA.uiA.globalEventG.defaultAction();

                await app.uiA.click('new subitem');

                let firstObject = await app.appA.uiA.content.list.getObject(0);
                return firstObject.list.jsList.length == 1;
            }),
            this.createTest('modelTest_makeCollapsible', async test => {
                let app = await Starter.createAppWithUIWithCommands_updateUi();
                await app.appA.uiA.globalEventG.defaultAction();

                await app.uiA.click('toggle collapsible');

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
                await app.uiA.update();

                let rawText = app.uiA.getRawText();

                return !rawText.includes('do-not-show-me');
            }),
            this.createTest('modelTest_click_nonEditableText', async test => {
                let app = await Starter.createAppWithUIWithCommands_updateUi();
                await app.appA.uiA.globalEventG.defaultAction();
                await app.appA.uiA.globalEventG.newSubitem();
                let firstObject = await app.appA.uiA.content.list.getObject(0);
                firstObject.text = 'clickMe';
                firstObject.editable = false;
                firstObject.collapsible = true;
                firstObject.collapsed = true;
                await firstObject.updateUi();

                await app.uiA.click('clickMe');

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
                let website = await Starter.createWebsite();
                test.test_app = website;
                website.appA.logG.toListOfStrings = true;

                await website.uiA.update();

                let rawText = website.uiA.getRawText();
                if (Starter.placeholderWebsite.startsWith('marker')) {
                    return !rawText.includes('demo website (container)') &&
                        rawText.includes('collapsible parent') &&
                        rawText.includes('subitem') &&
                        rawText.includes('Home');
                } else {
                    return true;
                }
            }),
            this.createTest('modelTest_objectViewer', async test => {
                let objectViewer = await Starter.createObjectViewer('3'); // see const websiteData
                test.test_app = objectViewer;
                objectViewer.appA.logG.toListOfStrings = true;
                await objectViewer.uiA.update();
                let rawText = objectViewer.uiA.getRawText();
                test.test_app.log(rawText);
                if (Starter.placeholderWebsite.startsWith('marker')) {
                    return rawText === 'subitem' && test.test_app.uiA.countEditableTexts() === 0;
                } else {
                    return true;
                }
            }),
        ];
    }

    private createTest(name: string, testAction: (test: Entity) => Promise<any>) {
        return this.entity.appA.testA.createTest(name, testAction);
    }
}