import {describe, expect, it} from "vitest";
import {Identity} from "@/Identity";
import {Starter} from "@/Starter";

describe('user-interface for local app', () => {

    it('can create object', async () => {
        let app : Identity = Starter.createAppWithUI();

        await app.ui.defaultAction();

        expect(app.ui.content.list.jsList.length).toBe(1);
    });

});