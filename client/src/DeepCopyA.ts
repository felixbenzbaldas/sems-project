import type {Entity} from "@/Entity";
import type {PathA} from "@/PathA";
import type {ContainerA} from "@/ContainerA";

export class DeepCopyA {

    map : Map<Entity, Entity>;
    objectAndDependencies : Set<Entity>;

    constructor(public entity : Entity, public targetContainer : ContainerA) {
    }

    async run() : Promise<Entity> {
        this.objectAndDependencies = await this.entity.getObjectAndDependencies();
        await this.createBoundEmptyEntities();
        for (let object of this.objectAndDependencies) {
            await this.copyToEmptyEntity(object, this.map.get(object));
        }
        return this.map.get(this.entity);
    }

    async createBoundEmptyEntities() {
        this.map = new Map();
        for (let object of this.objectAndDependencies) {
            this.map.set(object, await this.targetContainer.createBoundEntity());
        }
    }

    async copyToEmptyEntity(object : Entity, emptyEntity : Entity) {
        emptyEntity.text = object.text;
        emptyEntity.collapsible = object.collapsible;
        emptyEntity.link = object.link;
        emptyEntity.editable = object.editable;
        if (object.context) {
            if (object !== this.entity) {
                emptyEntity.context = emptyEntity.getPath(this.map.get(await object.context.resolve()));
            }
        }
        if (object.listA) {
            emptyEntity.installListA();
            for (let listItem of object.listA.jsList) {
                emptyEntity.listA.jsList.push(emptyEntity.getPath(this.map.get(await listItem.resolve())));
            }
        }
    }
}