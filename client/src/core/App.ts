import {Http} from "@/core/Http";
import {Location} from "@/core/Location";
import {Path} from "@/core/Path";
import type {RemoteObject} from "@/core/RemoteObject";
import {ObservableList} from "@/core/ObservableList";
import type {House} from "@/core/House";

export class App {

    private http : Http = new Http();
    private location : Location;
    private currentWritingPosition : Path;
    private workingPlace : ObservableList<RemoteObject>;

    constructor(configuration : any) {
        let server = configuration.server;
        this.location = new Location(this.http);
        this.location.setHttpAddress(server);
        this.currentWritingPosition = new Path(configuration.writingPosition);
    }

    async createObjectInWorkingPlace() : Promise<RemoteObject> {
        let object = await this.createObject();
        await this.addObjectToWorkingPlace(object);
        return object;
    }

    async addObjectToWorkingPlace(object : RemoteObject) : Promise<void> {
        if (!this.workingPlace) {
            await this.getObjectsInWorkingPlace();
        }
        await this.location.addObjectToWorkingPlace(object);
        this.workingPlace.add(object);
    }

    // TODO make lazy
    async getObjectsInWorkingPlace() : Promise<ObservableList<RemoteObject>> {
        let listOfObjects = await this.location.getObjectsInWorkingPlace();
        this.workingPlace = new ObservableList<RemoteObject>();
        listOfObjects.forEach(value => {
            this.workingPlace.add(value);
        });
        return this.workingPlace;
    }

    async clearWorkingPlace() : Promise<void> {
        await this.location.clearWorkingPlace();
        if (this.workingPlace) {
            this.workingPlace.clear();
        }
    }

    async createObject() : Promise<RemoteObject> {
        return (await this.getCurrentHouse()).createObjectWithText('');
    }

    private async getCurrentHouse() : Promise<House> {
        return this.location.getHouse(this.currentWritingPosition);
    }

    getLocation() : Location {
        return this.location;
    }
}