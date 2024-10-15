import {Entity} from "@/Entity";
import {AppA} from "@/core/AppA";

export class Environment {

    queryParams : URLSearchParams;
    activeApp: Entity;
    jsonData : any;

    static create() : Environment {
        let environment = new Environment();
        environment.queryParams = new URLSearchParams(window.location.search);
        environment.adjustRemSizes();
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