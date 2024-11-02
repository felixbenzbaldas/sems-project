import type {Entity} from "@/Entity";

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
            return await this.entity.resolve(entity);
        } else {
            return entity;
        }
    }

    async getResolvedList() : Promise<Array<Entity>> {
        let resolvedListItems = [];
        for (let current of this.jsList) {
            let currentResolved = current.pathA ? await this.entity.resolve(current) : current;
            resolvedListItems.push(currentResolved);
        }
        return resolvedListItems;
    }

    async insertObjectAtPosition(object: Entity, position: number) {
        this.jsList.splice(position, 0, this.entity.pathOrObject(object));
    }

    async findByText(text: string) : Promise<Entity> {
        for (let item of (await this.getResolvedList())) {
            if (item.text === text) {
                return item;
            }
        }
    }
}