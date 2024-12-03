import {Entity} from "@/Entity";
import {createRandomString} from "@/utils";

export class ContainerA {

    mapNameEntity: Map<string, Entity> = new Map();

    constructor(private entity : Entity) {
    }

    getUniqueRandomName() : string {
        return createRandomString();
    }

    async createBoundEntity(name? : string) {
        let entity = this.entity.getApp_typed().createEntityWithApp();
        this.bind(entity, name);
        return entity;
    }

    async createText(text: string) : Promise<Entity> {
        let textObject = this.entity.getApp().appA.unboundG.createText(text);
        this.bind(textObject);
        return textObject;
    }

    async createList() : Promise<Entity> {
        let list = this.entity.getApp().appA.unboundG.createList();
        this.bind(list);
        return list;
    }

    async createCollapsible(text: string, ...jsList : Array<Entity>) {
        let collapsible = this.entity.getApp().appA.unboundG.createCollapsible(text);
        this.bind(collapsible);
        for (let entity of jsList) {
            await collapsible.listA.deprecated_add(entity);
        }
        return collapsible;
    }

    async createLink(href: string, text?: string) {
        let entity = this.entity.getApp().appA.unboundG.createLink(href, text);
        this.bind(entity);
        return entity;
    }

    bind(entity: Entity, name? : string) {
        entity.name = name? name : this.getUniqueRandomName();
        entity.container = this.entity;
        this.mapNameEntity.set(entity.name, entity);
    }
}