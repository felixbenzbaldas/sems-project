import {UserInterfaceObject} from "@/user-interface/UserInterfaceObject";
import type {App} from "@/core/App";
import type {SemsObject} from "@/core/SemsObject";
import {ListAspectForUIO} from "@/user-interface/ListAspectForUIO";

export class UserInterface {

    private focused : any;
    private workingPlace : UserInterfaceObject;

    private focusedUIO : UserInterfaceObject;

    constructor(private app : App) {
    }

    setFocused(object : any) {
        this.focused = object;
    }

    getFocused() : any {
        return this.focused;
    }

    async newSubitem() {
        if (this.getFocused() === (await this.getWorkingPlace())
                || this.focused === undefined) {
            let object = await this.app.createObjectInWorkingPlace();
            this.focused = object;
            this.focusedUIO = (await this.getWorkingPlace()).listAspect.get(0);
        } else {
            let object: SemsObject = await this.app.createObject();
            await this.focused.addDetail(this.app.getLocation().getPath(object));
            this.focused = object;
        }
    }

    async getWorkingPlace() : Promise<UserInterfaceObject> {
        if (!this.workingPlace) {
            this.workingPlace = new UserInterfaceObject(this);
            this.workingPlace.listAspect = new ListAspectForUIO(this, await this.app.getObjectsInWorkingPlace());
        }
        return this.workingPlace;
    }

    async clearWorkingPlace() {
        this.app.clearWorkingPlace();
        return;
    }

    getFocusedUIO() : UserInterfaceObject {
        return this.focusedUIO;
    }

    async load() {
        this.setFocused(await this.getWorkingPlace());
    }
}