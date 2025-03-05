import type {Entity} from "@/Entity";
import type {StarterA} from "@/StarterA";
import {Theme} from "@/ui/Theme";

export class StarterA_FullStartG {
    constructor(public entity : Entity) {
    }
    async tester() {
        let starter = this.getStarter();
        starter.createTester(starter.getEnvironment().testCreator);
        starter.checkTestMode();
        await starter.createdApp.appA.testerA.run();
        if (starter.isPublicWeb()) {
            starter.createdApp.appA.uiA.webMeta = await starter.createUnboundWebMeta();
        }
        let appUi = await starter.createdApp.appA.uiA.createAppUi();
        starter.getEnvironment().ensureActive(appUi);
        return appUi.entity.uiA.htmlElement;
    }
    async objectViewer() {
        let starter = this.getStarter();
        starter.createAppWithUI();
        starter.createdApp.appA.uiA.isWebsite = true;
        starter.createData();
        let pathString = starter.getPath();
        let listOfNames = ['..', starter.data.name, ...pathString.split('-')];
        await starter.createdApp.appA.uiA.presentationModeA_contentData.listA.addByListOfNames(listOfNames);
        starter.theme();
        if (starter.isPublicWeb()) {
            starter.createdApp.appA.uiA.webMeta = await starter.createUnboundWebMeta();
        }
        let appUi = await starter.createdApp.appA.uiA.createAppUi();
        starter.checkTestMode();
        starter.getEnvironment().ensureActive(appUi);
        await appUi.presentationModeA_contentUi.listA.elements[0].ensureExpanded();
        return appUi.entity.uiA.htmlElement;
    }
    async testRun() {
        let starter = this.getStarter();
        await starter.run();
        if (starter.isPublicWeb()) {
            starter.createdApp.appA.uiA.webMeta = await starter.createUnboundWebMeta();
        }
        let appUi = await starter.createdApp.appA.uiA.createAppUi();
        starter.getEnvironment().ensureActive(appUi);
        return appUi.entity.uiA.htmlElement;
    }
    async website() {
        let starter = this.getStarter();
        starter.createAppWithUI();
        starter.createdApp.appA.uiA.isWebsite = true;
        starter.createData();
        starter.theme();
        let website = await starter.data.listA.findByText(starter.hostname())
        let start = await website.listA.findByText('start');
        for (let resolved of await start.listA.getResolvedList()) {
            await starter.createdApp.appA.uiA.presentationModeA_contentData.listA.add(resolved);
        }
        if (starter.getEnvironment().setTitle)  {
            starter.getEnvironment().setTitle((await (await website.listA.findByText('title'))?.listA.getResolved(0)).text);
        }
        starter.checkTestMode();
        if (starter.isPublicWeb()) {
            starter.createdApp.appA.uiA.webMeta = await starter.createUnboundWebMeta();
        }
        let appUi = await starter.createdApp.appA.uiA.createAppUi();
        starter.getEnvironment().ensureActive(appUi);
        let length = appUi.presentationModeA_contentUi.listA.elements.length;
        if (length === 1 || length === 2) {
            await appUi.presentationModeA_contentUi.listA.elements[0].ensureExpanded();
        }
        return appUi.entity.uiA.htmlElement;
    }

    async localApp() {
        let starter = this.getStarter();
        starter.createAppWithUI();
        starter.checkTestMode();
        let appUi = await starter.createdApp.appA.uiA.createAppUi(true, true);
        starter.getEnvironment().ensureActive(appUi);
        starter.getEnvironment().warningBeforeLossOfUnsavedChanges();
        await starter.createdApp.appA.profileG.createProfile();
        appUi.focus(appUi.mainColumnUi);
        await starter.playground();
        return appUi.entity.uiA.htmlElement;
    }
    async clientApp() {
        let starter = this.getStarter();
        starter.createAppWithUI();
        starter.checkTestMode();
        starter.createdApp.appA.uiA.webMeta = await starter.createUnboundWebMeta(); // important
        let appUi = await starter.createdApp.appA.uiA.createAppUi(true, true);
        starter.getEnvironment().ensureActive(appUi);
        starter.getEnvironment().warningBeforeLossOfUnsavedChanges();
        await starter.createdApp.appA.profileG.createProfile();
        appUi.focus(appUi.mainColumnUi);
        return appUi.entity.uiA.htmlElement;
    }
    getStarter() : StarterA {
        return this.entity.starterA;
    }
}