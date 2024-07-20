import {SemsObject} from "@/core/SemsObject";
import {Path} from "@/core/Path";
import {Http} from "@/core/Http";
import {Location} from "@/core/Location";

export class House {

    private objects : Map<string, any> = new Map();

    constructor(private http : Http, private location : Location, private name : string) {
    }
    async createObjectWithText(text: string) : Promise<SemsObject> {
        let json = await this.request('createObjectWithText', [this.getPath().toList(), text]);
        let name : string = json as string;
        if (!this.objects.has(name)) { // there could be a race condition with get
            let object = new SemsObject(this.location, name, { text: text });
            object.setContainer(this);
            this.objects.set(name, object);
        }
        return this.objects.get(name);
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

    async getObject(path: Path) : Promise<SemsObject> {
        if (path.getLength() == 0) {
            throw new Error('not implemented yet');
        } else {
            let object = await this.getObjectByName(path.getFirst());
            let withoutFirst = path.withoutFirst();
            if (withoutFirst.getLength() == 0) {
                return object;
            } else {
                throw new Error('not implemented yet!');
            }
        }
    }

    async getObjectByName(name: string) {
        if (!this.objects.has(name)) {
            let data = await this.request('get', [[this.name, name]]); // TODO this.getPath().append(name)
            let object = new SemsObject(this.location, name, data);
            object.setContainer(this);
            this.objects.set(name, object);
        }
        return this.objects.get(name);
    }

    async request(method: string, args: Array<Object>) : Promise<any>{
        return await this.location.request(method, args);
    }
}