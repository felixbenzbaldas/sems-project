import {Entity} from "@/Entity";
import {createRandomString, nullUndefined} from "@/utils";
import type {RelationshipA} from "@/RelationshipA";

export class ContainerA {

    mapNameEntity: Map<string, Entity> = new Map();

    constructor(public entity : Entity) {
    }

    getUniqueRandomName() : string {
        return createRandomString();
    }

    async createBoundEntity(name? : string) {
        let entity = this.entity.getApp().createEntityWithApp();
        this.bind(entity, name);
        return entity;
    }

    async createText(text: string) : Promise<Entity> {
        let textObject = this.entity.getApp().unboundG.createText(text);
        this.bind(textObject);
        return textObject;
    }

    async createTextWithList(text : string, ...jsList : Array<Entity>) : Promise<Entity> {
        let entity = this.entity.getApp().unboundG.createText(text);
        this.bind(entity);
        entity.installListA();
        for (let listItem of jsList) {
            await entity.listA.add(listItem);
        }
        return entity;
    }

    async createList() : Promise<Entity> {
        let list = this.entity.getApp().unboundG.createList();
        this.bind(list);
        return list;
    }

    async createLink(href: string, text?: string) {
        let entity = this.entity.getApp().unboundG.createLink(href, text);
        this.bind(entity);
        return entity;
    }

    bind(entity: Entity, name? : string) {
        entity.name = name? name : this.getUniqueRandomName();
        entity.container = this.entity;
        this.mapNameEntity.set(entity.name, entity);
    }

    async shakeTree() {
        await this.entity.getApp().shakeTree_withMultipleRoots([this.entity], this.entity.containerA);
    }

    // note: containers will not be deleted
    async shakeTree_delete(keep : Set<Entity>) {
        for (let contained of this.mapNameEntity.values()) {
            if (contained.containerA) {
                await contained.containerA?.shakeTree_delete(keep);
            } else {
                if (!keep.has(contained)) {
                    contained.delete();
                }
            }
        }
    }

    countWithNestedEntities() : number {
        let count = this.mapNameEntity.size;
        for (let contained of this.mapNameEntity.values()) {
            if (contained.containerA) {
                count += contained.containerA.countWithNestedEntities();
            }
        }
        return count;
    }

    async createRelationship() : Promise<RelationshipA> {
        let rel = this.entity.getApp().unboundG.createRelationship();
        this.bind(rel.entity);
        return rel;
    }
}