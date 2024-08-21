import {describe, expect, it, test} from "vitest";
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

    it('can add identity to simple list', async () => {
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

        expect(path.pathA.listOfNames).toEqual([text.name]);
    });

    test('Object can get path of other object in same container', async () => {
        let app = Starter.createApp();
        let object = await app.appA_createText('foo');
        let otherObject = await app.appA_createText('bar');

        let path : Identity = object.getPath(otherObject);

        expect(path.pathA.listOfNames).toEqual(['..', otherObject.name]);
    });

    test('List can add object of same container', async () => {
        let app : Identity = Starter.createApp();
        let list : Identity = await app.appA_createList();
        let object : Identity = await app.appA_createText('bar');

        list.list.add(object);

        expect(list.list.jsList.length).toBe(1);
        expect(list.list.jsList.at(0).pathA.listOfNames).toEqual(list.getPath(object).pathA.listOfNames);
    });

    test('Object can resolve path of other object in same container', async () => {
        let app : Identity = Starter.createApp();
        let object : Identity = await app.appA_createText('bar');
        let otherObject : Identity = await app.appA_createText('foo');
        let pathOfOther : Identity = object.getPath(otherObject);

        let resolved : Identity = await object.resolve(pathOfOther);

        expect(resolved).toBe(otherObject);
    });

    it('can export app with one object', async () => {
        let app = Starter.createApp();
        let object = await app.appA_createText('foo');

        let exported : any = await app.export();

        expect(exported.objects).toBeTruthy();
        expect(exported.objects[object.name]).toBeTruthy();
        expect(exported.objects[object.name].text).toEqual('foo');
    });

    it('can get json of list with one item', async () => {
        let app = Starter.createApp();
        let list = await app.appA_createList();
        let item = await app.appA_createText('bar');
        list.list.add(item);

        let json : any = list.json();

        expect(json.list.length).toBe(1);
        expect(json.list[0]).toEqual(['..', item.name]);
    });

    it('can export list with one item', async () => {
        let app = Starter.createApp();
        let list = await app.appA_createList();
        let item = await app.appA_createText('bar');
        list.list.add(item);

        let exported : any = await list.export();

        expect(exported.dependencies).toBeTruthy();
        expect(exported.dependencies[0].path).toEqual(['..', item.name]);
        expect(exported.dependencies[0].value.text).toEqual('bar');
    });
});