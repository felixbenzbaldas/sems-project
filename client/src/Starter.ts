import {Identity} from "@/Identity";
import {AppA_Ui} from "@/ui/AppA_Ui";
import {AppA} from "@/core/AppA";
import {Ui_JS} from "@/ui/Ui_JS";

export class Starter {

    static async createFromUrl() : Promise<Identity> {
        let app : Identity;
        let queryParams = new URLSearchParams(window.location.search);
        if (queryParams.has('local')) {
            app = Starter.createAppWithUIWithCommands();
        } else if (queryParams.has('client-app')) {
            app = Starter.createAppWithUIWithCommands();
        } else {
            app = await Starter.createWebsite();
        }
        return app;
    }

    static createApp() : Identity {
        let app = new Identity();
        app.text = 'Sems application';
        app.appA = new AppA(app);
        app.containerA.mapNameIdentity = new Map();
        return app;
    }

    static async createWebsite() : Promise<Identity> {
        let app = Starter.createAppWithUI();
        app.appA.ui.isWebsite = true;
        let toReplaceDuringDeployment : Identity;
        let markerBody = 'marker-dr53hifhh4-body';
        if (markerBody.startsWith('marker')) {
            toReplaceDuringDeployment = app.appA.simple_createText('[ to replace during deployment ]');
        } else {
            toReplaceDuringDeployment = await app.appA.createList();
            toReplaceDuringDeployment.text = 'marker-dr53hifhh4-header';
            await app.appA.addAllToListFromRawData(toReplaceDuringDeployment, JSON.parse(markerBody));
        }
        app.appA.ui.content.list.add(
            app.appA.simple_createText('This is the Sems software. It is being developed. New features will be added.'),
            app.appA.simple_createText(''),
            app.appA.simple_createTextWithList('Sems-Client-App',
                app.appA.simple_createText('The Sems-Client-App is a Sems application, which runs in your browser (e. g. Firefox / Edge). ' +
                    'On this way you can use Sems without creating an account or install the software.'),
                app.appA.simple_createLink(window.location.href + '?client-app', 'Open')
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
            toReplaceDuringDeployment,
        );
        return app;
    }

    static createAppWithUI() : Identity {
        let app = Starter.createApp();
        app.appA.ui = new AppA_Ui(app);
        return app;
    }

    static createAppWithUIWithCommands() : Identity {
        let app = this.createAppWithUI();
        app.appA.ui.commands = app.appA.simple_createTextWithList('commands',
            app.appA.simple_createButton('default action', async () => {
                await app.appA.ui.globalEvent_defaultAction();
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
        return app;
    }

    static async loadLocalhostApp(port: number) {
        let app = new Identity();
        app.text = 'todo: load from server';
        app.containerA.mapNameIdentity = new Map();
        app.appA = new AppA(app);
        app.appA.server = 'http://localhost:' + port + '/';
        return app;
    }
}