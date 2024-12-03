import {Entity} from "@/Entity";

export class PathA {

    listOfNames : Array<string>;
    direct: Entity;

    constructor(listOfNames : Array<string>) {
        this.listOfNames = listOfNames;
    }

    withoutFirst() {
        let entity = new Entity();
        entity.pathA = new PathA(this.listOfNames.slice(1, this.listOfNames.length));
        return entity;
    }

    async resolve() : Promise<Entity> {
        if (this.direct) {
            return this.direct;
        }
        return undefined;
    }
}