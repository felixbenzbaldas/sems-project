import {ObservableList} from "@/core/ObservableList";
import type {UserInterface} from "@/user-interface/UserInterface";
import type {RemoteObject} from "@/core/RemoteObject";

export class UserInterfaceObject {

    private semsObject : RemoteObject;
    
    private listOfSemsObjects : ObservableList<RemoteObject>;
    private listOfUIOs : ObservableList<UserInterfaceObject>;

    constructor(private userInteface : UserInterface) {
    }

    hasFocus() : boolean {
        return this.userInteface.getFocused() === this;
    }

    focus() {
        this.userInteface.setFocused(this);
    }

    setListOfSemsObjects(list : ObservableList<RemoteObject>) {
        this.listOfSemsObjects = list;
    }

    getListOfUIOs() : ObservableList<UserInterfaceObject>{
        if (!this.listOfUIOs) {
            this.createListOfUIOs();
        }
        return this.listOfUIOs;
    }

    private createListOfUIOs() {
        this.listOfUIOs = new ObservableList<UserInterfaceObject>();
        this.updateListOfUIOs();
        this.listOfSemsObjects.subject.subscribe(next => {
            this.updateListOfUIOs();
        });
        return this.listOfUIOs;
    }

    private updateListOfUIOs() {
        this.listOfUIOs.clear();
        this.listOfSemsObjects.createCopyOfList().forEach(object => {
            let uio = new UserInterfaceObject(this.userInteface);
            uio.semsObject = object;
            this.listOfUIOs.add(uio);
        });
    }

    getSemsObject() : RemoteObject {
        return this.semsObject;
    }

    setSemsObject(semsObject: RemoteObject) {
        this.semsObject = semsObject;
    }
}
