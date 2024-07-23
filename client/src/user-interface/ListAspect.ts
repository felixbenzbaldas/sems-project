import {UserInterfaceObject} from "@/user-interface/UserInterfaceObject";
import type {UserInterface} from "@/user-interface/UserInterface";
import type {SemsObject} from "@/core/SemsObject";

export class ListAspect {

    private listOfUIOs : Array<UserInterfaceObject>;

    private constructor(private ui : UserInterface, private object : SemsObject, private propertyName : string) {
    }

    static async load(ui : UserInterface, object : SemsObject, propertyName : string) : Promise<ListAspect> {
        let listAspect = new ListAspect(ui, object, propertyName);
        await listAspect.load();
        return listAspect;
    }

    async load() {
        this.listOfUIOs = [];
        let listProperty = this.object.getListProperty(this.propertyName);
        for (let i = 0; i < listProperty.length(); i++) {
            let path = listProperty.getItem(i)
            let object = await this.ui.getApp().getLocation().getObject(path);
            let uio = new UserInterfaceObject(this.ui);
            uio.setSemsObject(object);
            this.listOfUIOs.push(uio);
        }
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