import {Path} from "@/core/Path";
import {SemsObject} from "@/core/SemsObject";
import {Http} from "@/core/Http";

export class Location {

    private semsObject: SemsObject;

    constructor(private httpAddress : string, private http: Http) {
    }

    async getObject(path: Path) : Promise<SemsObject> {
        return (await this.ensureSemsObject()).resolve(path);
    }

    getPath(object: SemsObject) : Path {
        if (object === this.semsObject) {
            return Path.empty();
        } else {
            let container = object.getContainer();
            if (container) {
                return this.getPath(container).append(object.getName());
            } else {
                throw 'the object is not at this location';
            }
        }
    }

    async request(method: string, args: Array<any>) : Promise<any>{
        return this.http.request(this.httpAddress, method, args);
    }

    async ensureSemsObject() : Promise<SemsObject> {
        if (!this.semsObject) {
            let data = await this.request('get',[[]]);
            this.semsObject = SemsObject.remote(this, null, null, data); // TODO race condition
        }
        return this.semsObject;
    }
}