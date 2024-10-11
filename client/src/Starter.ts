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

    constructor() {
        this.placeholder = new Placeholder();
    }

    static async start() : Promise<HTMLElement> {
        return await new Starter().start();
    }

    async start() : Promise<HTMLElement> {
        let root : HTMLElement = document.querySelector(':root');
        root.style.fontSize = '21px';
        let app = await this.createFromUrl();
        await app.uiA.update();
        return app.uiA.htmlElement;
    }

    async createFromUrl() : Promise<Entity> {
        let queryParams = new URLSearchParams(window.location.search);
        let app : Entity;
        if (queryParams.has('local')) {
            app = await this.createAppWithUIWithCommands_editable_updateUi();
            app.uiA.editable = true;
        } else if (queryParams.has('client-app')) {
            app = await this.createAppWithUIWithCommands_editable_updateUi();
            app.appA.uiA.topImpressum = await this.getPlaceholderImpressum(app);
        } else if (queryParams.has('test')) {
            app = await this.createTest();
            app.appA.uiA.topImpressum = await this.getPlaceholderImpressum(app);
            if (queryParams.has('withFailingDemoTest')) {
                app.appA.testA.withFailingDemoTest = true;
            }
        } else if (queryParams.has('path')) {
            app = await this.createObjectViewer(queryParams.get('path'));
            app.appA.uiA.topImpressum = await this.getPlaceholderImpressum(app);
        } else {
            app = await this.createWebsite();
        }
        Static.activeApp = app;
        if (queryParams.has('testMode')) {
            app.appA.logG.toConsole = true;
        }
        if (queryParams.has('test')) {
            await app.appA.testA.createRunAndDisplay();
        }
        app.appA.uiA.withPlaceholderArea = true;
        return app;
    }

    createApp() : Entity {
        let app = new Entity();
        app.text = 'simple application';
        app.appA = new AppA(app);
        return app;
    }

    private getBaseUrl() : string {
        return window.location.protocol + '/index.html';
    }

    private async getPlaceholderImpressum(app: Entity) {
        let impressum = await this.getPlaceholder(app, this.placeholder.impressumHeader, this.placeholder.impressumBody);
        impressum.uiA = new UiA(impressum);
        return impressum;
    }

    private async getPlaceholder(app : Entity, placeholderHeader : string, placeholderBody : string) : Promise<Entity> {
        let placeholder : Entity;
        if (placeholderBody.startsWith('marker')) {
            placeholder = await app.appA.createText('[ to replace during deployment ]');
        } else {
            placeholder = await app.appA.createList();
            placeholder.text = placeholderHeader;
            placeholder.collapsible = true;
            await app.appA.addAllToListFromRawData(placeholder, JSON.parse(placeholderBody));
        }
        return placeholder;
    }

    createAppWithUI() : Entity {
        let app = this.createApp();
        app.uiA = new UiA(app);
        app.appA.uiA = new AppA_UiA(app);
        return app;
    }

    async createAppWithUIWithCommands_editable_updateUi() : Promise<Entity> {
        let app = this.createAppWithUI();
        app.uiA.editable = true;
        app.appA.uiA.showMeta = true;
        app.appA.uiA.commands = app.appA.uiA.createCommands();
        app.appA.uiA.commands.uiA = new UiA(app.appA.uiA.commands);
        await app.uiA.update();
        return app;
    }

    async loadLocalhostApp(port: number) {
        let app = new Entity();
        app.text = 'todo: load from server';
        app.appA = new AppA(app);
        app.appA.server = 'http://localhost:' + port + '/';
        return app;
    }

    async createTest() : Promise<Entity> {
        let tester = this.createAppWithUI();
        tester.text = 'Tester';
        tester.appA.testA = new AppA_TestA(tester);
        return tester;
    }

    async createWebsite() : Promise<Entity> {
        let app = this.createAppWithUI();
        app.appA.uiA.isWebsite = true;
        let created = this.getWebsiteData(app);
        for (let i = 0; i < created.list.jsList.length; i++) {
            await app.appA.uiA.content.list.add(
                await created.list.getObject(i)
            );
        }
        return app;
    }

    private getWebsiteData(app: Entity) {
        let created;
        if (this.placeholder.website.startsWith('marker')) {
            console.log("startsWith marker");
            created = app.appA.unboundG.createFromJson(websiteData);
        } else {
            console.log("starts not with marker");
            created = app.appA.unboundG.createFromJson(JSON.parse(this.placeholder.website));
        }
        app.containerA.bind(created, 'website');
        return created;
    }

    async createObjectViewer(pathString: string) : Promise<Entity> {
        let app : Entity = this.createAppWithUI();
        let created = this.getWebsiteData(app);
        let listOfNames = ['..', created.name, ...pathString.split('-')];
        await app.appA.uiA.content.list.add(app.appA.createPath(listOfNames));
        await app.updateUi();
        await app.appA.uiA.content.uiA.listG.uisOfListItems.at(0).expand();
        return app;
    }

    static async createAppWithUIWithCommands_editable_updateUi() {
        return new Starter().createAppWithUIWithCommands_editable_updateUi();
    }

    static createApp() {
        return new Starter().createApp();
    }

    static async createTest() {
        return await new Starter().createTest();
    }

    static createAppWithUI() {
        return new Starter().createAppWithUI();
    }

    static async loadLocalhostApp(port: number) {
        return await new Starter().loadLocalhostApp(port);
    }

    static async createObjectViewer(pathString: string) {
        return await new Starter().createObjectViewer(pathString);
    }

    static async createWebsite() {
        return await new Starter().createWebsite();
    }

    static replacedWebsitePlaceholder() {
        return new Starter().placeholder.website.startsWith('marker');
    }
}