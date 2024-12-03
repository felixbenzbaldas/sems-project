import {Entity} from "@/Entity";

export class PathA {

    listOfNames : Array<string>;
    direct: Entity;
    subject: Entity;

    constructor(public entity : Entity) {
    }

    async resolve() : Promise<Entity> {
        if (this.direct) {
            return this.direct;
        } else {
            return await this.subject.resolveListOfNames(this.listOfNames);
        }
    }
}