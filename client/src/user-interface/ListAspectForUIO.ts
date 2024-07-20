import {UserInterfaceObject} from "@/user-interface/UserInterfaceObject";

export class ListAspectForUIO {

    private listOfUIOs : Array<UserInterfaceObject>;

    constructor(private uio : UserInterfaceObject) {
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
        let app = this.uio.getUI().getApp();
        let newObject = await app.createObject();
        let pathOfNewObject = app.getLocation().getPath(newObject);
        if (this.uio.propertyName) {
            let object = this.uio.getSemsObject();
            // TODO lock and update object
            await object.getListProperty(this.uio.propertyName).addItem(pathOfNewObject);
            let itemUIO = new UserInterfaceObject(this.uio.getUI());
            itemUIO.setSemsObject(newObject);
            this.listOfUIOs.push(itemUIO);
            itemUIO.focus();
        } else {
            throw 'not implemented';
        }
    }

    async removeAllItems() {
        if (this.uio.propertyName) {
            let object = this.uio.getSemsObject();
            // TODO lock and update object
            await object.getListProperty(this.uio.propertyName).removeAllItems();
            this.listOfUIOs = [];
        } else {
            throw 'not implemented';
        }
    }
}