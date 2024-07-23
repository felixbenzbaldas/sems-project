import {UserInterfaceObject} from "@/user-interface/UserInterfaceObject";
import type {UserInterface} from "@/user-interface/UserInterface";
import type {SemsObject} from "@/core/SemsObject";

export class ListAspect {

    private listOfUIOs : Array<UserInterfaceObject>;

    constructor(private ui : UserInterface, private object : SemsObject, private propertyName : string) {
        this.listOfUIOs = [];
    }

    isEmpty() {
        return this.listOfUIOs.length === 0;
    }

    getLength() {
        return this.listOfUIOs.length;
    }

    get(index: number) : UserInterfaceObject {
        return this.listOfUIOs.at(index);
    }

    async newSubitem() {
        let app = this.ui.getApp();
        let object = await app.createObject();
        let path = app.getLocation().getPath(object);
        // TODO lock and update this.object
        await this.object.getListProperty(this.propertyName).addItem(path);
        let uio = new UserInterfaceObject(this.ui);
        uio.setSemsObject(object);
        this.listOfUIOs.push(uio);
        uio.focus();
    }

    async removeAllItems() {
        // TODO lock and update this.object
        await this.object.getListProperty(this.propertyName).removeAllItems();
        this.listOfUIOs = [];
    }
}