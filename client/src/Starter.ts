import {Identity} from "@/Identity";
import {AppA_AbstractUi} from "@/abstract-ui/AppA_AbstractUi";
import {Subject} from "rxjs";

export class Starter {

    static createApp() : Identity {
        let app = new Identity();
        app.text = 'Sems application';
        app.containerA_mapNameIdentity = new Map();
        return app;
    }

    static createWebsite() : Identity {
        let app = Starter.createAppWithUI();
        app.appA_abstractUi.isWebsite = true;
        app.appA_abstractUi.content.list.add(
            app.appA_simple_createText('This is the Sems software. It is being developed. New features will be added.'),
            app.appA_simple_createText(''),
            app.appA_simple_createTextWithList('Sems-Client-App',
                app.appA_simple_createText('The Sems-Client-App is a Sems application, which runs in your browser (e. g. Firefox / Edge). ' +
                    'On this way you can use Sems without creating an account or install the software.'),
                app.appA_simple_createLink(window.location.href + '?client-app', 'Open')
            ),
            app.appA_simple_createText(''),
            app.appA_simple_createText(''),
            app.appA_simple_createTextWithList('Zu Verschenken',
                app.appA_simple_createText('Virtual Reality Brille für Android-Smartphone'),
                app.appA_simple_createText('Wasserkaraffe mit Deckel'),
                app.appA_simple_createTextWithList('Spielpistole 0,08 Joule (mit Plastikkugeln als Munition)'),
                app.appA_simple_createText('Poker Set (z. B. für Texas Holdem)'),
                app.appA_simple_createText('Geschenk-Gutschein 20 € bei Wilkendorf\'s Teehaus in Karlsruhe')
            ),
            app.appA_simple_createText(''),
            app.appA_simple_createTextWithList('Zu Verkaufen',
                app.appA_simple_createTextWithList('Rotes Rennrad',
                    app.appA_simple_createText('Marke: Bernd Herkelmann. Shimano DURA ACE Gangschaltung und Bremsen. ' +
                        'Mit Gepäckträger, kann auch als Tourenrad verwendet werden. ' +
                        'Der Lack ist leider etwas beschädigt. Der Rahmen ist relativ klein, daher für kleine Menschen geeignet. Inklusive ABUS-Zahlenschloss'),
                    app.appA_simple_createText('Preis: 120 € VB')
                ),
                app.appA_simple_createTextWithList('hochwertiger Minikühlschrank - geräuschlos',
                    app.appA_simple_createText('Marke: Dometic, Modell: DS 400 weiß miniCool Absorbertechnik'),
                    app.appA_simple_createText('Preis: 100 € (Neupreis im Jahr 2013: 449 €)')
                )
            ),
            app.appA_simple_createText(''),
            app.appA_simple_createText('marker-dr53hifhh4'),
        );
        return app;
    }

    static createAppWithUI() : Identity {
        let app = Starter.createApp();
        app.appA_abstractUi = new AppA_AbstractUi(app);
        return app;
    }

    static createAppWithUIWithCommands() : Identity {
        let app = this.createAppWithUI();
        app.appA_abstractUi.commands = app.appA_simple_createTextWithList('commands',
            app.appA_simple_createButton('default action', async () => {
                await app.appA_abstractUi.globalEvent_defaultAction();
            }),
            app.appA_simple_createButton('export', async () => {
                app.appA_abstractUi.globalEvent_export();
            }),
        );
        return app;
    }

    static async loadLocalhostApp(port: number) {
        let app = new Identity();
        app.text = 'todo: load from server';
        app.appA_server = 'http://localhost:' + port + '/';
        return app;
    }
}