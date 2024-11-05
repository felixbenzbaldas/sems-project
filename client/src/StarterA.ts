import {Entity} from "@/Entity";
import {AppA_UiA} from "@/ui/AppA_UiA";
import {AppA} from "@/AppA";
import {AppA_TestA} from "@/test/AppA_TestA";
import {UiA} from "@/ui/UiA";
import {Environment} from "@/Environment";
import {notNullUndefined, nullUndefined} from "@/utils";
import {StarterA_FullStartG} from "@/StarterA_FullStartG";

export class StarterA {

    fullStartG : StarterA_FullStartG;
    createdApp : Entity;
    data: Entity;

    constructor(public entity : Entity) {
        this.fullStartG = new StarterA_FullStartG(entity);
    }

    async fullStart() : Promise<HTMLElement> {
        if (this.getEnvironment().queryParams.has('client-app')) {
            return this.fullStartG.clientApp();
        } else if (this.getEnvironment().queryParams.has('test')) {
            return this.fullStartG.oldTester();
        } else if (this.getEnvironment().queryParams.has('tester2')) {
            return this.fullStartG.tester();
        } else if (this.getEnvironment().queryParams.has('path')) {
            return this.fullStartG.objectViewer();
        } else if (this.getEnvironment().queryParams.has('run')) {
            return this.fullStartG.testRun();
        } else {
            if (this.isPublicWeb()) {
                return this.fullStartG.website();
            } else {
                return this.fullStartG.localApp();
            }
        }
    }

    isPublicWeb() {
        if (nullUndefined(this.hostname())) {
            return false;
        } else {
            return this.hostname() != 'localhost';
        }
    }

    async run() : Promise<Entity> {
        this.createAppWithUI();
        this.createdApp.appA.testerG_test = this.getEnvironment().testCreator(this.createdApp);
        let pathParam : string = this.getEnvironment().queryParams.get('run');
        let path = this.createdApp.appA.createPath(pathParam.split('_'));
        let run : Entity = await (await this.createdApp.resolve(path)).testG_run();
        this.createdApp.appA.uiA.content.listA.jsList.push(run);
        return this.createdApp;
    }

    getEnvironment() : Environment {
        return this.entity.getApp().appA.environment;
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
        this.createdApp.appA.environment =  this.entity.getApp().appA.environment;
        return this.createdApp;
    }

    createApp_typed() : AppA {
        return this.createApp().appA;
    }

    createAppWithUI() : Entity {
        this.createApp();
        this.createdApp.uiA = new UiA(this.createdApp);
        this.createdApp.appA.uiA = new AppA_UiA(this.createdApp);
        return this.createdApp;
    }

    createAppWithUI_typed() : AppA_UiA {
        return this.createAppWithUI().appA.uiA;
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

    createTester2(testCreator: (app: Entity) => Entity) : Entity {
        this.createAppWithUI();
        this.createdApp.appA.testerG_test = testCreator(this.createdApp);
        return this.createdApp;
    }

    async createWebsite() : Promise<Entity> {
        this.createAppWithUI();
        this.createdApp.appA.uiA.isWebsite = true;
        this.createData();
        let website = await this.data.listA.findByText(this.hostname())
        let start = await website.listA.findByText('start');
        for (let i = 0; i < start.listA.jsList.length; i++) {
            await this.createdApp.appA.uiA.content.listA.add(
                await start.listA.getResolved(i)
            );
        }
        if (this.getEnvironment().setTitle)  {
            this.getEnvironment().setTitle((await (await website.listA.findByText('title'))?.listA.getResolved(0)).text);
        }
        return this.createdApp;
    }

    hostname() : string {
        if (this.getEnvironment().hostname === 'localhost') {
            if (this.getEnvironment().queryParams?.has('virtualHostname')) {
                return this.getEnvironment().queryParams.get('virtualHostname');
            } else {
                return 'localhost';
            }
        } else {
            return this.getEnvironment().hostname;
        }
    }

    async createObjectViewer(pathString: string) : Promise<Entity> {
        this.createAppWithUI();
        this.createData();
        let listOfNames = ['..', this.data.name, ...pathString.split('-')];
        await this.createdApp.appA.uiA.content.listA.add(this.createdApp.appA.createPath(listOfNames));
        await this.createdApp.updateUi();
        await this.createdApp.appA.uiA.content.uiA.listG.uisOfListItems[0].uiA.ensureExpanded();
        return this.createdApp;
    }

    createData() {
        this.data = this.createdApp.appA.unboundG.createFromJson(this.getEnvironment().jsonData);
        this.createdApp.containerA.bind(this.data, 'data');
    }

    async createUnboundWebMeta() : Promise<Entity> {
        let unboundData = this.createdApp.appA.unboundG.createFromJson(this.getEnvironment().jsonData);
        let unboundWebMeta = await (await (await unboundData.listA.getResolved(0)).listA.findByText('webMeta')).listA.getResolved(0);
        unboundWebMeta.uiA = new UiA(unboundWebMeta);
        return unboundWebMeta;
    }

    ////////////////////////////////////////////////////////////////////////////////////////
    // static methods

    static async createAppWithUIWithCommands_editable_updateUi() {
        let starter = new Environment().createApp().appA.createStarter();
        await starter.createAppWithUIWithCommands_editable_updateUi();
        return starter.createdApp;
    }

    static createApp() {
        return new Environment().createApp();
    }

    static async createTest() {
        let starter = new Environment().createApp().appA.createStarter();
        await starter.createTest();
        return starter.createdApp;
    }

    static createAppWithUI() {
        let starter = new Environment().createApp().appA.createStarter();
        starter.createAppWithUI();
        return starter.createdApp;
    }
}