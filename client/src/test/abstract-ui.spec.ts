import {describe, expect, it} from "vitest";
import {Identity} from "@/Identity";
import {Starter} from "@/Starter";

describe('abstract ui', () => {

    it('can create object', async () => {
        let app : Identity = Starter.createAppWithUI();

        await app.appA.abstractUi.globalEvent_defaultAction();

        expect(app.appA.abstractUi.content.list.jsList.length).toBe(1);
    });

    it('can get json', async () => {
        let app : Identity = Starter.createAppWithUI();

        let json = app.json();

        expect(json.content.list).toEqual([]);
    });

    it('can export app', async () => {
        let app : Identity = Starter.createAppWithUI();
        expect(app.appA.abstractUi.output.getUi().hidden).toBe(true);

        await app.appA.abstractUi.globalEvent_exportApp();

        expect(app.appA.abstractUi.output.getUi().hidden).toBe(false);
    });

    it('can export content', async () => {
        let app : Identity = Starter.createAppWithUI();
        expect(app.appA.abstractUi.output.getUi().hidden).toBe(true);

        await app.appA.abstractUi.globalEvent_exportContent();

        expect(app.appA.abstractUi.output.getUi().hidden).toBe(false);
    });
});