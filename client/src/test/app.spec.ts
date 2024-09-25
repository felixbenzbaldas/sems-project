import {describe, expect, it, test} from "vitest";
import {Entity} from "@/Entity";
import {Starter} from "@/Starter";

describe('app', () => {

    it('can be created', async () => {
        let app : Entity = Starter.createApp();

        expect(app.text).toEqual('simple application');
    });

    it('can create an entity', async () => {
        let app : Entity = Starter.createApp();

        let entity : Entity = app.appA.createEntityWithApp();

        expect(entity).toBeTruthy();
    });

    it('can set text', async () => {
        let app : Entity = Starter.createApp();

        app.text = 'my application';

        expect(app.text).toBe('my application');
    });

    it('can create a simple list', async () => {
        let app : Entity = Starter.createApp();

        let list : Entity = app.appA.unboundG.createList();

        expect(list.list.jsList.length).toBe(0);
    });

    it('can get json (without contained objects)', async () => {
        let app : Entity = Starter.createApp();
        app.text = 'my app';

        let json = app.json_withoutContainedObjects();

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
        expect(app.containerA.mapNameEntity.get(text.name)).toBe(text);
    });

    it('can export app with one object', async () => {
        let app = Starter.createApp();
        let object = await app.appA.createText('foo');

        let exported : any = await app.export();

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

    it('can log', async () => {
        let app = Starter.createApp();
        app.text = 'my app';
        // app.appA.logG.toConsole = true;
        app.appA.logG.toListOfStrings = true;

        app.log('Good morning!');

        expect(app.appA.logG.listOfStrings).contains('my app /// Good morning!');
    });

    test('Can get shortDescription of text', async () => {
        let app : Entity = Starter.createApp();
        let text : Entity = app.appA.unboundG.createText('12345678901234567890123456789012');

        let shortDescription = text.getShortDescription();

        expect(shortDescription).toEqual('12345678901234567890');
    });

    test('Can get description of path', async () => {
        let app : Entity = Starter.createApp();
        let path : Entity = app.appA.createPath(['a', 'b']);

        let description = path.getDescription();

        expect(description).toEqual('path (a,b)');
    });

});