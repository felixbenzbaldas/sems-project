import {Path} from "@/deprecated/core/Path";
import {SemsObject} from "@/deprecated/core/SemsObject";
import {Http} from "@/deprecated/core/Http";
import {Location} from "@/deprecated/core/Location";

export class ContainerAspect {

    private promises : Map<string, Promise<SemsObject>> = new Map();

    constructor(private http : Http, private location : Location, private semsObject : SemsObject) {
    }

    async createObjectWithText(text: string) : Promise<SemsObject> {
        let name = await this.request('createObjectWithText', [this.getPath().toList(), text]) as string;
        if (!this.promises.has(name)) {
            let object = SemsObject.remote(this.location, this.semsObject, name, {text: text});
            this.promises.set(name, Promise.resolve(object));
        }
        return this.promises.get(name);
    }

    getPath() : Path {
        return this.location.getPath(this.semsObject);
    }

    async resolve(path: Path) : Promise<SemsObject> {
        let object = await this.get(path.getFirst());
        return object.resolve(path.withoutFirst());
    }

    async get(name: string) : Promise<SemsObject> {
        if (!this.promises.has(name)) {
            if (this.getPath().getLength() === 0) { // TODO
                let object = SemsObject.remote(this.location, this.semsObject, name, {});
                this.promises.set(name, Promise.resolve(object));
            } else {
                let promise = this.request('get', [this.getPath().append(name).toList()]).then(data => {
                    return SemsObject.remote(this.location, this.semsObject, name, data);
                });
                this.promises.set(name, promise);
            }
        }
        return this.promises.get(name);
    }

    async request(method: string, args: Array<Object>) : Promise<any>{
        return await this.location.request(method, args);
    }
}