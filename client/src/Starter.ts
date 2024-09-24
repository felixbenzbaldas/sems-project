import {Entity} from "@/Entity";
import {AppA_UiA} from "@/ui/AppA_UiA";
import {AppA} from "@/core/AppA";
import {AppA_TestA} from "@/test/AppA_TestA";
import {websiteData} from "@/website-data";

export class Starter {

    static placeholderAboutHeader = 'marker-dr53hifhh4-about-header';
    static placeholderAboutBody = 'marker-dr53hifhh4-about-body';
    static placeholderImpressumHeader = 'marker-dr53hifhh4-impressum-header';
    static placeholderImpressumBody = 'marker-dr53hifhh4-impressum-body';

    static placeholderWebsite = 'marker-dr53hifhh4-website';

    static async createFromUrl() : Promise<Entity> {
        let queryParams = new URLSearchParams(window.location.search);
        let app : Entity;
        if (queryParams.has('local')) {
            app = await Starter.createAppWithUIWithCommands_updateUi();
        } else if (queryParams.has('client-app')) {
            app = await Starter.createAppWithUIWithCommands_updateUi();
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
        app.text = 'easy application';
        app.appA = new AppA(app);
        return app;
    }

    private static getBaseUrl() : string {
        return window.location.protocol + '/index.html';
    }

    private static async getPlaceholderImpressum(app: Entity) {
        return Starter.getPlaceholder(app, Starter.placeholderImpressumHeader, Starter.placeholderImpressumBody);
    }

    private static async getPlaceholderAbout(app: Entity) {
        return Starter.getPlaceholder(app, Starter.placeholderAboutHeader, Starter.placeholderAboutBody);
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
        app.appA.uiA = new AppA_UiA(app);
        return app;
    }

    static async createAppWithUIWithCommands_updateUi() : Promise<Entity> {
        let app = this.createAppWithUI();
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
            // app.appA.unboundG.createButton('flat export content', async () => {
            //     await app.appA.uiA.globalEventG.flatExportContent();
            // }),
            // app.appA.unboundG.createButton('flat import to content', async () => {
            //     await app.appA.uiA.globalEventG.flatImportToContent();
            // }),
        );
        await app.uiG.update();
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
        let created = app.appA.unboundG.createFromJson(websiteData);
        app.containerA.take(created);
        for (let i = 0; i < created.list.jsList.length; i++) {
            await app.appA.uiA.content.list.addAndUpdateUi(
                await created.list.getObject(i)
            );
        }
        return app;
    }
}