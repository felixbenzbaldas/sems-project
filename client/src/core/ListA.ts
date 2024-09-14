import type {Entity} from "@/Entity";

export class ListA {

    jsList : Array<Entity>;

    constructor(private entity : Entity, ...jsList : Array<Entity>) {
        this.jsList = jsList;
    }

    async addAndUpdateUi(...items : Array<Entity>) {
        items.forEach(item => {
           if (item.name && item.container) {
               this.jsList.push(this.entity.getPath(item));
           } else {
               this.jsList.push(item);
           }
        });
        await this.entity.updateUi();
    }

    json() {
        return this.jsList.map(entity => {
            if (entity.pathA) {
                return entity.pathA.listOfNames;
            } else {
                return entity.json();
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