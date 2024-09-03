import {beforeEach, describe, expect, it} from "vitest";
import {Identity} from "@/Identity";
import {Starter} from "@/Starter";
import type {GuiG} from "@/ui/GuiG";
import {wait} from "@/utils";

describe('client-app gui', () => {

    let app : Identity;
    let gui : GuiG;

    beforeEach(async () => {
        app = Starter.createAppWithUIWithCommands();
        await app.update();
        gui = app.guiG;
    });

    it('contains button for object creation', async () => {
        expect(gui.getRawText()).contains('default action');
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