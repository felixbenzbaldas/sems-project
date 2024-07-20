import {UserInterfaceObject} from "@/user-interface/UserInterfaceObject";
import type {App} from "@/core/App";
import type {SemsObject} from "@/core/SemsObject";
import {Path} from "@/core/Path";
import {ListAspectForUIO} from "@/user-interface/ListAspectForUIO";

export class UserInterface {

    // private workingPlace2: UserInterfaceObject;
    private workingPlace: UserInterfaceObject;

    private focused : UserInterfaceObject;

    private constructor(private app : App) {
    }

    static async load(app : App) : Promise<UserInterface> {
        let ui = new UserInterface(app);
        await ui.load();
        return ui;
    }

    setFocused(object : any) {
        this.focused = object;
    }

    getFocused() : any {
        return this.focused;
    }

    async newSubitem() {
        await this.focused.newSubitem();
    }

    async getWorkingPlace() : Promise<UserInterfaceObject> {
        if (!this.workingPlace) {
            let locationObject = await this.app.getLocation().getObject(new Path([]));
            this.workingPlace = this.createListUIO(locationObject, 'workingPlace');
        }
        return this.workingPlace;
    }

    async clearWorkingPlace() : Promise<void> {
        await (await this.getWorkingPlace()).listAspect.removeAllItems();
    }

    getFocusedUIO() : UserInterfaceObject {
        return this.focused;
    }

    async load() {
        this.focused = await this.getWorkingPlace();
    }

    getApp() : App {
        return this.app;
    }

    private createListUIO(object: SemsObject, propertyName: string) : UserInterfaceObject {
        let uio = new UserInterfaceObject(this);
        uio.setSemsObject(object);
        uio.propertyName = propertyName;
        uio.listAspect = new ListAspectForUIO(uio);
        return uio;
    }
}