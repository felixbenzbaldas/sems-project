import type {Entity} from "@/Entity";

export class ContainerA {

    private nameCounter : number = 0;
    mapNameEntity: Map<string, Entity> = new Map();

    constructor(private entity : Entity) {
    }
    getUniqueRandomName() : string {
        return (this.nameCounter++).toString();
    }

    async getByName(name: string) : Promise<Entity> {
        let entity = this.entity.appA.createEntityWithApp();
        entity.text = '42'; // TODO http-request
        return Promise.resolve(entity);
    }

    async createText(text: string) : Promise<Entity> {
        let textObject = this.entity.appA.simple_createText(text);
        this.take(textObject);
        return Promise.resolve(textObject);
    }

    async createList() : Promise<Entity> {
        let list = this.entity.appA.simple_createList();
        this.take(list);
        return Promise.resolve(list);
    }

    private take(entity: Entity) {
        entity.name = this.getUniqueRandomName();
        entity.container = this.entity;
        this.mapNameEntity.set(entity.name, entity);
    }

}