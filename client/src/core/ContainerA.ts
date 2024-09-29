import type {Entity} from "@/Entity";
import {createRandomString} from "@/utils";

export class ContainerA {

    private nameCounter : number = 0;
    mapNameEntity: Map<string, Entity> = new Map();

    constructor(private entity : Entity) {
    }
    getUniqueRandomName() : string {
        return createRandomString();
    }

    async getByName(name: string) : Promise<Entity> {
        let entity = this.entity.getApp().appA.createEntityWithApp();
        entity.text = '42'; // TODO http-request
        return entity;
    }

    async createText(text: string) : Promise<Entity> {
        let textObject = this.entity.getApp().appA.unboundG.createText(text);
        this.take(textObject);
        return textObject;
    }

    async createList() : Promise<Entity> {
        let list = this.entity.getApp().appA.unboundG.createList();
        this.take(list);
        return list;
    }

    async createCollapsible(text: string, ...jsList : Array<Entity>) {
        let collapsible = this.entity.getApp().appA.unboundG.createCollapsible(text);
        this.take(collapsible);
        for (let entity of jsList) {
            await collapsible.list.add(entity);
        }
        return collapsible;
    }

    async createLink(href: string, text?: string) {
        let entity = this.entity.getApp().appA.unboundG.createLink(href, text);
        this.take(entity);
        return entity;
    }

    take(entity: Entity) {
        entity.name = this.getUniqueRandomName();
        entity.container = this.entity;
        this.mapNameEntity.set(entity.name, entity);
    }

}