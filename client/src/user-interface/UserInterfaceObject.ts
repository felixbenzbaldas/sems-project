import type {UserInterface} from "@/user-interface/UserInterface";
import type {SemsObject} from "@/core/SemsObject";
import {ListAspect} from "@/user-interface/ListAspect";

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
