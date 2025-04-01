import type {Entity} from "@/Entity";
import type {PathA} from "@/PathA";

export class ListA {

    jsList : Array<PathA>;

    constructor(public entity : Entity, ...jsList : Array<PathA>) {
        this.jsList = jsList;
    }

    async add(object: Entity) {
        this.jsList.push(this.entity.getPath(object));
    }

    async addByListOfNames(listOfNames : Array<string>) {
        this.jsList.push(this.entity.getApp().createPath(listOfNames, this.entity));
    }

    addDirect(...entities: Array<Entity>) {
        this.jsList.push(...entities.map((entity : Entity) => this.entity.getApp().direct(entity)));
    }

    json_withoutContainedObjects() {
        return this.jsList.map(path => {
            return path.listOfNames;
        });
    }

    async getResolved(index : number) : Promise<Entity> {
        return await this.jsList[index].resolve();
    }

    async getResolvedList() : Promise<Array<Entity>> {
        let resolvedListItems = [];
        for (let current of this.jsList) {
            resolvedListItems.push(await current.resolve());
        }
        return resolvedListItems;
    }

    async insertPathOrDirectAtPosition(object: Entity, position: number) {
        this.jsList.splice(position, 0, this.entity.pathOrDirect(object));
    }

    async insertPathAtPosition(path: PathA, position: number) {
        this.jsList.splice(position, 0, path);
    }

    async insertObjectAtPosition(listItem: Entity, position: number) {
        await this.insertPathAtPosition(this.entity.getPath(listItem), position);
    }

    async findByText(text: string) : Promise<Entity> {
        for (let item of (await this.getResolvedList())) {
            if (item.text === text) {
                return item;
            }
        }
    }
}