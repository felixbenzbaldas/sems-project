import {Identity} from "@/Identity";
import {AbstractUi} from "@/abstract-ui/AbstractUi";
import {Subject} from "rxjs";

export class Starter {

    static createApp() : Identity {
        let app = new Identity();
        app.text = 'Sems application';
        return app;
    }

    static createWebsite() : Identity {
        let app = Starter.createAppWithUI();
        app.abstractUi.isWebsite = true;
        app.abstractUi.content.list.add(
            app.createText('This is the Sems software. It is being developed. New features will be added.'),
            app.createText(''),
            app.createTextWithList('Sems-Client-App',
                app.createText('The Sems-Client-App is a Sems application, which runs in your browser (e. g. Firefox / Edge). ' +
                    'On this way you can use Sems without creating an account or install the software.'),
                app.createLink(window.location.href + '?client-app', 'Open')
            ),
            app.createText(''),
            app.createText(''),
            app.createTextWithList('Zu Verschenken',
                app.createText('Virtual Reality Brille für Android-Smartphone'),
                app.createText('Wasserkaraffe mit Deckel'),
                app.createTextWithList('Spielpistole 0,08 Joule (mit Plastikkugeln als Munition)'),
                app.createText('Poker Set (z. B. für Texas Holdem)'),
                app.createText('Geschenk-Gutschein 20 € bei Wilkendorf\'s Teehaus in Karlsruhe')
            ),
            app.createText(''),
            app.createTextWithList('Zu Verkaufen',
                app.createTextWithList('Rotes Rennrad',
                    app.createText('Marke: Bernd Herkelmann. Shimano DURA ACE Gangschaltung und Bremsen. ' +
                        'Mit Gepäckträger, kann auch als Tourenrad verwendet werden. ' +
                        'Der Lack ist leider etwas beschädigt. Der Rahmen ist relativ klein, daher für kleine Menschen geeignet. Inklusive ABUS-Zahlenschloss'),
                    app.createText('Preis: 120 € VB')
                ),
                app.createTextWithList('hochwertiger Minikühlschrank - geräuschlos',
                    app.createText('Marke: Dometic, Modell: DS 400 weiß miniCool Absorbertechnik'),
                    app.createText('Preis: 100 € (Neupreis im Jahr 2013: 449 €)')
                )
            ),
            app.createText(''),
            app.createText('marker-dr53hifhh4'),
        );
        return app;
    }

    static createAppWithUI() : Identity {
        let app = Starter.createApp();
        app.abstractUi = new AbstractUi(app);
        return app;
    }

    static createAppWithUIWithCommands() : Identity {
        let app = this.createAppWithUI();
        app.abstractUi.commands = app.createTextWithList('commands',
            app.createButton('default action', async () => {
                await app.abstractUi.defaultAction();
            }),
            app.createButton('export', async () => {
                app.abstractUi.export();
            }),
        );
        return app;
    }

    static async loadLocalhostApp(port: number) {
        let app = new Identity();
        app.text = 'todo: load from server';
        app.server = 'http://localhost:' + port + '/';
        return app;
    }
}