import {ObservableList} from "@/core/ObservableList";
import type {UserInterface} from "@/user-interface/UserInterface";
import type {SemsObject} from "@/core/SemsObject";
import {ListAspectForUIO} from "@/user-interface/ListAspectForUIO";

export class UserInterfaceObject {

    private semsObject : SemsObject;

    listAspect: ListAspectForUIO;

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
}
