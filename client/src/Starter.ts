import {Entity} from "@/Entity";
import {AppA_UiA} from "@/ui/AppA_UiA";
import {AppA} from "@/core/AppA";
import {AppA_TestA} from "@/test/AppA_TestA";
import {websiteData} from "@/website-data";
import {UiA} from "@/ui/UiA";
import {Static} from "@/Static";

export class Starter {

    static placeholderImpressumHeader = 'marker-dr53hifhh4-impressum-header';
    static placeholderImpressumBody = 'marker-dr53hifhh4-impressum-body';
    static placeholderWebsite = 'marker-dr53hifhh4-website';

    static async start() : Promise<HTMLElement> {
        let root : HTMLElement = document.querySelector(':root');
        root.style.fontSize = '21px';
        let app = await Starter.createFromUrl();
        await app.uiA.update();
        return app.uiA.htmlElement;
    }

    static async createFromUrl() : Promise<Entity> {
        let queryParams = new URLSearchParams(window.location.search);
        let app : Entity;
        if (queryParams.has('local')) {
            app = await Starter.createAppWithUIWithCommands_updateUi();
            app.uiA.editable = true;
        } else if (queryParams.has('client-app')) {
            app = await Starter.createAppWithUIWithCommands_updateUi();
            app.uiA.editable = true;
            app.appA.uiA.topImpressum = await Starter.getPlaceholderImpressum(app);
        } else if (queryParams.has('test')) {
            app = await Starter.createTest();
            app.appA.uiA.topImpressum = await Starter.getPlaceholderImpressum(app);
            if (queryParams.has('withFailingDemoTest')) {
                app.appA.testA.withFailingDemoTest = true;
            }
        } else {
            app = await Starter.createWebsite();
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

    static createApp() : Entity {
        let app = new Entity();
        app.text = 'simple application';
        app.appA = new AppA(app);
        return app;
    }

    private static getBaseUrl() : string {
        return window.location.protocol + '/index.html';
    }

    private static async getPlaceholderImpressum(app: Entity) {
        let impressum = await Starter.getPlaceholder(app, Starter.placeholderImpressumHeader, Starter.placeholderImpressumBody);
        impressum.uiA = new UiA(impressum);
        return impressum;
    }

    private static async getPlaceholder(app : Entity, placeholderHeader : string, placeholderBody : string) : Promise<Entity> {
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

    static createAppWithUI() : Entity {
        let app = Starter.createApp();
        app.uiA = new UiA(app);
        app.appA.uiA = new AppA_UiA(app);
        return app;
    }

    static async createAppWithUIWithCommands_updateUi() : Promise<Entity> {
        let app = this.createAppWithUI();
        app.appA.uiA.showMeta = true;
        app.appA.uiA.commands = app.appA.unboundG.createTextWithList('commands',
            app.appA.unboundG.createButton('default action', async () => {
                await app.appA.uiA.globalEventG.defaultAction();
            }),
            app.appA.unboundG.createButton('new subitem', async () => {
                await app.appA.uiA.globalEventG.newSubitem();
            }),
            app.appA.unboundG.createButton('toggle collapsible', async () => {
                await app.appA.uiA.globalEventG.toggleCollapsible();
            }),
            app.appA.unboundG.createButton('expand/collapse', async () => {
                await app.appA.uiA.globalEventG.expandOrCollapse();
            }),
            app.appA.unboundG.createButton('switch current container', async () => {
                await app.appA.uiA.globalEventG.switchCurrentContainer();
            }),
            app.appA.unboundG.createButton('switch to app container', async () => {
                await app.appA.uiA.globalEventG.switchToAppContainer();
            }),
            app.appA.unboundG.createButton('export', async () => {
                await app.appA.uiA.globalEventG.export();
            }),
            app.appA.unboundG.createButton('export app', async () => {
                await app.appA.uiA.globalEventG.exportApp();
            }),
            app.appA.unboundG.createButton('import', async () => {
                await app.appA.uiA.globalEventG.import();
            }),
            app.appA.unboundG.createButton('focus root', async () => {
                await app.appA.uiA.globalEventG.focusRoot();
            }),
            // app.appA.unboundG.createButton('flat export content', async () => {
            //     await app.appA.uiA.globalEventG.flatExportContent();
            // }),
            // app.appA.unboundG.createButton('flat import to content', async () => {
            //     await app.appA.uiA.globalEventG.flatImportToContent();
            // }),
        );
        app.appA.uiA.commands.uiA = new UiA(app.appA.uiA.commands);
        await app.uiA.update();
        return app;
    }

    static async loadLocalhostApp(port: number) {
        let app = new Entity();
        app.text = 'todo: load from server';
        app.appA = new AppA(app);
        app.appA.server = 'http://localhost:' + port + '/';
        return app;
    }

    static async createTest() : Promise<Entity> {
        let tester = this.createAppWithUI();
        tester.text = 'Tester';
        tester.appA.testA = new AppA_TestA(tester);
        return tester;
    }

    static async createWebsite() : Promise<Entity> {
        let app = Starter.createAppWithUI();
        app.appA.uiA.isWebsite = true;
        let created;
        if (Starter.placeholderWebsite.startsWith('marker')) {
            console.log("startsWith marker");
            created = app.appA.unboundG.createFromJson(websiteData);
        } else {
            console.log("starts not with marker");
            created = app.appA.unboundG.createFromJson(JSON.parse(Starter.placeholderWebsite));
        }
        app.containerA.take(created);
        for (let i = 0; i < created.list.jsList.length; i++) {
            await app.appA.uiA.content.list.add(
                await created.list.getObject(i)
            );
        }
        return app;
    }
}