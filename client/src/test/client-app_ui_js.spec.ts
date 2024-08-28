import {beforeEach, describe, expect, it} from "vitest";
import {Identity} from "@/Identity";
import {Starter} from "@/Starter";
import type {AppA_Ui_JS_UserPerspectiveG} from "@/ui/AppA_Ui_JS_UserPerspectiveG";

describe('client-app_ui_js', () => {

    let app : Identity;
    let userPerspective : AppA_Ui_JS_UserPerspectiveG;

    beforeEach(async () => {
        app = Starter.createAppWithUIWithCommands()
        await app.ui_js.asyncUpdate();
        userPerspective = app.appA.ui.js.userPerspectiveG;
    });

    it('contains button for object creation', async () => {
        expect(userPerspective.getRawText()).contains('default action');
    });

    it('can create new object', async () => {
        let before = userPerspective.countEditableTexts();

        await userPerspective.click('default action');

        expect(userPerspective.countEditableTexts()).greaterThan(before);
    });

});