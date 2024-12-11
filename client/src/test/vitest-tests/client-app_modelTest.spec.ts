import {beforeEach, describe, expect, it} from "vitest";
import {Entity} from "@/Entity";
import {StarterA} from "@/StarterA";
import type {UiA} from "@/ui/UiA";

describe('client-app (modelTests)', () => {

    let app : Entity;
    let ui : UiA;

    beforeEach(async () => {
        app = await StarterA.createAppWithUIWithCommands_editable_updateUi();
        ui = app.uiA;
        ui.editable = true;
        await app.updateUi();
    });

    it('can create new object', async () => {
        let before = ui.countEditableTexts();

        await ui.click('default action');

        expect(ui.countEditableTexts()).greaterThan(before);
    });

    it('focuses clicked object', async () => {
        await app.appA.uiA.globalEventG.defaultAction();
        app.appA.uiA.focused.getObject().text = 'marker-foo';
        app.appA.uiA.focused = undefined;
        await app.appA.uiA.update();

        await ui.click('marker-foo');

        expect(app.appA.uiA.focused.getObject().text).toEqual('marker-foo');
    });

});