import type {Entity} from "@/Entity";
import type {StarterA} from "@/StarterA";
import {UiA} from "@/ui/UiA";
import {Color} from "@/ui/Color";
import {Font} from "@/ui/Font";

export class StarterA_FullStartG {
    constructor(public entity : Entity) {
    }
    async tester() {
        let starter = this.getStarter();
        starter.createTester(starter.getEnvironment().testCreator);
        starter.testMode();
        await starter.createdApp.appA.testerA.run();
        if (starter.isPublicWeb()) {
            starter.createdApp.appA.uiA.webMeta = await starter.createUnboundWebMeta();
        }
        let appUi = await starter.createdApp.appA.uiA.createAppUi(true);
        starter.getEnvironment().activeAppUi = appUi;
        return appUi.entity.uiA.htmlElement;
    }
    async objectViewer() {
        let starter = this.getStarter();
        starter.createAppWithUI();
        starter.createData();
        let pathString = starter.getEnvironment().url.searchParams.get('path');
        let listOfNames = ['..', starter.data.name, ...pathString.split('-')];
        await starter.createdApp.appA.uiA.content.listA.addByListOfNames(listOfNames);
        starter.createdApp.appA.uiA.theme_backgroundColor = Color.LIGHT_BEIGE;
        starter.createdApp.appA.uiA.theme_fontColor = Color.NEW_DARK_VIOLETTE;
        starter.createdApp.appA.uiA.theme_font = Font.ELEGANT;
        if (starter.isPublicWeb()) {
            starter.createdApp.appA.uiA.webMeta = await starter.createUnboundWebMeta();
        }
        let appUi = await starter.createdApp.appA.uiA.createAppUi(true);
        starter.testMode();
        starter.getEnvironment().activeAppUi = appUi;
        await appUi.contentUi.listG.uisOfListItems[0].uiA.ensureExpanded();
        return appUi.entity.uiA.htmlElement;
    }
    async testRun() {
        let starter = this.getStarter();
        await starter.run();
        if (starter.isPublicWeb()) {
            starter.createdApp.appA.uiA.webMeta = await starter.createUnboundWebMeta();
        }
        let appUi = await starter.createdApp.appA.uiA.createAppUi(true);
        starter.getEnvironment().activeAppUi = appUi;
        return appUi.entity.uiA.htmlElement;
    }
    async website() {
        let starter = this.getStarter();
        starter.createAppWithUI();
        starter.createdApp.appA.uiA.isWebsite = true;
        starter.createData();
        starter.createdApp.appA.uiA.theme_backgroundColor = Color.LIGHT_BEIGE;
        starter.createdApp.appA.uiA.theme_fontColor = Color.NEW_DARK_VIOLETTE;
        starter.createdApp.appA.uiA.theme_font = Font.ELEGANT;
        let website = await starter.data.listA.findByText(starter.hostname())
        let start = await website.listA.findByText('start');
        for (let resolved of await start.listA.getResolvedList()) {
            await starter.createdApp.appA.uiA.content.listA.add(resolved);
        }
        if (starter.getEnvironment().setTitle)  {
            starter.getEnvironment().setTitle((await (await website.listA.findByText('title'))?.listA.getResolved(0)).text);
        }
        starter.testMode();
        if (starter.isPublicWeb()) {
            starter.createdApp.appA.uiA.webMeta = await starter.createUnboundWebMeta();
        }
        let appUi = await starter.createdApp.appA.uiA.createAppUi(true);
        starter.getEnvironment().activeAppUi = appUi;
        let length = appUi.contentUi.listG.uisOfListItems.length;
        if (length === 1 || length === 2) {
            await appUi.contentUi.listG.uisOfListItems[0].uiA.ensureExpanded();
        }
        return appUi.entity.uiA.htmlElement;
    }
    async localApp() {
        let starter = this.getStarter();
        starter.createAppWithUI();
        starter.testMode();
        let appUi = await starter.createdApp.appA.uiA.createAppUi(true, true, true);
        starter.getEnvironment().activeAppUi = appUi;
        starter.getEnvironment().warningBeforeLossOfUnsavedChanges();
        return appUi.entity.uiA.htmlElement;
    }
    async clientApp() {
        let starter = this.getStarter();
        starter.createAppWithUI();
        starter.testMode();
        starter.createdApp.appA.uiA.webMeta = await starter.createUnboundWebMeta(); // important
        let appUi = await starter.createdApp.appA.uiA.createAppUi(true, true, true);
        starter.getEnvironment().activeAppUi = appUi;
        starter.getEnvironment().warningBeforeLossOfUnsavedChanges();
        return appUi.entity.uiA.htmlElement;
    }
    getStarter() : StarterA {
        return this.entity.starterA;
    }
    async oldTester() : Promise<any> {
        // let starter = this.getStarter();
        // await starter.createTest();
        // starter.testMode();
        // if (starter.getEnvironment().url.searchParams.has('withFailingDemoTest')) {
        //     starter.createdApp.appA.testA.withFailingDemoTest = true;
        // }
        // await starter.createdApp.appA.testA.createRunAndDisplay();
        // // starter.getEnvironment().activeApp = starter.createdApp;
        // starter.createdApp.appA.uiA.withPlaceholderArea = true;
        // if (starter.isPublicWeb()) {
        //     starter.createdApp.appA.uiA.webMeta = await starter.createUnboundWebMeta();
        // }
        // await starter.createdApp.uiA.update();
        // return starter.createdApp.uiA.htmlElement;
        return undefined;
    }
}