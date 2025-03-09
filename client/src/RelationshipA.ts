import type {Entity} from "@/Entity";
import type {AppA} from "@/AppA";
import type {PathA} from "@/PathA";

export class RelationshipA {
    static create(app : AppA) : RelationshipA {
        let entity = app.createEntityWithApp();
        entity.relationshipA = new RelationshipA(entity);
        return entity.relationshipA;
    }
    constructor(public entity : Entity) {
    }
    to : PathA;
}