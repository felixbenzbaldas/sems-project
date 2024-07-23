import type {UserInterface} from "@/user-interface/UserInterface";
import type {SemsObject} from "@/core/SemsObject";
import {ListAspect} from "@/user-interface/ListAspect";

export class UserInterfaceObject {

    private semsObject : SemsObject;

    listAspect : ListAspect;
    propertyName: string;
    detailsAspect: ListAspect;

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
            await this.ensureDetailsAspect().newSubitem();
        }
    }

    getUI() : UserInterface {
        return this.userInteface;
    }

    private ensureDetailsAspect() : ListAspect {
        if (!this.detailsAspect) {
            this.detailsAspect = new ListAspect(this.userInteface, this.semsObject, 'details');
        }
        return this.detailsAspect;
    }
}
