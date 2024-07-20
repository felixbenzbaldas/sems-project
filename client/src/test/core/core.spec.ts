import {describe, expect, it, test} from 'vitest'
import {Path} from "@/core/Path";
import {SemsObject} from "@/core/SemsObject";
import {App} from "@/core/App";
import {TestUtil} from "@/test/TestUtil";

const testConfiguration = TestUtil.getTestConfiguration();

describe('core', () => {
    test('Created object has valid name', async () => {
        let app = new App(testConfiguration);

        let object = await app.createObject();

        expect(object.getName()).match(/^[0-9a-zA-Z]{5,20}$/);
    });

    it('can set text of object', async () => {
        let app = new App(testConfiguration);
        let object = await app.createObject();

        await object.setText('new text');

        expect(object.getText()).toEqual('new text');
    });

    it('stores created object in cache', async () => {
        let app : App = new App(testConfiguration);

        let createdObject : SemsObject = await app.createObject();

        let path : Path = app.getLocation().getPath(createdObject);
        expect(createdObject).toBe(await app.getLocation().getObject(path));
    });

    it('can get object for empty path', async () => {
        let app = new App(testConfiguration);

        let object : SemsObject = await app.getLocation().getObject(new Path([]));

        expect(object).toBeTruthy();
        expect(app.getLocation().getPath(object)).toEqual(new Path([]));

        // object has to be stored in cache
        expect(object).toBe(await app.getLocation().getObject(new Path([])));
    });

    it('can get object for path (with two parts)', async () => {
        let app = new App(testConfiguration);
        let object = await app.createObject();
        let path : Path = app.getLocation().getPath(object);

        let app2 = new App(testConfiguration);
        let object2 = await app2.getLocation().getObject(path);

        expect(object2).toBeTruthy();
        let path2 =  app2.getLocation().getPath(object2);
        expect(path2.toList()).toEqual(path.toList());
    });

    it('can add detail to empty object', async () => {
        let app = new App(testConfiguration);
        let object = await app.createObject();
        let detail = await app.createObject();
        let pathOfDetail = app.getLocation().getPath(detail);
        let detailsProperty = object.getListProperty('details');

        await detailsProperty.addItem(pathOfDetail);

        expect(detailsProperty.length()).toBe(1);
        expect(detailsProperty.getItem(0)).toBe(pathOfDetail);
    });

    it('can remove all items from list property', async () => {
        let app = new App(testConfiguration);
        let object : SemsObject = await app.createObject();
        let listProperty = object.getListProperty('anyProperty');
        await listProperty.addItem(new Path(['anyName']));
        expect(listProperty.length()).toBe(1);

        await listProperty.removeAllItems();

        expect(listProperty.length()).toBe(0);
    });

    it('can subscribe list property', async () => {
        let app = new App(testConfiguration);
        let object : SemsObject = await app.createObject();
        let listProperty = object.getListProperty('anyProperty');
        let addedItem = false;

        listProperty.subscribe(event => {
            addedItem = true;
        });

        await listProperty.addItem(new Path(['anyName']));
        expect(addedItem).toBe(true);
    });

    it('can load list property from server', async () => {
        let app = new App(testConfiguration);
        let object = await app.createObject();
        let pathOfListItem = new Path(['123']);
        let propertyName = 'aListProp';
        await object.getListProperty(propertyName).addItem(pathOfListItem);
        let path = app.getLocation().getPath(object);
        let app2 = new App(testConfiguration);

        let object2 = await app2.getLocation().getObject(path);

        expect(object2.getListProperty(propertyName).getItem(0)).toEqual(pathOfListItem);
    });
});