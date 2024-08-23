import {Identity} from "@/Identity";
import {AppA_AbstractUi} from "@/abstract-ui/AppA_AbstractUi";

export class Starter {

    static createApp() : Identity {
        let app = new Identity();
        app.text = 'Sems application';
        app.containerA.mapNameIdentity = new Map();
        return app;
    }

    static createWebsite() : Identity {
        let app = Starter.createAppWithUI();
        app.appA.abstractUi.isWebsite = true;
        app.appA.abstractUi.content.list.add(
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
            app.appA.simple_createText('marker-dr53hifhh4'),
        );
        return app;
    }

    static createAppWithUI() : Identity {
        let app = Starter.createApp();
        app.appA.abstractUi = new AppA_AbstractUi(app);
        return app;
    }

    static createAppWithUIWithCommands() : Identity {
        let app = this.createAppWithUI();
        app.appA.abstractUi.commands = app.appA.simple_createTextWithList('commands',
            app.appA.simple_createButton('default action', async () => {
                await app.appA.abstractUi.globalEvent_defaultAction();
            }),
            app.appA.simple_createButton('export app', async () => {
                await app.appA.abstractUi.globalEvent_exportApp();
            }),
            app.appA.simple_createButton('export content', async () => {
                await app.appA.abstractUi.globalEvent_exportContent();
            }),
        );
        return app;
    }

    static async loadLocalhostApp(port: number) {
        let app = new Identity();
        app.text = 'todo: load from server';
        app.containerA.mapNameIdentity = new Map();
        app.appA.server = 'http://localhost:' + port + '/';
        return app;
    }
}