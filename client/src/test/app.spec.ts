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

        let identity : Identity = app.appA.createIdentity();

        expect(identity).toBeTruthy();
    });

    it('can set text', async () => {
        let app : Identity = Starter.createApp();

        app.text = 'my application';

        expect(app.text).toBe('my application');
    });

    it('can create a simple list', async () => {
        let app : Identity = Starter.createApp();

        let list : Identity = app.appA.simple_createList();

        expect(list.list.jsList.length).toBe(0);
    });

    it('can get json', async () => {
        let app : Identity = Starter.createApp();
        app.text = 'my app';

        let json = app.json();

        expect(json.text).toEqual('my app');
    });

    it('can create text', async () => {
        let app = Starter.createApp();

        let text = await app.appA.createText('foo');

        expect(text.text).toEqual('foo');
    });

    it('can create list', async () => {
        let app = Starter.createApp();

        let list = await app.appA.createList();

        expect(list.list.jsList.length).toBe(0);
    });

    it('assigns created object to container', async () => {
        let app = Starter.createApp();

        let text = await app.appA.createText('');

        expect(text.name).toBeTruthy();
        expect(text.container).toBe(app);
        expect(app.containerA.mapNameIdentity.get(text.name)).toBe(text);
    });

    it('can get path', async () => {
        let app = Starter.createApp();
        let text = await app.appA.createText('');

        let path : Identity = app.getPath(text);

        expect(path.pathA.listOfNames).toEqual([text.name]);
    });

    it('can export app with one object', async () => {
        let app = Starter.createApp();
        let object = await app.appA.createText('foo');

        let exported : any = await app.export_keepContainerStructure_ignoreExternalDependencies();

        expect(exported.objects).toBeTruthy();
        expect(exported.objects[object.name]).toBeTruthy();
        expect(exported.objects[object.name].text).toEqual('foo');
    });

    test('can add all to list from raw data (empty)', async () => {
        let app = Starter.createApp();
        let list = await app.appA.createList();
        let rawData : any = {list:[]};

        await app.appA.addAllToListFromRawData(list, rawData);

        expect(list.list.jsList.length).toBe(0);
    });

    test('can add all to list from raw data (one item)', async () => {
        let app = Starter.createApp();
        let list = await app.appA.createList();
        let rawData : any = {
            list:[['..','0']],
            dependencies:[
                {
                    name: '0',
                    text:'new item'
                }
            ]
        };

        await app.appA.addAllToListFromRawData(list, rawData);

        expect(list.list.jsList.length).toBe(1);
        expect((await list.resolve(list.list.jsList.at(0))).text).toEqual('new item');
    });

});