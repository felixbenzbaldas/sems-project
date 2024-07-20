import {Path} from "@/core/Path";
import {SemsObject} from "@/core/SemsObject";
import {Http} from "@/core/Http";
import {House} from "@/core/House";

export class Location {

    private objects : Map<string, any> = new Map();
    private semsObject: SemsObject;

    constructor(private httpAddress : string, private http: Http) {
    }

    async getHouse(path: Path) : Promise<House> {
        if (path.getLength() == 1) {
            return this.getObjectByName(path.getFirst());
        } else {
            throw new Error('not implemented yet');
        }
    }

    getPath(object: any) : Path {
        if (object.getName) {
            if (object.getName() === null) {
                return new Path([]);
            }
        }
        let container = object.getContainer();
        if (container === this) {
            return new Path([object.getName()]);
        } else {
            return this.getPath(container).append(object.getName());
        }
    }

    async request(method: string, args: Array<any>) : Promise<any>{
        return this.http.request(this.httpAddress, method, args);
    }

    async getObject(path: Path) : Promise<SemsObject> {
        if (path.getLength() == 0) {
            if (!this.semsObject) {
                let data = await this.request('get',[[]]);
                this.semsObject = new SemsObject(this, null, data);
            }
            return this.semsObject;
        } else {
            let house = await this.getObjectByName(path.getFirst());
            let withoutFirst = path.withoutFirst();
            if (withoutFirst.getLength() == 0) {
                throw new Error('not implemented yet');
            } else {
                return await house.getObject(withoutFirst);
            }
        }
    }

    async getObjectByName(name : string) : Promise<House> {
        if (!this.objects.has(name)) {
            // TODO maybe check if it really is a house
            this.objects.set(name, new House(this.http, this, name));
        }
        return this.objects.get(name);
    }
}