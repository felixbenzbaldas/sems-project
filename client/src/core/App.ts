import {Http} from "@/core/Http";
import {Location} from "@/core/Location";
import {Path} from "@/core/Path";
import type {RemoteObject} from "@/core/RemoteObject";

export class App {

    private http : Http = new Http();
    private location : Location;
    private currentWritingPosition : Path;
    private workingSpace : Array<RemoteObject>;

    constructor(configuration : any) {
        let server = configuration.server;
        this.location = new Location(this.http);
        this.location.setHttpAddress(server);
        this.currentWritingPosition = new Path(configuration.writingPosition);
    }

    async createObjectInWorkingPlace() : Promise<RemoteObject> {
        return this.location.createObjectWithText(this.currentWritingPosition, '').then(object => {
            return this.addObjectToWorkingSpace(object).then(() => object);
        })
    }

    async addObjectToWorkingSpace(object : RemoteObject) : Promise<void> {
        if (!this.workingSpace) {
            await this.getObjectsInWorkingPlace();
        }
        return this.location.addObjectToWorkingSpace(object).then(() => {
            this.workingSpace.push(object);
        });
    }

    async getObjectsInWorkingPlace() : Promise<Array<RemoteObject>> {
        return this.location.getObjectsInWorkingPlace().then(listOfObjects => {
            this.workingSpace = listOfObjects;
            return listOfObjects;
        });
    }

    async clearWorkingSpace() : Promise<void> {
        return this.location.clearWorkingSpace().then(() => {
            this.workingSpace = [];
        });
    }
}