import {describe, expect, it, test} from "vitest";
import {Entity} from "@/Entity";
import {StarterA} from "@/StarterA";

describe('app', () => {

    it('can be created', async () => {
        let app : Entity = StarterA.createApp();

        expect(app).toBeTruthy();
    });

    it('can create an entity', async () => {
        let app : Entity = StarterA.createApp();

        let entity : Entity = app.appA.createEntityWithApp();

        expect(entity).toBeTruthy();
    });

    it('can set text', async () => {
        let app : Entity = StarterA.createApp();

        app.text = 'my application';

        expect(app.text).toBe('my application');
    });

    it('can create a simple list', async () => {
        let app : Entity = StarterA.createApp();

        let list : Entity = app.appA.unboundG.createList();

        expect(list.listA.jsList.length).toBe(0);
    });

    it('can create text', async () => {
        let app = StarterA.createApp();

        let text = await app.appA.createText('foo');

        expect(text.text).toEqual('foo');
    });

    it('can create list', async () => {
        let app = StarterA.createApp();

        let list = await app.appA.createList();

        expect(list.listA.jsList.length).toBe(0);
    });

    it('assigns created object to container', async () => {
        let app = StarterA.createApp();

        let text = await app.appA.createText('');

        expect(text.name).toBeTruthy();
        expect(text.container).toBe(app);
        expect(app.containerA.mapNameEntity.get(text.name)).toBe(text);
    });

    it('can export app with one object', async () => {
        let app = StarterA.createApp();
        let object = await app.appA.createText('foo');

        let exported : any = await app.export();

        expect(exported.objects).toBeTruthy();
        expect(exported.objects[object.name]).toBeTruthy();
        expect(exported.objects[object.name].text).toEqual('foo');
    });

    it('can log', async () => {
        let app = StarterA.createApp();
        app.text = 'my app';
        // app.appA.logG.toConsole = true;
        app.appA.logG.toListOfStrings = true;

        app.log('Good morning!');

        expect(app.appA.logG.listOfStrings).contains('my app /// Good morning!');
    });

    test('Can get shortDescription of text', async () => {
        let app : Entity = StarterA.createApp();
        let text : Entity = app.appA.unboundG.createText('12345678901234567890123456789012');

        let shortDescription = text.getShortDescription();

        expect(shortDescription).toEqual('12345678901234567890');
    });

});