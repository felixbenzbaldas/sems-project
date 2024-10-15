import {Entity} from "@/Entity";
import {AppA_UiA} from "@/ui/AppA_UiA";
import {AppA} from "@/core/AppA";
import {AppA_TestA} from "@/test/AppA_TestA";
import {UiA} from "@/ui/UiA";
import {Environment} from "@/Environment";

export class StarterA {

    createdApp : Entity;
    data: Entity;

    constructor(public entity? : Entity) {
    }

    async fullStart() : Promise<HTMLElement> {
        if (this.getEnvironment().queryParams.has('local')) {
            this.createAppWithUIWithCommands_editable();
            this.testMode();
            this.createdApp.uiA.editable = true;
        } else if (this.getEnvironment().queryParams.has('client-app')) {
            this.createAppWithUIWithCommands_editable();
            this.testMode();
            this.createdApp.appA.uiA.topImpressum = await this.createUnboundWebMeta();
        } else if (this.getEnvironment().queryParams.has('test')) {
            await this.createTest();
            this.testMode();
            this.createdApp.appA.uiA.topImpressum = await this.createUnboundWebMeta();
            if (this.getEnvironment().queryParams.has('withFailingDemoTest')) {
                this.createdApp.appA.testA.withFailingDemoTest = true;
            }
            await this.createdApp.appA.testA.createRunAndDisplay();
        } else if (this.getEnvironment().queryParams.has('path')) {
            await this.createObjectViewer(this.getEnvironment().queryParams.get('path'));
            this.testMode();
            this.createdApp.appA.uiA.topImpressum = await this.createUnboundWebMeta();
        } else {
            await this.createWebsite();
            this.testMode();
        }
        this.getEnvironment().activeApp = this.createdApp;
        this.createdApp.appA.uiA.withPlaceholderArea = true;
        await this.createdApp.uiA.update();
        if (this.getEnvironment().queryParams.has('path')) {
            await this.createdApp.appA.uiA.content.uiA.listG.uisOfListItems.at(0).expand();
        }
        return this.createdApp.uiA.htmlElement;
    }

    getEnvironment() : Environment {
        return this.entity?.getApp().appA.environment;
    }

    testMode() {
        if (this.getEnvironment().queryParams.has('testMode')) {
            this.createdApp.appA.logG.toConsole = true;
        }
    }

    createApp() : Entity {
        this.createdApp = new Entity();
        this.createdApp.text = 'simple application';
        this.createdApp.appA = new AppA(this.createdApp);
        this.createdApp.appA.environment =  this.entity?.getApp().appA.environment;
        return this.createdApp;
    }

    createAppWithUI() : Entity {
        this.createApp();
        this.createdApp.uiA = new UiA(this.createdApp);
        this.createdApp.appA.uiA = new AppA_UiA(this.createdApp);
        return this.createdApp;
    }

    async createAppWithUIWithCommands_editable_updateUi() : Promise<Entity> {
        this.createAppWithUIWithCommands_editable();
        await this.createdApp.uiA.update();
        return this.createdApp;
    }


    createAppWithUIWithCommands_editable() : Entity {
        this.createAppWithUI();
        this.createdApp.uiA.editable = true;
        this.createdApp.appA.uiA.showMeta = true;
        this.createdApp.appA.uiA.commands = this.createdApp.appA.uiA.createCommands();
        this.createdApp.appA.uiA.commands.uiA = new UiA(this.createdApp.appA.uiA.commands);
        return this.createdApp;
    }

    async createTest() : Promise<Entity> {
        this.createAppWithUI();
        this.createdApp.text = 'Tester';
        this.createdApp.appA.testA = new AppA_TestA(this.createdApp);
        return this.createdApp;
    }

    async createWebsite() : Promise<Entity> {
        this.createAppWithUI();
        this.createdApp.appA.uiA.isWebsite = true;
        this.createData();
        let start = await (await this.data.list.getObject(0)).list.getObject(0);
        for (let i = 0; i < start.list.jsList.length; i++) {
            await this.createdApp.appA.uiA.content.list.add(
                await start.list.getObject(i)
            );
        }
        return this.createdApp;
    }

    async createObjectViewer(pathString: string) : Promise<Entity> {
        this.createAppWithUI();
        this.createData();
        let listOfNames = ['..', this.data.name, ...pathString.split('-')];
        await this.createdApp.appA.uiA.content.list.add(this.createdApp.appA.createPath(listOfNames));
        await this.createdApp.updateUi();
        await this.createdApp.appA.uiA.content.uiA.listG.uisOfListItems.at(0).expand();
        return this.createdApp;
    }

    createData() {
        this.data = this.createdApp.appA.unboundG.createFromJson(this.getEnvironment().jsonData);
        this.createdApp.containerA.bind(this.data, 'data');
    }

    async createUnboundWebMeta() : Promise<Entity> {
        let unboundData = this.createdApp.appA.unboundG.createFromJson(this.getEnvironment().jsonData);
        let unboundWebMeta = await (await (await unboundData.list.getObject(0)).list.findByText('webMeta')).list.getObject(0);
        unboundWebMeta.uiA = new UiA(unboundWebMeta);
        return unboundWebMeta;
    }

    ////////////////////////////////////////////////////////////////////////////////////////
    // static methods

    static async createAppWithUIWithCommands_editable_updateUi() {
        let starter = new StarterA();
        await starter.createAppWithUIWithCommands_editable_updateUi();
        return starter.createdApp;
    }

    static createApp() {
        let starter = new StarterA();
        starter.createApp();
        return starter.createdApp;
    }

    static async createTest() {
        let starter = new StarterA();
        await starter.createTest();
        return starter.createdApp;
    }

    static createAppWithUI() {
        let starter = new StarterA();
        starter.createAppWithUI();
        return starter.createdApp;
    }

    static async createObjectViewer(pathString: string) {
        let starter = new StarterA();
        await starter.createObjectViewer(pathString);
        return starter.createdApp;
    }

    static async createWebsite() {
        let starter = new StarterA();
        await starter.createWebsite();
        return starter.createdApp;
    }
}