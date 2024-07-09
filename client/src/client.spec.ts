import {describe, expect, it, test} from 'vitest'
import {Location} from "@/core/Location";
import {Http} from "@/core/Http";
import {Path} from "@/core/Path";
import {SemsObject} from "@/core/SemsObject";
import {App} from "@/core/App";
import {configuration} from "@/core/configuration";
import {House} from "@/core/House";
import type {UserInterfaceObject} from "@/user-interface/UserInterfaceObject";
import {UserInterface} from "@/user-interface/UserInterface";

const testServer = 'http://localhost:8081/';

describe('app', () => {
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
        let object = await app.createObjectInWorkingPlace();

        await object.setText('new text');

        expect(object.getText()).toEqual('new text');
    });

    it('stores created object in cache', async () => {
        let app : App = new App(configuration);

        let createdObject : SemsObject = await app.createObject();

        let path : Path = app.getLocation().getPath(createdObject);
        expect(createdObject).toBe(await app.getLocation().getObject(path));
    });

    it('can get object by path', async () => {
        let app = new App(configuration);
        let object = await app.createObject();
        let path : Path = app.getLocation().getPath(object);

        let app2 = new App(configuration);
        let object2 = await app2.getLocation().getObject(path);

        expect(object2).toBeTruthy();
        let path2 =  app2.getLocation().getPath(object2);
        expect(path2.toList()).toEqual(path.toList());
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

describe('user-interface', () => {
    it('can get working place', async () => {
        let app = new App(configuration);
        let userInterface = new UserInterface(app);

        let workingPlace: UserInterfaceObject = await userInterface.getWorkingPlace();

        expect(workingPlace).toBeTruthy();
    });

    it('can clear working place', async () => {
        let app = new App(configuration);
        let userInterface = new UserInterface(app);

        await userInterface.clearWorkingPlace();

        let workingPlace: UserInterfaceObject = await userInterface.getWorkingPlace();
        expect(workingPlace.listAspect.isEmpty()).toBeTruthy();
    });

    test('working place is focused after loading', async () => {
        let app = new App(configuration);
        let userInterface = new UserInterface(app);

        await userInterface.load();

        let workingPlace : UserInterfaceObject = await userInterface.getWorkingPlace();
        expect(workingPlace.hasFocus()).toBeTruthy();
    });

    it('can create object', async () => {
        let app = new App(configuration);
        let userInterface = new UserInterface(app);
        await userInterface.clearWorkingPlace();

        await userInterface.newSubitem();

        let workingPlace: UserInterfaceObject = await userInterface.getWorkingPlace();
        expect(workingPlace.listAspect.length()).toBe(1);
    });

    // test if the object is stored on the server
    it('can store working place', async () => {
        let app = new App(configuration);
        let userInterface = new UserInterface(app);
        await userInterface.clearWorkingPlace();

        await userInterface.newSubitem();

        let name = (await userInterface.getWorkingPlace()).listAspect.get(0).getSemsObject().getName();
        let app2 = new App(configuration);
        let userInterface2 = new UserInterface(app2);
        let name2 = (await userInterface2.getWorkingPlace()).listAspect.get(0).getSemsObject().getName();
        expect(name).toEqual(name2);
    });

    it('focuses created object', async () => {
        let app = new App(configuration);
        let userInterface = new UserInterface(app);
        await userInterface.clearWorkingPlace();

        await userInterface.newSubitem();

        let focused : UserInterfaceObject = userInterface.getFocusedUIO();
        expect(focused).toBe((await userInterface.getWorkingPlace()).listAspect.get(0));
    });
});