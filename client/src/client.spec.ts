import {describe, expect, it} from 'vitest'
import {Location} from "@/core/Location";
import {Http} from "@/core/Http";
import {Path} from "@/core/Path";
import {RemoteObject} from "@/core/RemoteObject";
import {App} from "@/core/App";
import {configuration} from "@/core/configuration";
import {House} from "@/core/House";
import type {ObservableList} from "@/core/ObservableList";
import type {UserInterfaceObject} from "@/user-interface/UserInterfaceObject";
import {UserInterface} from "@/user-interface/UserInterface";

const testServer = 'http://localhost:8081/';

describe('app', () => {
    it('can create object with text', async () => {
        let http = new Http();
        let location = new Location(http);
        location.setHttpAddress(testServer);
        let house = await location.getHouse(new Path(['house1']));

        let object : RemoteObject = await house.createObjectWithText('some text');

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

        let createdObject : RemoteObject = await app.createObject();

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

    it('can focus working place', async () => {
        let app = new App(configuration);
        let userInterface = new UserInterface(app);
        let workingPlace : UserInterfaceObject = await userInterface.getWorkingPlace();

        workingPlace.focus();

        expect(workingPlace.hasFocus()).toBeTruthy();
    });

    it('can get objects in working place', async () => {
        let app = new App(configuration);
        await app.clearWorkingPlace();
        let userInterface = new UserInterface(app);
        let workingPlace : UserInterfaceObject = await userInterface.getWorkingPlace();

        let objectsInWorkingPlace : ObservableList<UserInterfaceObject> = workingPlace.getListOfUIOs();

        expect(objectsInWorkingPlace.isEmpty()).toBeTruthy();
    });
});

describe('location', () => {
    it('can get path of object', () => {
        let http = new Http();
        let location = new Location(http);
        let house = new House(http, location, 'house2');
        let object = new RemoteObject(location, 'kfj6346jEE', {text:'foo'});
        object.setContainer(house);

        let path : Path = location.getPath(object);

        expect(path.toList()).toEqual(['house2', 'kfj6346jEE']);
    });
});