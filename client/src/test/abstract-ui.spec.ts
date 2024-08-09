import {describe, expect, it} from "vitest";
import {Identity} from "@/Identity";
import {Starter} from "@/Starter";

describe('abstract ui for local app', () => {

    it('can create object', async () => {
        let app : Identity = Starter.createAppWithUI();

        await app.abstractUi.defaultAction();

        expect(app.abstractUi.content.list.jsList.length).toBe(1);
    });

});