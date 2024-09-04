import type {Entity} from "@/Entity";

export class ContainerA {

    private nameCounter : number = 0;
    mapNameEntity: Map<string, Entity>;

    constructor(private entity : Entity) {
    }
    getUniqueRandomName() : string {
        return '' + this.nameCounter++;
    }

    async getByName(name: string) : Promise<Entity> {
        let identity = this.entity.appA.createEntityWithApp();
        identity.text = '42'; // TODO http-request
        return Promise.resolve(identity);
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

    private take(identity: Entity) {
        identity.name = this.getUniqueRandomName();
        identity.container = this.entity;
        this.mapNameEntity.set(identity.name, identity);
    }

}