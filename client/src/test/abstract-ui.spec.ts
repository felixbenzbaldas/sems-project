import {describe, expect, it, test} from "vitest";
import {Identity} from "@/Identity";
import {Starter} from "@/Starter";
import {wait} from "@/utils";

describe('abstract ui', () => {

    it('can create object', async () => {
        let app : Identity = Starter.createAppWithUI();

        await app.appA.ui.globalEvent_defaultAction();

        expect(app.appA.ui.content.list.jsList.length).toBe(1);
    });

    it('can get json', async () => {
        let app : Identity = Starter.createAppWithUI();

        let json = app.json();

        expect(json.content.list).toEqual([]);
    });

    it('can export app', async () => {
        let app : Identity = Starter.createAppWithUI();
        expect(app.appA.ui.output.getUi().hidden).toBe(true);

        await app.appA.ui.globalEvent_exportApp();

        expect(app.appA.ui.output.getUi().hidden).toBe(false);
    });

    it('can export content', async () => {
        let app : Identity = Starter.createAppWithUI();
        expect(app.appA.ui.output.getUi().hidden).toBe(true);

        await app.appA.ui.globalEvent_exportContent();

        expect(app.appA.ui.output.getUi().hidden).toBe(false);
    });

    it('can import to content', async () => {
        let app = Starter.createAppWithUI();
        app.appA.ui.input.set('{"list":[["..","0"]],"dependencies":[{"name":"0","text":"new item"}]}');

        await app.appA.ui.globalEvent_importToContent();

        expect(app.containerA.mapNameIdentity.size).toBe(1);
    });

    test('At beginning the app object has the focus', async () => {
        let app = Starter.createAppWithUI();

        expect(app.appA.ui.focused).toBe(app);
        expect(app.ui_hasFocus()).toBeTruthy();
    });

    test('Created object has focus', async () => {
        let app = Starter.createAppWithUI();

        await app.appA.ui.globalEvent_defaultAction();

        expect((await app.appA.ui.content.list.getObject(0)).ui_hasFocus()).toBeTruthy();
    });

    test('can create object after created object', async () => {
        let app = Starter.createAppWithUI();
        await app.appA.ui.globalEvent_defaultAction();
        await wait(10);

        await app.appA.ui.globalEvent_defaultAction();
        await wait(10);

        expect(app.appA.ui.content.list.jsList.length).toBe(2);
        let resolvedContent = await app.appA.ui.content.list.getResolvedList();
        expect(app.appA.ui.focused).toBe(resolvedContent.at(1));
    });
});