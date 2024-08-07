import type {UserInterface} from "@/deprecated/user-interface/UserInterface";
import type {SemsObject} from "@/deprecated/core/SemsObject";
import {ListAspect} from "@/deprecated/user-interface/ListAspect";

// danger: fields with prefix 'at' may be null/undefined and are public
export class UserInterfaceObject {

    atSemsObject : SemsObject;
    atProperty: string;
    atList : ListAspect;
    atDetails: ListAspect;

    constructor(private userInterface : UserInterface) {
    }

    hasFocus() : boolean {
        return this.userInterface.getFocused() === this;
    }

    focus() {
        this.userInterface.setFocused(this);
    }

    hasBody() : boolean {
        return this.atSemsObject.getListProperty('details').length() > 0;
    }

    async newSubitem() {
        if (this.atList) {
            await this.atList.newSubitem();
        } else {
            await this.atDetails.newSubitem();
        }
    }

    getUI() : UserInterface {
        return this.userInterface;
    }

}
