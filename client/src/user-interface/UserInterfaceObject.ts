import type {UserInterface} from "@/user-interface/UserInterface";
import type {SemsObject} from "@/core/SemsObject";
// import {ListAspectForUIO} from "@/user-interface/ListAspectForUIO";
import type {ListAspectForUIO} from "@/user-interface/ListAspectForUIO";

export class UserInterfaceObject {

    private semsObject : SemsObject;

    listAspect : ListAspectForUIO;
    propertyName: string;

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

    async newSubitem() {
        if (this.listAspect) {
            await this.listAspect.newSubitem();
        } else {
            // TODO this.ensureDetailsAspect().newSubitem();
        }
    }

    getUI() : UserInterface {
        return this.userInteface;
    }
}
