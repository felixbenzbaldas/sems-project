import {Http} from "@/core/Http";
import {Location} from "@/core/Location";
import {Path} from "@/core/Path";
import type {SemsObject} from "@/core/SemsObject";
import type {House} from "@/core/House";

export class App {

    private http : Http;
    private location : Location;
    private currentWritingPosition : Path;

    constructor(configuration : any, http? : Http) {
        this.http = http ? http : new Http();
        this.location = new Location(configuration.server, this.http);
        this.currentWritingPosition = new Path(configuration.writingPosition);
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