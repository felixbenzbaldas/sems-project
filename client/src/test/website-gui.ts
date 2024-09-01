import {beforeEach, describe, expect, it} from "vitest";
import {Identity} from "@/Identity";
import {Starter} from "@/Starter";
import type {GuiG} from "@/ui/GuiG";

describe('website gui', () => {

    let app : Identity;
    let gui : GuiG;

    beforeEach(async () => {
        app = await Starter.createWebsite();
        await app.guiG.unsafeUpdate();
        gui = app.guiG;
    });

    it('shows text', async () => {
        expect(gui.getRawText()).length.above(5);
    });

});