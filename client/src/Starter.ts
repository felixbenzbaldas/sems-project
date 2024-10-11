import {Entity} from "@/Entity";
import {AppA_UiA} from "@/ui/AppA_UiA";
import {AppA} from "@/core/AppA";
import {AppA_TestA} from "@/test/AppA_TestA";
import {websiteData} from "@/website-data";
import {UiA} from "@/ui/UiA";
import {Static} from "@/Static";
import {Placeholder} from "@/Placeholder";

export class Starter {

    placeholder : Placeholder;
    createdApp : Entity;

    constructor() {
        this.placeholder = new Placeholder();
    }

    static async start() : Promise<HTMLElement> {
        return await new Starter().start();
    }

    async start() : Promise<HTMLElement> {
        this.environment_adjustRemSizes();
        await this.createFromUrl();
        await this.createdApp.uiA.update();
        return this.createdApp.uiA.htmlElement;
    }

    environment_adjustRemSizes() {
        let root: HTMLElement = document.querySelector(':root');
        root.style.fontSize = '21px';
    }

    async createFromUrl() {
        let queryParams = new URLSearchParams(window.location.search);
        if (queryParams.has('local')) {
            await this.createAppWithUIWithCommands_editable_updateUi();
            this.createdApp.uiA.editable = true;
        } else if (queryParams.has('client-app')) {
            await this.createAppWithUIWithCommands_editable_updateUi();
            this.createdApp.appA.uiA.topImpressum = await this.getPlaceholderImpressum();
        } else if (queryParams.has('test')) {
            await this.createTest();
            this.createdApp.appA.uiA.topImpressum = await this.getPlaceholderImpressum();
            if (queryParams.has('withFailingDemoTest')) {
                this.createdApp.appA.testA.withFailingDemoTest = true;
            }
        } else if (queryParams.has('path')) {
            await this.createObjectViewer(queryParams.get('path'));
            this.createdApp.appA.uiA.topImpressum = await this.getPlaceholderImpressum();
        } else {
            await this.createWebsite();
        }
        Static.activeApp = this.createdApp;
        if (queryParams.has('testMode')) {
            this.createdApp.appA.logG.toConsole = true;
        }
        if (queryParams.has('test')) {
            await this.createdApp.appA.testA.createRunAndDisplay();
        }
        this.createdApp.appA.uiA.withPlaceholderArea = true;
    }

    createApp() {
        this.createdApp = new Entity();
        this.createdApp.text = 'simple application';
        this.createdApp.appA = new AppA(this.createdApp);
    }

    private getBaseUrl() : string {
        return window.location.protocol + '/index.html';
    }

    private async getPlaceholderImpressum() {
        let impressum = await this.getPlaceholder(this.placeholder.impressumHeader, this.placeholder.impressumBody);
        impressum.uiA = new UiA(impressum);
        return impressum;
    }

    private async getPlaceholder(placeholderHeader : string, placeholderBody : string) : Promise<Entity> {
        let placeholder : Entity;
        if (placeholderBody.startsWith('marker')) {
            placeholder = await this.createdApp.appA.createText('[ to replace during deployment ]');
        } else {
            placeholder = await this.createdApp.appA.createList();
            placeholder.text = placeholderHeader;
            placeholder.collapsible = true;
            await this.createdApp.appA.addAllToListFromRawData(placeholder, JSON.parse(placeholderBody));
        }
        return placeholder;
    }

    createAppWithUI() {
        this.createApp();
        this.createdApp.uiA = new UiA(this.createdApp);
        this.createdApp.appA.uiA = new AppA_UiA(this.createdApp);
    }

    async createAppWithUIWithCommands_editable_updateUi() : Promise<void> {
        this.createAppWithUI();
        this.createdApp.uiA.editable = true;
        this.createdApp.appA.uiA.showMeta = true;
        this.createdApp.appA.uiA.commands = this.createdApp.appA.uiA.createCommands();
        this.createdApp.appA.uiA.commands.uiA = new UiA(this.createdApp.appA.uiA.commands);
        await this.createdApp.uiA.update();
    }

    async loadLocalhostApp(port: number) {
        this.createdApp = new Entity();
        this.createdApp.text = 'todo: load from server';
        this.createdApp.appA = new AppA(this.createdApp);
        this.createdApp.appA.server = 'http://localhost:' + port + '/';
    }

    async createTest() : Promise<void> {
        this.createAppWithUI();
        this.createdApp.text = 'Tester';
        this.createdApp.appA.testA = new AppA_TestA(this.createdApp);
    }

    async createWebsite() : Promise<void> {
        this.createAppWithUI();
        this.createdApp.appA.uiA.isWebsite = true;
        let created = this.getWebsiteData();
        for (let i = 0; i < created.list.jsList.length; i++) {
            await this.createdApp.appA.uiA.content.list.add(
                await created.list.getObject(i)
            );
        }
    }

    private getWebsiteData() {
        let created;
        if (this.placeholder.website.startsWith('marker')) {
            console.log("startsWith marker");
            created = this.createdApp.appA.unboundG.createFromJson(websiteData);
        } else {
            console.log("starts not with marker");
            created = this.createdApp.appA.unboundG.createFromJson(JSON.parse(this.placeholder.website));
        }
        this.createdApp.containerA.bind(created, 'website');
        return created;
    }

    async createObjectViewer(pathString: string) : Promise<void> {
        this.createAppWithUI();
        let created = this.getWebsiteData();
        let listOfNames = ['..', created.name, ...pathString.split('-')];
        await this.createdApp.appA.uiA.content.list.add(this.createdApp.appA.createPath(listOfNames));
        await this.createdApp.updateUi();
        await this.createdApp.appA.uiA.content.uiA.listG.uisOfListItems.at(0).expand();
    }

    static async createAppWithUIWithCommands_editable_updateUi() {
        let starter = new Starter();
        await starter.createAppWithUIWithCommands_editable_updateUi();
        return starter.createdApp;
    }

    static createApp() {
        let starter = new Starter();
        starter.createApp();
        return starter.createdApp;
    }

    static async createTest() {
        let starter = new Starter();
        await starter.createTest();
        return starter.createdApp;
    }

    static createAppWithUI() {
        let starter = new Starter();
        starter.createAppWithUI();
        return starter.createdApp;
    }

    static async loadLocalhostApp(port: number) {
        let starter = new Starter();
        await starter.loadLocalhostApp(port);
        return starter.createdApp;
    }

    static async createObjectViewer(pathString: string) {
        let starter = new Starter();
        await starter.createObjectViewer(pathString);
        return starter.createdApp;
    }

    static async createWebsite() {
        let starter = new Starter();
        await starter.createWebsite();
        return starter.createdApp;
    }

    static replacedWebsitePlaceholder() {
        return new Starter().placeholder.website.startsWith('marker');
    }
}