import {beforeEach, describe, expect, it} from "vitest";
import {Entity} from "@/Entity";
import {Starter} from "@/Starter";
import type {UiG} from "@/ui/UiG";
import {wait} from "@/utils";

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
        await app.appA.ui.globalEvent_defaultAction();
        app.appA.ui.focused.setText('marker-foo');
        app.appA.ui.focused = undefined;

        await ui.click('marker-foo');

        expect(app.appA.ui.focused.text).toEqual('marker-foo');
    });

});