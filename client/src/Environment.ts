import {Entity} from "@/Entity";
import {AppA} from "@/AppA";
import {testData} from "@/testData";

export class Environment {

    queryParams : URLSearchParams;
    activeApp: Entity;
    jsonData : any;
    hostname: string;
    setTitle: (text: string) => void;
    testCreator: (app: Entity) => Entity;

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
        environment.setTitle = text => {
            document.title = text;
        }
        environment.testCreator = (tester : Entity) => {
            return tester.appA.testerA.createTestForSimpleSoftware();
        };
        environment.create_installWindowKeyListener();
        document.body.style.margin = '0rem';
        environment.updateWindowHeight();
        window.addEventListener('resize', () => {
            environment.updateWindowHeight();
        });
        return environment;
    }

    updateWindowHeight() {
        document.body.style.height = window.innerHeight + 'px';
    }

    create_installWindowKeyListener() {
        let listener = async (keyboardEvent : KeyboardEvent) => {
            if (this.activeApp.appA.uiA) {
                await this.activeApp.appA.uiA.keyG.keyboardEvent(keyboardEvent);
            }
        };
        window.onkeyup = listener;
        window.onkeydown = listener;
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

    warningBeforeLossOfUnsavedChanges() {
        window.onbeforeunload = () => {
            return -1;
        };
    }

    noWarningBeforeLossOfUnsavedChanges() {
        window.onbeforeunload = undefined;
    }
}