import type {UserInterface} from "@/user-interface/UserInterface";
import type {SemsObject} from "@/core/SemsObject";
import {ListAspect} from "@/user-interface/ListAspect";

export class UserInterfaceObject {

    private semsObject : SemsObject;

    listAspect : ListAspect;
    propertyName: string;
    detailsAspectPromise: Promise<ListAspect>; // TODO should not be asynchronous

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
            await (await this.ensureDetailsAspect()).newSubitem();
        }
    }

    getUI() : UserInterface {
        return this.userInteface;
    }

    private async ensureDetailsAspect() : Promise<ListAspect> {
        if (!this.detailsAspectPromise) {
            this.detailsAspectPromise = ListAspect.load(this.userInteface, this.semsObject, 'details');
        }
        return this.detailsAspectPromise;
    }
}
