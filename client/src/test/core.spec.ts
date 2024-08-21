import {describe, expect, it} from "vitest";
import {Identity} from "@/Identity";
import {Starter} from "@/Starter";

describe('app', () => {

    it('can be created', async () => {
        let app : Identity = Starter.createApp();

        expect(app.text).toEqual('Sems application');
    });

    it('can create an identity', async () => {
        let app : Identity = Starter.createApp();

        let identity : Identity = app.appA_createIdentity();

        expect(identity).toBeTruthy();
    });

    it('can set text', async () => {
        let app : Identity = Starter.createApp();

        app.text = 'my application';

        expect(app.text).toBe('my application');
    });

    it('can create a simple list', async () => {
        let app : Identity = Starter.createApp();

        let list : Identity = app.appA_simple_createList();

        expect(list.list.jsList.length).toBe(0);
    });

    it('can add identity to list', async () => {
        let app : Identity = Starter.createApp();
        let list : Identity = app.appA_simple_createList();

        list.list.add(app.appA_createIdentity());

        expect(list.list.jsList.length).toBe(1);
    });

    it('can get json', async () => {
        let app : Identity = Starter.createApp();
        app.text = 'my app';

        let json = app.json();

        expect(json.text).toEqual('my app');
    });

    it('can get json of empty simple list', async () => {
        let app : Identity = Starter.createApp();
        let list : Identity = app.appA_simple_createList();

        let json = list.json();

        expect(json.list).toEqual([]);
    });

    it('can create text', async () => {
        let app = Starter.createApp();

        let text = await app.appA_createText('foo');

        expect(text.text).toEqual('foo');
    });

    it('can create list', async () => {
        let app = Starter.createApp();

        let list = await app.appA_createList();

        expect(list.list.jsList.length).toBe(0);
    });

    it('assigns created object to container', async () => {
        let app = Starter.createApp();

        let text = await app.appA_createText('');

        expect(text.name).toBeTruthy();
        expect(text.container).toBe(app);
        expect(app.containerA_mapNameIdentity.get(text.name)).toBe(text);
    });

    it('can get path', async () => {
        let app = Starter.createApp();
        let text = await app.appA_createText('');

        let path : Identity = app.getPath(text);

        expect(path.pathA.toList()).toEqual([text.name]);
    });

});