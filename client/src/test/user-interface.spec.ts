import {describe, expect, it, test} from 'vitest'
import {App} from "@/core/App";
import {configuration} from "@/core/configuration";
import type {UserInterfaceObject} from "@/user-interface/UserInterfaceObject";
import {UserInterface} from "@/user-interface/UserInterface";

/// caution: uses the working place of the server! Do not run in parallel with other tests, that use it.
describe('user-interface', () => {
    // it('can get working place', async () => {
    //     let app = new App(configuration);
    //     let userInterface = new UserInterface(app);
    //
    //     let workingPlace: UserInterfaceObject = await userInterface.getWorkingPlace();
    //
    //     expect(workingPlace).toBeTruthy();
    // });

    it('can get working place 2', async () => {
        let app = new App(configuration);
        let userInterface = new UserInterface(app);

        let workingPlace: UserInterfaceObject = await userInterface.getWorkingPlace2();

        expect(workingPlace).toBeTruthy();
    });

    // it('can clear working place', async () => {
    //     let app = new App(configuration);
    //     let userInterface = new UserInterface(app);
    //
    //     await userInterface.clearWorkingPlace();
    //
    //     let workingPlace: UserInterfaceObject = await userInterface.getWorkingPlace();
    //     expect(workingPlace.listAspect.isEmpty()).toBeTruthy();
    // });

    it('can clear working place 2', async () => {
        let app = new App(configuration);
        let userInterface = new UserInterface(app);

        await userInterface.clearWorkingPlace2();

        let workingPlace: UserInterfaceObject = await userInterface.getWorkingPlace2();
        expect(workingPlace.listAspect2.isEmpty()).toBeTruthy();
    });

    test('Working place is focused after loading', async () => {
        let app = new App(configuration);
        let userInterface = new UserInterface(app);

        await userInterface.load();

        let workingPlace : UserInterfaceObject = await userInterface.getWorkingPlace2();
        expect(workingPlace.hasFocus()).toBeTruthy();
    });

    // it('can create object', async () => {
    //     let app = new App(configuration);
    //     let userInterface = new UserInterface(app);
    //     await userInterface.clearWorkingPlace();
    //
    //     await userInterface.newSubitem();
    //
    //     let workingPlace: UserInterfaceObject = await userInterface.getWorkingPlace();
    //     expect(workingPlace.listAspect.length()).toBe(1);
    // });

    it('can create object 2', async () => {
        let app = new App(configuration);
        let userInterface = new UserInterface(app);
        await userInterface.load();
        await userInterface.clearWorkingPlace2();

        await userInterface.newSubitem2();

        let workingPlace: UserInterfaceObject = await userInterface.getWorkingPlace2();
        expect(workingPlace.listAspect2.getLength()).toBe(1);
    });

    // it('focuses created object', async () => {
    //     let app = new App(configuration);
    //     let userInterface = new UserInterface(app);
    //     await userInterface.clearWorkingPlace();
    //
    //     await userInterface.newSubitem();
    //
    //     let focused : UserInterfaceObject = userInterface.getFocusedUIO();
    //     expect(focused).toBe((await userInterface.getWorkingPlace()).listAspect.get(0));
    // });

    // test('UIO of empty object has no body', async () => {
    //     let app = new App(configuration);
    //     let userInterface = new UserInterface(app);
    //     await userInterface.clearWorkingPlace();
    //     await userInterface.newSubitem();
    //     let uio : UserInterfaceObject = (await userInterface.getWorkingPlace()).listAspect.get(0);
    //
    //     expect(uio.hasBody()).toBe(false);
    // });
    //
    // test('UIO of object with detail has body', async () => {
    //     let app = new App(configuration);
    //     let userInterface = new UserInterface(app);
    //     await userInterface.clearWorkingPlace();
    //     await userInterface.newSubitem();
    //     await userInterface.newSubitem(); // create detail
    //     let uio : UserInterfaceObject = (await userInterface.getWorkingPlace()).listAspect.get(0);
    //
    //     expect(uio.hasBody()).toBe(true);
    // });
});