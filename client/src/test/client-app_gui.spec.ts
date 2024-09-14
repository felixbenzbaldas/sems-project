import {beforeEach, describe, expect, it} from "vitest";
import {Entity} from "@/Entity";
import {Starter} from "@/Starter";
import type {UiG} from "@/ui/UiG";
import {wait} from "@/utils";

describe('client-app gui', () => {

    let app : Entity;
    let gui : UiG;

    beforeEach(async () => {
        app = await Starter.createAppWithUIWithCommands();
        await app.update();
        gui = app.uiG;
    });

    it('can create new object', async () => {
        let before = gui.countEditableTexts();

        await gui.click('default action');

        expect(gui.countEditableTexts()).greaterThan(before);
    });

    it('focuses clicked object', async () => {
        await app.appA.ui.globalEvent_defaultAction();
        app.appA.ui.focused.setText('marker-foo');
        app.appA.ui.focused = undefined;

        await gui.click('marker-foo');

        expect(app.appA.ui.focused.text).toEqual('marker-foo');
    });

});