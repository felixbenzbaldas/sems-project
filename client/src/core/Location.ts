import {Path} from "@/core/Path";
import {RemoteObject} from "@/core/RemoteObject";
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

    async createObjectWithText(housePath: Path, text : string) : Promise<RemoteObject> {
        return this.request('createObjectWithText', [housePath.toList(), text])
            .then(json => {
                let name : string = json as string;
                let object = new RemoteObject(this, name, text);
                let house = this.getHouse(housePath);
                object.setContainer(house);
                return object;
            });
    }

    getHouse(path: Path) : House {
        if (path.getLength() == 1) {
            let name = path.getFirst();
            if (!this.objects.has(name)) {
                // TODO maybe check if it really is a house
                this.objects.set(name, new House(this.http, this, name));
            }
            return this.objects.get(name);
        } else {
            throw new Error('not implemented yet');
        }
    }

    getHttpAddress() : string {
        return this.httpAddress;
    }

    async addObjectToWorkingSpace(object: RemoteObject) : Promise<void> {
        return this.request('addObjectToWorkingSpace', [this.getPath(object).toList()]);
    }

    getPath(object: any) : Path {
        let container = object.getContainer();
        if (container === this) {
            return new Path([object.getName()]);
        } else {
            return this.getPath(container).append(object.getName());
        }
    }

    async getObjectsInWorkingPlace() : Promise<Array<RemoteObject>> {
        let listOfPaths = await this.request('getObjectsInWorkingPlace', []);
        let listOfObjects: Array<RemoteObject> = [];
        for (let path of listOfPaths) {
            let object = await this.getObject(new Path(path));
            listOfObjects.push(object);
        }
        return listOfObjects;
    }

    async clearWorkingPlace() : Promise<any> {
        return this.request('clearWorkingSpace', []);
    }

    async request(method: string, args: Array<Object>) : Promise<any>{
        return this.http.request(this.httpAddress, method, args);
    }

    async getObject(path: Path) : Promise<RemoteObject> {
        let data = await this.request('get', [path.toList()]);
        let object = new RemoteObject(this, path.getLast(), data.text);
        object.setContainer(this.getHouse(path.withoutLast()))
        return object;
    }
}