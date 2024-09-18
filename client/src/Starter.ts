import {Entity} from "@/Entity";
import {AppA_UiA} from "@/ui/AppA_UiA";
import {AppA} from "@/core/AppA";
import {AppA_TestA} from "@/test/AppA_TestA";
import {ContainerA} from "@/core/ContainerA";

export class Starter {

    static placeholderAboutHeader = 'marker-dr53hifhh4-about-header';
    static placeholderAboutBody = 'marker-dr53hifhh4-about-body';
    static placeholderImpressumHeader = 'marker-dr53hifhh4-impressum-header';
    static placeholderImpressumBody = 'marker-dr53hifhh4-impressum-body';

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

    static async createWebsite() : Promise<Entity> {
        let app = Starter.createAppWithUI();
        app.appA.uiA.isWebsite = true;
        await app.appA.uiA.content.list.addAndUpdateUi(
            app.appA.unboundG.createText('This is easy software. It is being developed. New features will be added.'),
            app.appA.unboundG.createText(''),
            app.appA.unboundG.createCollapsible('easy client-app',
                app.appA.unboundG.createText('The easy client-app is an easy application, which runs in your browser (e. g. Firefox / Edge). ' +
                    'On this way you can use easy software without creating an account or installing it.'),
                app.appA.unboundG.createLink(Starter.getBaseUrl() + '?client-app', 'Open')
            ),
            app.appA.unboundG.createText(''),
            app.appA.unboundG.createCollapsible('easy tester',
                app.appA.unboundG.createText('The easy software is able to test itself. The easy tester can run tests directly in the browser.'),
                app.appA.unboundG.createLink(Starter.getBaseUrl() + '?test&withFailingDemoTest', 'Open')
            ),
            app.appA.unboundG.createText(''),
            app.appA.unboundG.createText(''),
            app.appA.unboundG.createCollapsible('Zu Verschenken',
                app.appA.unboundG.createText('Virtual Reality Brille für Android-Smartphone'),
                app.appA.unboundG.createText('Wasserkaraffe mit Deckel'),
                app.appA.unboundG.createText('Spielpistole 0,08 Joule (mit Plastikkugeln als Munition)'),
                app.appA.unboundG.createText('Poker Set (z. B. für Texas Holdem)'),
                app.appA.unboundG.createText('Geschenk-Gutschein 20 € bei Wilkendorf\'s Teehaus in Karlsruhe')
            ),
            app.appA.unboundG.createText(''),
            app.appA.unboundG.createCollapsible('Zu Verkaufen',
                app.appA.unboundG.createCollapsible('Rotes Rennrad',
                    app.appA.unboundG.createText('Marke: Bernd Herkelmann. Shimano DURA ACE Gangschaltung und Bremsen. ' +
                        'Mit Gepäckträger, kann auch als Tourenrad verwendet werden. ' +
                        'Der Lack ist leider etwas beschädigt. Der Rahmen ist relativ klein, daher für kleine Menschen geeignet. Inklusive ABUS-Zahlenschloss'),
                    app.appA.unboundG.createText('Preis: 120 € VB')
                ),
                app.appA.unboundG.createCollapsible('hochwertiger Minikühlschrank - geräuschlos',
                    app.appA.unboundG.createText('Marke: Dometic, Modell: DS 400 weiß miniCool Absorbertechnik'),
                    app.appA.unboundG.createText('Preis: 100 € (Neupreis im Jahr 2013: 449 €)')
                )
            ),
            app.appA.unboundG.createText(''),
            await Starter.getPlaceholderAbout(app),
            await Starter.getPlaceholderImpressum(app),
        );
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
            placeholder = app.appA.unboundG.createText('[ to replace during deployment ]');
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
}