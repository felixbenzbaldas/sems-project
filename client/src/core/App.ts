import {Http} from "@/core/Http";
import {Location} from "@/core/Location";
import {Path} from "@/core/Path";
import type {SemsObject} from "@/core/SemsObject";

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
        return (await this.getCurrentContainer()).containerAspect.createObjectWithText('');
    }

    private async getCurrentContainer() : Promise<SemsObject> {
        return this.location.getObject(this.currentWritingPosition);
    }

    getLocation() : Location {
        return this.location;
    }
}