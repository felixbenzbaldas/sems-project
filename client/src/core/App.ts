import {Http} from "@/core/Http";
import {Location} from "@/core/Location";
import {Path} from "@/core/Path";
import type {SemsObject} from "@/core/SemsObject";
import {ObservableList} from "@/core/ObservableList";
import type {House} from "@/core/House";

export class App {

    private http : Http;
    private location : Location;
    private currentWritingPosition : Path;
    private workingPlace : ObservableList<SemsObject>;

    constructor(configuration : any, http? : Http) {
        this.http = http ? http : new Http();
        let server = configuration.server;
        this.location = new Location(this.http);
        this.location.setHttpAddress(server);
        this.currentWritingPosition = new Path(configuration.writingPosition);
    }

    async createObjectInWorkingPlace() : Promise<SemsObject> {
        let object = await this.createObject();
        await this.addObjectToWorkingPlace(object);
        return object;
    }

    async addObjectToWorkingPlace(object : SemsObject) : Promise<void> {
        if (!this.workingPlace) {
            await this.getObjectsInWorkingPlace();
        }
        await this.location.addObjectToWorkingPlace(object);
        this.workingPlace.add(object);
    }

    // TODO make lazy
    async getObjectsInWorkingPlace() : Promise<ObservableList<SemsObject>> {
        let listOfObjects = await this.location.getObjectsInWorkingPlace();
        this.workingPlace = new ObservableList<SemsObject>();
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

    async createObject() : Promise<SemsObject> {
        return (await this.getCurrentHouse()).createObjectWithText('');
    }

    private async getCurrentHouse() : Promise<House> {
        return this.location.getHouse(this.currentWritingPosition);
    }

    getLocation() : Location {
        return this.location;
    }
}