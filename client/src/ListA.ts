import type {Entity} from "@/Entity";
import type {PathA} from "@/PathA";

export class ListA {

    jsList : Array<Entity>;

    constructor(public entity : Entity, ...jsList : Array<Entity>) {
        this.jsList = jsList;
    }

    async addAndUpdateUi(...items : Array<Entity>) {
        await this.add(...items);
        await this.entity.updateUi();
    }

    async add(...items : Array<Entity>) {
        for (let item of items) {
            this.jsList.push(this.entity.pathOrObject(item));
        }
    }

    add_path(path : Array<string>) {
        this.jsList.push(this.entity.getApp_typed().createPath(path, this.entity));
    }

    json_withoutContainedObjects() {
        return this.jsList.map(entity => {
            if (entity.pathA) {
                return entity.pathA.listOfNames;
            } else {
                return entity.json_withoutContainedObjects();
            }
        });
    }

    async getResolved(index : number) : Promise<Entity> {
        let entity = this.jsList[index];
        if (entity.pathA) {
            return await entity.pathA.resolve();
        } else {
            return entity;
        }
    }

    async getResolvedList() : Promise<Array<Entity>> {
        let resolvedListItems = [];
        for (let current of this.jsList) {
            let currentResolved = current.pathA ? await current.pathA.resolve() : current;
            resolvedListItems.push(currentResolved);
        }
        return resolvedListItems;
    }

    async insertPathOrDirectAtPosition(object: Entity, position: number) {
        this.jsList.splice(position, 0, this.entity.pathOrObject(object));
    }

    async insertPathAtPosition(path: PathA, position: number) {
        this.jsList.splice(position, 0, path.entity);
    }

    async findByText(text: string) : Promise<Entity> {
        for (let item of (await this.getResolvedList())) {
            if (item.text === text) {
                return item;
            }
        }
    }
}