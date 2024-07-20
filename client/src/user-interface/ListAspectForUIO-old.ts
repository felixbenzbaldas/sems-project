import {UserInterfaceObject} from "@/user-interface/UserInterfaceObject";
import type {UserInterface} from "@/user-interface/UserInterface";
import type {ViewOnObjectsOld} from "@/user-interface/ViewOnObjects-old";

export class ListAspectForUIOOld {

    private listOfUIOs : Array<UserInterfaceObject>;

    constructor(private userInterface : UserInterface, private list : ViewOnObjectsOld) {
        this.createListOfUIOs();
    }

    private createListOfUIOs() {
        this.updateListOfUIOs();
        this.list.subscribe(async event => {
            this.updateListOfUIOs();
        });
    }

    private updateListOfUIOs() {
        this.listOfUIOs = [];
        for (let i = 0; i < this.list.getLength(); i++) {
            let object = this.list.getItem(i);
            let uio = new UserInterfaceObject(this.userInterface);
            uio.setSemsObject(object);
            this.listOfUIOs.push(uio);
        };
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
}