import {RemoteObject} from "@/core/RemoteObject";
import {Path} from "@/core/Path";
import {Http} from "@/core/Http";
import {Location} from "@/core/Location";

export class House {
    constructor(private http : Http, private location : Location, private name : string) {
    }
    async createObjectWithText(text: string) : Promise<RemoteObject> {
        return this.http.request(this.location.getHttpAddress(), 'createObjectWithText', [this.getPath().toList(), text])
            .then(json => {
                let name : string = json as string;
                return new RemoteObject(this.location, name, text);
            });
    }

    private getPath() : Path {
        return new Path([this.name]);
    }

    getContainer() : any {
        return this.location; // TODO a house can be in a street
    }

    getName() : string {
        return this.name;
    }
}