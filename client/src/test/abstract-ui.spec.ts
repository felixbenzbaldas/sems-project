import {describe, expect, it} from "vitest";
import {Identity} from "@/Identity";
import {Starter} from "@/Starter";

describe('abstract ui', () => {

    it('can create object', async () => {
        let app : Identity = Starter.createAppWithUI();

        await app.abstractUi.defaultAction();

        expect(app.abstractUi.content.list.jsList.length).toBe(1);
    });

    it('can get json', async () => {
        let app : Identity = Starter.createAppWithUI();

        let json = app.json();

        expect(json.content.list).toEqual([]);
    });

    it('can export', async () => {
        let app : Identity = Starter.createAppWithUI();
        expect(app.abstractUi.output.getUi().hidden).toBe(true);

        app.abstractUi.export();

        expect(app.abstractUi.output.getUi().hidden).toBe(false);
    });

});