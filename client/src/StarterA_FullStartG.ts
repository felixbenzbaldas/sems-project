import type {Entity} from "@/Entity";
import type {StarterA} from "@/StarterA";

export class StarterA_FullStartG {
    constructor(public entity : Entity) {
    }
    async oldTester() {
        let starter = this.getStarter();
        await starter.createTest();
        starter.testMode();
        if (starter.getEnvironment().queryParams.has('withFailingDemoTest')) {
            starter.createdApp.appA.testA.withFailingDemoTest = true;
        }
        await starter.createdApp.appA.testA.createRunAndDisplay();
        starter.getEnvironment().activeApp = starter.createdApp;
        starter.createdApp.appA.uiA.withPlaceholderArea = true;
        if (starter.isPublicWeb()) {
            starter.createdApp.appA.uiA.webMeta = await starter.createUnboundWebMeta();
        }
        await starter.createdApp.uiA.update();
        return starter.createdApp.uiA.htmlElement;
    }
    async tester() {
        let starter = this.getStarter();
        starter.createTester2(starter.getEnvironment().testCreator);
        starter.testMode();
        await starter.createdApp.appA.testerG_run();
        starter.getEnvironment().activeApp = starter.createdApp;
        starter.createdApp.appA.uiA.withPlaceholderArea = true;
        if (starter.isPublicWeb()) {
            starter.createdApp.appA.uiA.webMeta = await starter.createUnboundWebMeta();
        }
        await starter.createdApp.uiA.update();
        return starter.createdApp.uiA.htmlElement;
    }
    async objectViewer() {
        let starter = this.getStarter();
        await starter.createObjectViewer(starter.getEnvironment().queryParams.get('path'));
        starter.testMode();
        starter.getEnvironment().activeApp = starter.createdApp;
        starter.createdApp.appA.uiA.withPlaceholderArea = true;
        if (starter.isPublicWeb()) {
            starter.createdApp.appA.uiA.webMeta = await starter.createUnboundWebMeta();
        }
        await starter.createdApp.uiA.update();
        if (starter.createdApp.appA.uiA.content.uiA.listG.uisOfListItems.length === 1) {
            await starter.createdApp.appA.uiA.content.uiA.listG.uisOfListItems[0].uiA.ensureExpanded();
        }
        return starter.createdApp.uiA.htmlElement;
    }
    async testRun() {
        let starter = this.getStarter();
        await starter.run();
        starter.getEnvironment().activeApp = starter.createdApp;
        starter.createdApp.appA.uiA.withPlaceholderArea = true;
        if (starter.isPublicWeb()) {
            starter.createdApp.appA.uiA.webMeta = await starter.createUnboundWebMeta();
        }
        await starter.createdApp.uiA.update();
        return starter.createdApp.uiA.htmlElement;
    }
    async website() {
        let starter = this.getStarter();
        await starter.createWebsite();
        starter.testMode();
        starter.getEnvironment().activeApp = starter.createdApp;
        starter.createdApp.appA.uiA.withPlaceholderArea = true;
        if (starter.isPublicWeb()) {
            starter.createdApp.appA.uiA.webMeta = await starter.createUnboundWebMeta();
        }
        await starter.createdApp.uiA.update();
        return starter.createdApp.uiA.htmlElement;
    }
    async localApp() {
        let starter = this.getStarter();
        starter.createAppWithUIWithCommands_editable();
        starter.testMode();
        starter.getEnvironment().activeApp = starter.createdApp;
        starter.createdApp.appA.uiA.withPlaceholderArea = true;
        await starter.createdApp.uiA.update();
        starter.getEnvironment().warningBeforeLossOfUnsavedChanges();
        return starter.createdApp.uiA.htmlElement;
    }
    async clientApp() {
        let starter = this.getStarter();
        starter.createAppWithUIWithCommands_editable();
        starter.testMode();
        starter.getEnvironment().activeApp = starter.createdApp;
        starter.createdApp.appA.uiA.withPlaceholderArea = true;
        starter.createdApp.appA.uiA.webMeta = await starter.createUnboundWebMeta();
        await starter.createdApp.uiA.update();
        starter.getEnvironment().warningBeforeLossOfUnsavedChanges();
        return starter.createdApp.uiA.htmlElement;
    }
    getStarter() : StarterA {
        return this.entity.starterA;
    }
}