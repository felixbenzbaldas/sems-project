import {describe, expect, it, test, vi} from 'vitest'
import {Location} from "@/core/Location";
import {Http} from "@/core/Http";
import {Path} from "@/core/Path";
import {SemsObject} from "@/core/SemsObject";
import {App} from "@/core/App";
import {configuration} from "@/core/configuration";
import {House} from "@/core/House";
import {UserInterface} from "@/user-interface/UserInterface";

const testServer = 'http://localhost:8081/';

describe('core', () => {
    it('can create object with text', async () => {
        let http = new Http();
        let location = new Location(http);
        location.setHttpAddress(testServer);
        let house = await location.getHouse(new Path(['house1']));

        let object : SemsObject = await house.createObjectWithText('some text');

        expect(object.getName()).match(/^[0-9a-zA-Z]{5,20}$/);
        expect(object.getText()).toEqual('some text');
    });

    it('can set text of object', async () => {
        let app = new App(configuration);
        let object = await app.createObject();

        await object.setText('new text');

        expect(object.getText()).toEqual('new text');
    });

    it('stores created object in cache', async () => {
        let app : App = new App(configuration);

        let createdObject : SemsObject = await app.createObject();

        let path : Path = app.getLocation().getPath(createdObject);
        expect(createdObject).toBe(await app.getLocation().getObject(path));
    });

    it('can get object for empty path', async () => {
        let app = new App(configuration);

        let object : SemsObject = await app.getLocation().getObject(new Path([]));

        expect(object).toBeTruthy();
        expect(app.getLocation().getPath(object)).toEqual(new Path([]));

        // object has to be stored in cache
        expect(object).toBe(await app.getLocation().getObject(new Path([])));
    });

    it('can get object for path (with two parts)', async () => {
        let app = new App(configuration);
        let object = await app.createObject();
        let path : Path = app.getLocation().getPath(object);

        let app2 = new App(configuration);
        let object2 = await app2.getLocation().getObject(path);

        expect(object2).toBeTruthy();
        let path2 =  app2.getLocation().getPath(object2);
        expect(path2.toList()).toEqual(path.toList());
    });

    test('Empty object has no details', async () => {
        let app = new App(configuration);
        let object = await app.createObject();

        expect(object.getListProperty('details').length()).toBe(0);
    });

    it('can add detail to empty object', async () => {
        let app = new App(configuration);
        let object = await app.createObject();
        let detail = await app.createObject();
        let pathOfDetail = app.getLocation().getPath(detail);
        let detailsProperty = object.getListProperty('details');

        await detailsProperty.addItem(pathOfDetail);

        expect(detailsProperty.length()).toBe(1);
        expect(detailsProperty.getItem(0)).toBe(pathOfDetail);
    });

    it('can remove all items from list property', async () => {
        let app = new App(configuration);
        let object : SemsObject = await app.createObject();
        let listProperty = object.getListProperty('anyProperty');
        await listProperty.addItem(new Path(['anyName']));
        expect(listProperty.length()).toBe(1);

        await listProperty.removeAllItems();

        expect(listProperty.length()).toBe(0);
    });

    it('can subscribe list property', async () => {
        let app = new App(configuration);
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
        let app = new App(configuration);
        let object = await app.createObject();
        let pathOfListItem = new Path(['123']);
        let propertyName = 'aListProp';
        await object.getListProperty(propertyName).addItem(pathOfListItem);
        let path = app.getLocation().getPath(object);
        let app2 = new App(configuration);

        let object2 = await app2.getLocation().getObject(path);

        expect(object2.getListProperty(propertyName).getItem(0)).toEqual(pathOfListItem);
    });
});

describe('location', () => {
    it('can get path of object', () => {
        let http = new Http();
        let location = new Location(http);
        let house = new House(http, location, 'house2');
        let object = new SemsObject(location, 'kfj6346jEE', {text:'foo'});
        object.setContainer(house);

        let path : Path = location.getPath(object);

        expect(path.toList()).toEqual(['house2', 'kfj6346jEE']);
    });
});

/// example for usage of a test-double
describe('test-double', () => {
   test('request', async () => {
       let httpMock = {} as Http;
       httpMock.request = vi.fn(async () => {
           return '';
       });
       let app = new App(configuration, httpMock);

       let object = await app.createObject();

       expect(httpMock.request).toHaveBeenCalled();
   });
});