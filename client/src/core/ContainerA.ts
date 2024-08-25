import type {Identity} from "@/Identity";

export class ContainerA {

    private nameCounter : number = 0;
    mapNameIdentity: Map<string, Identity>;

    constructor(private identity : Identity) {
    }
    getUniqueRandomName() : string {
        return '' + this.nameCounter++;
    }

    async getByName(name: string) : Promise<Identity> {
        let identity = this.identity.appA.createIdentityWithApp();
        identity.text = '42'; // TODO http-request
        return Promise.resolve(identity);
    }

    async createText(text: string) : Promise<Identity> {
        let textObject = this.identity.appA.simple_createText(text);
        this.take(textObject);
        return Promise.resolve(textObject);
    }

    async createList() : Promise<Identity> {
        let list = this.identity.appA.simple_createList();
        this.take(list);
        return Promise.resolve(list);
    }

    private take(identity: Identity) {
        identity.name = this.getUniqueRandomName();
        identity.container = this.identity;
        this.mapNameIdentity.set(identity.name, identity);
    }

}