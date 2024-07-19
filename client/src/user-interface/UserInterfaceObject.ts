import {ObservableList} from "@/core/ObservableList";
import type {UserInterface} from "@/user-interface/UserInterface";
import type {SemsObject} from "@/core/SemsObject";
// import {ListAspectForUIO} from "@/user-interface/ListAspectForUIO";
import type {ListAspectForUIO2} from "@/user-interface/ListAspectForUIO2";
import {Path} from "@/core/Path";

export class UserInterfaceObject {

    private semsObject : SemsObject;

    // listAspect: ListAspectForUIO;
    listAspect2: ListAspectForUIO2;

    constructor(private userInteface : UserInterface) {
    }

    hasFocus() : boolean {
        return this.userInteface.getFocused() === this;
    }

    focus() {
        this.userInteface.setFocused(this);
    }

    getSemsObject() : SemsObject {
        return this.semsObject;
    }

    setSemsObject(semsObject: SemsObject) {
        this.semsObject = semsObject;
    }

    hasBody() : boolean {
        return this.semsObject.getListProperty('details').length() > 0;
    }

    // async newSubitem() : Promise<UserInterfaceObject> {
    //     let app = this.userInteface.getApp();
    //     let object: SemsObject = await app.createObject();
    //     let path = app.getLocation().getPath(object);
    //
    //     await this.userInteface.getFocused().addDetail(path); // TODO remove
    //
    //     await this.getSemsObject().getListProperty('details').addItem(path);
    //     this.userInteface.setFocused(object); // TODO focus UIO
    //     return null; // TODO return UIO
    // }

    async newSubitem2() {
        if (this.isWorkingPlaceUIO()) {
            let app = this.userInteface.getApp();
            let object = await app.createObject();
            let path = app.getLocation().getPath(object);
            let locationObject = await app.getLocation().getObject(new Path([]));
            await locationObject.getListProperty('workingPlace').addItem(path);
        } else {
            throw 'not implemented yet';
        }
    }

    private isWorkingPlaceUIO() : boolean {
        return !!this.listAspect2;
    }
}
