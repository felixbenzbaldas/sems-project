import {Identity} from "@/restart-with-aspects/Identity";

export class Starter {

    static createApp() : Identity {
        let app = new Identity();
        app.text = 'Sems application';
        return app;
    }
}