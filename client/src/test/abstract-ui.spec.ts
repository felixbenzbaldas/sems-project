import {describe, expect, it, test} from "vitest";
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

    it('can import to content', async () => {
        let app = Starter.createAppWithUI();
        app.appA.abstractUi.input.set('{"list":[["..","0"]],"dependencies":[{"name":"0","text":"new item"}]}');

        await app.appA.abstractUi.globalEvent_importToContent();

        expect(app.containerA.mapNameIdentity.size).toBe(1);
    });

    test('At beginning the app object has the focus', async () => {
        let app = Starter.createAppWithUI();

        expect(app.appA.abstractUi.focused).toBe(app);
        expect(app.ui_hasFocus()).toBeTruthy();
    });

    test('Created object has focus', async () => {
        let app = Starter.createAppWithUI();

        await app.appA.abstractUi.globalEvent_defaultAction();

        expect((await app.appA.abstractUi.content.list.getObject(0)).ui_hasFocus()).toBeTruthy();
    });
});