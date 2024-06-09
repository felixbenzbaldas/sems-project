import {Http} from "@/core/Http";
import {Location} from "@/core/Location";
import {Path} from "@/core/Path";
import type {RemoteObject} from "@/core/RemoteObject";
import {ObservableList} from "@/core/ObservableList";

export class App {

    private http : Http = new Http();
    private location : Location;
    private currentWritingPosition : Path;
    private workingPlace : ObservableList<RemoteObject>;
    private focused : any;

    constructor(configuration : any) {
        let server = configuration.server;
        this.location = new Location(this.http);
        this.location.setHttpAddress(server);
        this.currentWritingPosition = new Path(configuration.writingPosition);
    }

    async createObjectInWorkingPlace() : Promise<RemoteObject> {
        return this.location.createObjectWithText(this.currentWritingPosition, '').then(object => {
            return this.addObjectToWorkingSpace(object).then(() => object);
        });
    }

    async addObjectToWorkingSpace(object : RemoteObject) : Promise<void> {
        if (!this.workingPlace) {
            await this.getObjectsInWorkingPlace();
        }
        return this.location.addObjectToWorkingSpace(object).then(() => {
            this.workingPlace.add(object);
        });
    }

    async getObjectsInWorkingPlace() : Promise<ObservableList<RemoteObject>> {
        return this.location.getObjectsInWorkingPlace().then(listOfObjects => {
            this.workingPlace = new ObservableList<RemoteObject>();
            listOfObjects.forEach(value => {
                this.workingPlace.add(value);
            });
            return this.workingPlace;
        });
    }

    async clearWorkingPlace() : Promise<void> {
        return this.location.clearWorkingPlace().then(() => {
            this.workingPlace.clear();
            this.focused = 'workingPlace';
        });
    }

    async createObject() : Promise<RemoteObject> {
        return this.location.createObjectWithText(this.currentWritingPosition, '');
    }

    setFocused(object : any) {
        this.focused = object;
    }

    getFocused() : any {
        return this.focused;
    }

    getLocation() : Location {
        return this.location;
    }
}