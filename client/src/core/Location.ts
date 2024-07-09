import {Path} from "@/core/Path";
import {SemsObject} from "@/core/SemsObject";
import {Http} from "@/core/Http";
import {House} from "@/core/House";

export class Location {

    private httpAddress : string;

    private objects : Map<string, any> = new Map();

    constructor(private http: Http) {
    }

    setHttpAddress(httpAddress: string) {
        this.httpAddress = httpAddress;
    }

    async getHouse(path: Path) : Promise<House> {
        if (path.getLength() == 1) {
            return this.getObjectByName(path.getFirst());
        } else {
            throw new Error('not implemented yet');
        }
    }

    getHttpAddress() : string {
        return this.httpAddress;
    }

    async addObjectToWorkingPlace(object: SemsObject) : Promise<void> {
        return this.request('addObjectToWorkingPlace', [this.getPath(object).toList()]);
    }

    getPath(object: any) : Path {
        let container = object.getContainer();
        if (container === this) {
            return new Path([object.getName()]);
        } else {
            return this.getPath(container).append(object.getName());
        }
    }

    async getObjectsInWorkingPlace() : Promise<Array<SemsObject>> {
        let listOfPaths = await this.request('getObjectsInWorkingPlace', []);
        let listOfObjects: Array<SemsObject> = [];
        for (let path of listOfPaths) {
            let object = await this.getObject(new Path(path));
            listOfObjects.push(object);
        }
        return listOfObjects;
    }

    async clearWorkingPlace() : Promise<any> {
        return this.request('clearWorkingPlace', []);
    }

    async request(method: string, args: Array<Object>) : Promise<any>{
        return this.http.request(this.httpAddress, method, args);
    }

    async getObject(path: Path) : Promise<SemsObject> {
        if (path.getLength() == 0) {
            throw new Error('not implemented yet');
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