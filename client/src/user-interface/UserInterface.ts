import {UserInterfaceObject} from "@/user-interface/UserInterfaceObject";
import type {App} from "@/core/App";
import type {RemoteObject} from "@/core/RemoteObject";

export class UserInterface {

    private focused : any;
    private workingPlace : UserInterfaceObject;

    constructor(private app : App) {
    }

    setFocused(object : any) {
        this.focused = object;
    }

    // TODO refactor
    getFocused() : any {
        if (this.focused) {
            return this.focused;
        } else {
            return this.workingPlace;
        }
    }

    async newSubitem() {
        if (this.getFocused() === this.workingPlace) {
            let object = await this.app.createObjectInWorkingPlace();
            this.focused = object;
        } else {
            let object: RemoteObject = await this.app.createObject();
            await this.focused.addDetail(this.app.getLocation().getPath(object));
            this.focused = object;
        }
    }

    async getWorkingPlace() : Promise<UserInterfaceObject> {
        if (!this.workingPlace) {
            this.workingPlace = new UserInterfaceObject(this);
            this.workingPlace.setListOfSemsObjects(await this.app.getObjectsInWorkingPlace());
        }
        return this.workingPlace;
    }
}