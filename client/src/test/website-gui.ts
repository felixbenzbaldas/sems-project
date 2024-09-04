import {beforeEach, describe, expect, it} from "vitest";
import {Entity} from "@/Entity";
import {Starter} from "@/Starter";
import type {GuiG} from "@/ui/GuiG";

describe('website gui', () => {

    let app : Entity;
    let gui : GuiG;

    beforeEach(async () => {
        app = await Starter.createWebsite();
        await app.update();
        gui = app.guiG;
    });

    it('shows text', async () => {
        expect(gui.getRawText()).length.above(5);
    });

});