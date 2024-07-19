import {UserInterfaceObject} from "@/user-interface/UserInterfaceObject";
import type {App} from "@/core/App";
import type {SemsObject} from "@/core/SemsObject";
// import {ListAspectForUIO} from "@/user-interface/ListAspectForUIO";
import {ListAspectForUIO2} from "@/user-interface/ListAspectForUIO2";
import {Path} from "@/core/Path";
import {ViewOnObjects} from "@/user-interface/ViewOnObjects";

export class UserInterface {

    // private focused : any;
    // private workingPlace : UserInterfaceObject;
    private workingPlace2: UserInterfaceObject;

    private focusedUIO : UserInterfaceObject;

    constructor(private app : App) {
    }

    setFocused(object : any) {
        this.focusedUIO = object;
    }

    getFocused() : any {
        return this.focusedUIO;
    }

    // async newSubitem() {
    //     if (this.getFocused() === (await this.getWorkingPlace())
    //             || this.focused === undefined) {
    //         let object = await this.app.createObjectInWorkingPlace();
    //         this.focused = object;
    //         this.focusedUIO = (await this.getWorkingPlace()).listAspect.get(0);
    //     } else {
    //         if (this.focusedUIO) {
    //             await this.focusedUIO.newSubitem();
    //         } else { // TODO remove
    //             let object: SemsObject = await this.app.createObject();
    //             let path = this.app.getLocation().getPath(object);
    //             await this.focused.addDetail(path);
    //             this.focused = object;
    //         }
    //     }
    // }

    async newSubitem2() {
        await this.focusedUIO.newSubitem2();
    }

    // async getWorkingPlace() : Promise<UserInterfaceObject> {
    //     if (!this.workingPlace) {
    //         this.workingPlace = new UserInterfaceObject(this);
    //         this.workingPlace.listAspect = new ListAspectForUIO(this, await this.app.getObjectsInWorkingPlace());
    //     }
    //     return this.workingPlace;
    // }

    async getWorkingPlace2() : Promise<UserInterfaceObject> {
        if (!this.workingPlace2) {
            this.workingPlace2 = new UserInterfaceObject(this);
            let locationObject = await this.app.getLocation().getObject(new Path([]));
            let viewOnObjects = new ViewOnObjects(this.app.getLocation(), locationObject.getListProperty('workingPlace'));
            await viewOnObjects.load();
            this.workingPlace2.listAspect2 = new ListAspectForUIO2(this, viewOnObjects);
        }
        return this.workingPlace2;
    }

    // async clearWorkingPlace() {
    //     await this.app.clearWorkingPlace();
    //     return;
    // }

    async clearWorkingPlace2() {
        await (await this.app.getLocation().getObject(new Path([]))).getListProperty('workingPlace').removeAllItems();
        return;
    }

    getFocusedUIO() : UserInterfaceObject {
        return this.focusedUIO;
    }

    async load() {
        // this.setFocused(await this.getWorkingPlace());
        this.focusedUIO = await this.getWorkingPlace2();
    }

    getApp() : App {
        return this.app;
    }
}