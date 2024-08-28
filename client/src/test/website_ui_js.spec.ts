import {beforeEach, describe, expect, it} from "vitest";
import {Identity} from "@/Identity";
import {Starter} from "@/Starter";
import type {AppA_Ui_JS_UserPerspectiveG} from "@/ui/AppA_Ui_JS_UserPerspectiveG";

describe('website_ui_js', () => {

    let app : Identity;
    let userPerspective : AppA_Ui_JS_UserPerspectiveG;

    beforeEach(async () => {
        app = await Starter.createWebsite();
        await app.ui_js.update();
        userPerspective = app.appA.ui.js.userPerspectiveG;
    });

    it('shows text', async () => {
        expect(userPerspective.getRawText()).length.above(5);
    });

});