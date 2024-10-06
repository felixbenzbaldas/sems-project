import type {Entity} from "@/Entity";

export class Static {

    static activeApp: Entity;

    static ensureActive(app: Entity) {
        if (app != Static.activeApp) {
            let previous = Static.activeApp?.appA.uiA.focused;
            Static.activeApp = app;
            if (previous) {
                previous.uiA.updateFocusStyle();
            }
            if (app.appA.uiA.focused) {
                app.appA.uiA.focused.uiA.updateFocusStyle();
            }
        }
    }
}