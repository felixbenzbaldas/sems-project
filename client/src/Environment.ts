import {Entity} from "@/Entity";
import {AppA} from "@/core/AppA";
import {testData} from "@/testData";

export class Environment {

    queryParams : URLSearchParams;
    activeApp: Entity;
    jsonData : any;
    hostname: string;

    static create() : Environment {
        let environment = new Environment();
        environment.queryParams = new URLSearchParams(window.location.search);
        environment.adjustRemSizes();
        let placeholder_jsonString = 'marker-dr53hifhh4-website'; // note: placeholder_jsonString will be replaced during deployment
        if (placeholder_jsonString.startsWith('marker')) {
            environment.jsonData = testData;
        } else {
            environment.jsonData = JSON.parse(placeholder_jsonString);
        }
        environment.hostname = window.location.hostname;
        return environment;
    }

    adjustRemSizes() {
        let root: HTMLElement = document.querySelector(':root');
        root.style.fontSize = '21px';
    }

    ensureActive(app: Entity) {
        if (app != this.activeApp) {
            let previous = this.activeApp?.appA.uiA.focused;
            this.activeApp = app;
            if (previous) {
                previous.uiA.updateFocusStyle();
            }
            if (app.appA.uiA.focused) {
                app.appA.uiA.focused.uiA.updateFocusStyle();
            }
        }
    }

    createApp() : Entity {
        let app = new Entity();
        app.appA = new AppA(app);
        app.appA.environment = this;
        app.text = 'app (by environment)';
        return app;
    }
}