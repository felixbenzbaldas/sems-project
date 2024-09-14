import {beforeEach, describe, expect, it} from "vitest";
import {Entity} from "@/Entity";
import {Starter} from "@/Starter";
import type {UiG} from "@/ui/UiG";

describe('website gui', () => {

    let app : Entity;
    let gui : UiG;

    beforeEach(async () => {
        app = await Starter.createWebsite();
        await app.update();
        gui = app.uiG;
    });

    it('shows text', async () => {
        expect(gui.getRawText()).length.above(5);
    });

});