import {describe, expect, it, test} from 'vitest'
import {Path} from "@/deprecated/core/Path";
import {SemsObject} from "@/deprecated/core/SemsObject";
import {App} from "@/deprecated/core/App";
import {TestUtil} from "@/deprecated/test/TestUtil";

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
        let location = app.getLocation();

        let createdObject : SemsObject = await app.createObject();

        let path : Path = location.getPath(createdObject);
        expect(createdObject).toBe(await location.getObject(path));
    });

    it('can get object for empty path', async () => {
        let app = new App(testConfiguration);
        let location = app.getLocation();

        let object : SemsObject = await location.getObject(Path.empty());

        expect(object).toBeTruthy();
        expect(location.getPath(object)).toEqual(Path.empty());

        // object has to be stored in cache
        expect(object).toBe(await location.getObject(Path.empty()));
    });

    it('can get object for path (with two parts)', async () => {
        let path = await createObject();
        let app = new App(testConfiguration);
        let location = app.getLocation();

        let object = await location.getObject(path);

        expect(object).toBeTruthy();
        expect(location.getPath(object).toList()).toEqual(path.toList());
    });

    async function createObject() : Promise<Path> {
        let app = new App(testConfiguration);
        let object = await app.createObject();
        return app.getLocation().getPath(object);
    }

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
        let propertyName = 'aListProp';
        let pathOfListItem = new Path(['123']);
        let path = await createObjetWithListProperty(propertyName, pathOfListItem);
        let app = new App(testConfiguration);

        let object = await app.getLocation().getObject(path);

        expect(object.getListProperty(propertyName).getItem(0)).toEqual(pathOfListItem);
    });

    async function createObjetWithListProperty(propertyName: string, pathOfListItem: Path) : Promise<Path> {
        let app = new App(testConfiguration);
        let object = await app.createObject();
        await object.getListProperty(propertyName).addItem(pathOfListItem);
        return app.getLocation().getPath(object);
    }
});