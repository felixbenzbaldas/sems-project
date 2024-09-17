import {describe, expect, it, test} from "vitest";
import {Entity} from "@/Entity";
import {Starter} from "@/Starter";
import {wait} from "@/utils";

describe('ui', () => {

    it('can create object', async () => {
        let app : Entity = Starter.createAppWithUI();

        await app.appA.uiA.globalEventG.defaultAction();

        expect(app.appA.uiA.content.list.jsList.length).toBe(1);
    });

    it('can get json', async () => {
        let app : Entity = Starter.createAppWithUI();

        let json = app.json();

        expect(json.content.list).toEqual([]);
    });

    it('can export app', async () => {
        let app : Entity = Starter.createAppWithUI();
        expect(app.appA.uiA.output.getUi().hidden).toBe(true);

        await app.appA.uiA.globalEventG.exportApp();

        expect(app.appA.uiA.output.getUi().hidden).toBe(false);
    });

    it('can flat export content', async () => {
        let app : Entity = Starter.createAppWithUI();
        expect(app.appA.uiA.output.getUi().hidden).toBe(true);

        await app.appA.uiA.globalEventG.flatExportContent();

        expect(app.appA.uiA.output.getUi().hidden).toBe(false);
    });

    it('can flat import to content', async () => {
        let app = Starter.createAppWithUI();
        app.appA.uiA.input.set('{"list":[["..","0"]],"dependencies":[{"name":"0","text":"new item"}]}');

        await app.appA.uiA.globalEventG.flatImportToContent();

        expect(app.containerA.mapNameEntity.size).toBe(1);
    });

    test('At beginning the app object has the focus', async () => {
        let app = Starter.createAppWithUI();

        expect(app.appA.uiA.focused).toBe(app);
        expect(app.ui_hasFocus()).toBeTruthy();
    });

    test('Created object has focus', async () => {
        let app = Starter.createAppWithUI();

        await app.appA.uiA.globalEventG.defaultAction();

        expect((await app.appA.uiA.content.list.getObject(0)).ui_hasFocus()).toBeTruthy();
    });

    test('can create object after created object', async () => {
        let app = Starter.createAppWithUI();
        await app.appA.uiA.globalEventG.defaultAction();

        await app.appA.uiA.globalEventG.defaultAction();

        expect(app.appA.uiA.content.list.jsList.length).toBe(2);
        let resolvedContent = await app.appA.uiA.content.list.getResolvedList();
        expect(app.appA.uiA.focused).toBe(resolvedContent.at(1));
    });
});