import {Entity} from "@/Entity";
import {AppA_Ui} from "@/ui/AppA_Ui";
import {AppA} from "@/core/AppA";
import {GuiG} from "@/ui/GuiG";
import {AppA_TestA} from "@/test/AppA_TestA";

export class Starter {

    static placeholderAboutHeader = 'marker-dr53hifhh4-about-header';
    static placeholderAboutBody = 'marker-dr53hifhh4-about-body';
    static placeholderImpressumHeader = 'marker-dr53hifhh4-impressum-header';
    static placeholderImpressumBody = 'marker-dr53hifhh4-impressum-body';

    static async createFromUrl() : Promise<Entity> {
        let queryParams = new URLSearchParams(window.location.search);
        let app : Entity;
        if (queryParams.has('local')) {
            app = await Starter.createAppWithUIWithCommands();
        } else if (queryParams.has('client-app')) {
            app = await Starter.createAppWithUIWithCommands();
            app.appA.ui.topImpressum = await Starter.getPlaceholderImpressum(app);
        } else if (queryParams.has('test')) {
            app = await Starter.createTest();
            app.appA.ui.topImpressum = await Starter.getPlaceholderImpressum(app);
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
            await app.appA.testA.run();
        }
        return app;
    }

    static createApp() : Entity {
        let app = new Entity();
        app.text = 'Sems application';
        app.appA = new AppA(app);
        app.containerA.mapNameEntity = new Map();
        return app;
    }

    static async createWebsite() : Promise<Entity> {
        let app = Starter.createAppWithUI();
        app.appA.ui.isWebsite = true;
        await app.appA.ui.content.list.add(
            app.appA.simple_createText('This is the Sems software. It is being developed. New features will be added.'),
            app.appA.simple_createText(''),
            app.appA.simple_createTextWithList('Sems-Client-App',
                app.appA.simple_createText('The Sems-Client-App is a Sems application, which runs in your browser (e. g. Firefox / Edge). ' +
                    'On this way you can use Sems without creating an account or install the software.'),
                app.appA.simple_createLink(window.location.host + '?client-app', 'Open')
            ),
            app.appA.simple_createText(''),
            app.appA.simple_createTextWithList('Sems-Tester',
                app.appA.simple_createText('The Sems software is able to test itself. The Sems-Tester can run tests directly in the browser.'),
                app.appA.simple_createLink(window.location.host + '?test&withFailingDemoTest', 'Open')
            ),
            app.appA.simple_createText(''),
            app.appA.simple_createText(''),
            app.appA.simple_createTextWithList('Zu Verschenken',
                app.appA.simple_createText('Virtual Reality Brille für Android-Smartphone'),
                app.appA.simple_createText('Wasserkaraffe mit Deckel'),
                app.appA.simple_createTextWithList('Spielpistole 0,08 Joule (mit Plastikkugeln als Munition)'),
                app.appA.simple_createText('Poker Set (z. B. für Texas Holdem)'),
                app.appA.simple_createText('Geschenk-Gutschein 20 € bei Wilkendorf\'s Teehaus in Karlsruhe')
            ),
            app.appA.simple_createText(''),
            app.appA.simple_createTextWithList('Zu Verkaufen',
                app.appA.simple_createTextWithList('Rotes Rennrad',
                    app.appA.simple_createText('Marke: Bernd Herkelmann. Shimano DURA ACE Gangschaltung und Bremsen. ' +
                        'Mit Gepäckträger, kann auch als Tourenrad verwendet werden. ' +
                        'Der Lack ist leider etwas beschädigt. Der Rahmen ist relativ klein, daher für kleine Menschen geeignet. Inklusive ABUS-Zahlenschloss'),
                    app.appA.simple_createText('Preis: 120 € VB')
                ),
                app.appA.simple_createTextWithList('hochwertiger Minikühlschrank - geräuschlos',
                    app.appA.simple_createText('Marke: Dometic, Modell: DS 400 weiß miniCool Absorbertechnik'),
                    app.appA.simple_createText('Preis: 100 € (Neupreis im Jahr 2013: 449 €)')
                )
            ),
            app.appA.simple_createText(''),
            await Starter.getPlaceholderAbout(app),
            await Starter.getPlaceholderImpressum(app),
        );
        return app;
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
            placeholder = app.appA.simple_createText('[ to replace during deployment ]');
        } else {
            placeholder = await app.appA.createList();
            placeholder.text = placeholderHeader;
            await app.appA.addAllToListFromRawData(placeholder, JSON.parse(placeholderBody));
        }
        return placeholder;
    }

    static createAppWithUI() : Entity {
        let app = Starter.createApp();
        app.appA.ui = new AppA_Ui(app);
        return app;
    }

    static async createAppWithUIWithCommands() : Promise<Entity> {
        let app = this.createAppWithUI();
        app.appA.ui.commands = app.appA.simple_createTextWithList('commands',
            app.appA.simple_createButton('default action', async () => {
                await app.appA.ui.globalEvent_defaultAction();
            }),
            app.appA.simple_createButton('new subitem', async () => {
                await app.appA.ui.globalEvent_newSubitem();
            }),
            app.appA.simple_createButton('toggle collapsible', async () => {
                await app.appA.ui.globalEvent_toggleCollapsible();
            }),
            app.appA.simple_createButton('toggle collapsed', async () => {
                await app.appA.ui.globalEvent_toggleCollapsed();
            }),
            app.appA.simple_createButton('export app', async () => {
                await app.appA.ui.globalEvent_exportApp();
            }),
            app.appA.simple_createButton('export content', async () => {
                await app.appA.ui.globalEvent_exportContent();
            }),
            app.appA.simple_createButton('import to content', async () => {
                await app.appA.ui.globalEvent_importToContent();
            }),
        );
        app.update();
        return app;
    }

    static async loadLocalhostApp(port: number) {
        let app = new Entity();
        app.text = 'todo: load from server';
        app.containerA.mapNameEntity = new Map();
        app.appA = new AppA(app);
        app.appA.server = 'http://localhost:' + port + '/';
        return app;
    }

    private static async createTest() : Promise<Entity> {
        let tester = this.createAppWithUI();
        tester.text = 'Tester';
        tester.appA.testA = new AppA_TestA(tester);
        tester.appA.ui.topImpressum = await Starter.getPlaceholderImpressum(tester);
        return tester;
    }
}