import type {Entity} from "@/Entity";

export class ListA {

    jsList : Array<Entity>;

    constructor(private entity : Entity, ...jsList : Array<Entity>) {
        this.jsList = jsList;
    }

    async addAndUpdateUi(...items : Array<Entity>) {
        await this.add(...items);
        await this.entity.updateUi();
    }

    async add(...items : Array<Entity>) {
        for (let item of items) {
            if (item.name && item.container) {
                this.jsList.push(this.entity.getPath(item));
            } else {
                this.jsList.push(item);
            }
        }
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

    async getObject(index : number) : Promise<Entity> {
        return this.entity.resolve(this.jsList.at(index));
    }

    async getResolvedList() : Promise<Array<Entity>> {
        let resolvedListItems = [];
        for (let current of this.jsList) {
            let currentResolved = current.pathA ? await this.entity.resolve(current) : current;
            resolvedListItems.push(currentResolved);
        }
        return resolvedListItems;
    }
}