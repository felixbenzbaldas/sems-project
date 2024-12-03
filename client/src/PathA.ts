import {Entity} from "@/Entity";

export class PathA {

    listOfNames : Array<string>;
    direct: Entity;
    subject: Entity;

    constructor(public entity : Entity) {
    }

    withoutFirst() {
        let entity = this.entity.getApp_typed().createPath(this.listOfNames.slice(1, this.listOfNames.length));
        return entity;
    }

    async resolve() : Promise<Entity> {
        if (this.direct) {
            return this.direct;
        } else {
            return await this.subject.resolve(this.entity);
        }
    }
}