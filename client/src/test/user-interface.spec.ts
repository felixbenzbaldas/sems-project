import {describe, expect, it, test} from 'vitest'
import {App} from "@/core/App";
import type {UserInterfaceObject} from "@/user-interface/UserInterfaceObject";
import {UserInterface} from "@/user-interface/UserInterface";
import {TestUtil} from "@/test/TestUtil";

const testConfiguration = TestUtil.getTestConfiguration();

/// caution: uses the working place of the server! Do not run in parallel with other tests, that use it.
describe('user-interface', () => {

    it('can clear working place', async ()=> {
        let app = new App(testConfiguration);
        let userInterface = await UserInterface.load(app);
        await userInterface.newSubitem();

        await userInterface.clearWorkingPlace();

        let workingPlace: UserInterfaceObject = await userInterface.getWorkingPlace();
        expect(workingPlace.listAspect.isEmpty()).toBeTruthy();
    });

    test('Working place is focused after loading', async () => {
        let app = new App(testConfiguration);

        let userInterface = await UserInterface.load(app);

        let workingPlace : UserInterfaceObject = await userInterface.getWorkingPlace();
        expect(workingPlace.hasFocus()).toBeTruthy();
    });


    it('can create object in working place', async () => {
        let app = new App(testConfiguration);
        let userInterface = await UserInterface.load(app);
        await userInterface.clearWorkingPlace();

        await userInterface.newSubitem();

        let workingPlace: UserInterfaceObject = await userInterface.getWorkingPlace();
        expect(workingPlace.listAspect.getLength()).toBe(1);
    });

    it('focuses created object', async () => {
        let app = new App(testConfiguration);
        let userInterface = await UserInterface.load(app);

        await userInterface.newSubitem();

        let focused : UserInterfaceObject = userInterface.getFocusedUIO();
        expect(focused).toBe((await userInterface.getWorkingPlace()).listAspect.get(0));
    });

    it('can create detail of object', async () => {
        let app = new App(testConfiguration);
        let userInterface = await UserInterface.load(app);
        await userInterface.newSubitem();
        let objectUIO = userInterface.getFocusedUIO();

        await userInterface.newSubitem();

        expect(objectUIO.detailsAspect.getLength()).toBe(1);
    });

    // test('UIO of empty object has no body', async () => {
    //     let app = new App(testConfiguration);
    //     let userInterface = new UserInterface(app);
    //     await userInterface.clearWorkingPlace();
    //     await userInterface.newSubitem();
    //     let uio : UserInterfaceObject = (await userInterface.getWorkingPlace()).listAspect.get(0);
    //
    //     expect(uio.hasBody()).toBe(false);
    // });
    //
    // test('UIO of object with detail has body', async () => {
    //     let app = new App(testConfiguration);
    //     let userInterface = new UserInterface(app);
    //     await userInterface.clearWorkingPlace();
    //     await userInterface.newSubitem();
    //     await userInterface.newSubitem(); // create detail
    //     let uio : UserInterfaceObject = (await userInterface.getWorkingPlace()).listAspect.get(0);
    //
    //     expect(uio.hasBody()).toBe(true);
    // });
});