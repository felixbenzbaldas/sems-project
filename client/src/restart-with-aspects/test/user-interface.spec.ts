import {describe, expect, it} from "vitest";
import {Identity} from "@/restart-with-aspects/Identity";
import {Starter} from "@/restart-with-aspects/Starter";

describe('user-interface', () => {

    it('can create object', async () => {
        let app : Identity = Starter.createAppWithUI();

        await app.ui.newSubitem();

        expect(app.ui.content.list.jsList.length).toBe(1);
    });

});