import {Identity} from "@/restart-with-aspects/Identity";
import {UI} from "@/restart-with-aspects/user-interface/UI";

export class Starter {

    static createApp() : Identity {
        let app = new Identity();
        app.text = 'Sems application';
        return app;
    }

    static createWebsite() : Identity {
        let app = Starter.createAppWithUI();
        app.ui.isWebsite = true;
        app.ui.content.list.add(
            app.createText('This is the Sems software. It is being developed. New features will be added.'),
            // app.createText(''),
            // app.createTextWithList('Software tests', app.createText('subitem')),
            app.createText(''),
            app.createTextWithList('Zu Verschenken',
                app.createTextWithList('Clean Code Poster, Armbänder, Postkarten, Flyer',
                    app.createText('Beschreibung siehe hier: https://shop.generic.de/products/clean-code-set')),
                app.createTextWithList('Spielpistole 0,08 Joule (mit Plastikkugeln als Munition)'),
                app.createText('Wasserkaraffe mit Deckel'),
                app.createText('Virtual Reality Brille für Android-Smartphone'),
                app.createText('Poker Set (z. B. für Texas Holdem)'),
                app.createText('Geschenk-Gutschein 20 € bei Wilkendorf\'s Teehaus in Karlsruhe')
            ),
            app.createText(''),
            app.createTextWithList('Zu Verkaufen',
                app.createTextWithList('Rotes Rennrad',
                    app.createText('Marke: Bernd Herkelmann. Shimano DURA ACE Gangschaltung und Bremsen. ' +
                        'Mit Gepäckträger, kann auch als Tourenrad verwendet werden. ' +
                        'Der Lack ist leider etwas beschädigt. Der Rahmen ist relativ klein, daher für kleine Menschen geeignet.'),
                    app.createText('Preis: 170 € VB')
                ),
                app.createTextWithList('hochwertiger Minikühlschrank - geräuschlos',
                    app.createText('Marke: Dometic, Modell: DS 400 weiß miniCool Absorbertechnik'),
                    app.createText('Preis: 150 € (Neupreis im Jahr 2013: 449 €)')
                )
            )
        );
        return app;
    }

    static createAppWithUI() : Identity {
        let app = Starter.createApp();
        app.ui = new UI(app);
        return app;
    }

    static createAppWithUIWithCommands() : Identity {
        let app = this.createAppWithUI();
        app.ui.commands = app.createTextWithList('commands',
            app.createButton('default action', async () => {
                await app.ui.defaultAction();
            }));
        return app;
    }
}