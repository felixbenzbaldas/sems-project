import {beforeEach, describe, expect, it} from "vitest";
import {Entity} from "@/Entity";
import {Starter} from "@/Starter";
import type {UiG} from "@/ui/UiG";

describe('client-app (modelTests)', () => {

    let app : Entity;
    let ui : UiG;

    beforeEach(async () => {
        app = await Starter.createAppWithUIWithCommands();
        await app.update();
        ui = app.uiG;
    });

    it('can create new object', async () => {
        let before = ui.countEditableTexts();

        await ui.click('default action');

        expect(ui.countEditableTexts()).greaterThan(before);
    });

    it('focuses clicked object', async () => {
        await app.appA.uiA.globalEvent_defaultAction();
        app.appA.uiA.focused.setText('marker-foo');
        app.appA.uiA.focused = undefined;

        await ui.click('marker-foo');

        expect(app.appA.uiA.focused.text).toEqual('marker-foo');
    });

});