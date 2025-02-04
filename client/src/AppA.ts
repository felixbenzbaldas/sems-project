import type {AppA_UiA} from "@/ui/AppA_UiA";
import {PathA} from "@/PathA";
import {Entity} from "@/Entity";
import {LogG} from "@/LogG";
import {AppA_UnboundG} from "@/AppA_UnboundG";
import {StarterA} from "@/StarterA";
import type {Environment} from "@/Environment";
import {AppA_TesterA} from "@/tester/AppA_TesterA";

export class AppA {

    environment: Environment;
    readonly logG: LogG;
    readonly unboundG : AppA_UnboundG;
    uiA: AppA_UiA;
    testMode: boolean;
    testerA: AppA_TesterA;
    installTesterA() {
        this.testerA = new AppA_TesterA(this.entity);
    }

    constructor(public entity : Entity) {
        this.unboundG = new AppA_UnboundG(entity);
        this.logG = new LogG(entity);
        entity.installContainerA();
    }

    createEntityWithApp() {
        let entity = this.createEntity();
        entity.app = this.entity;
        return entity;
    }

    createEntity() {
        return new Entity();
    }

    async createBoundEntity(name? : string) : Promise<Entity> {
        return await this.entity.containerA.createBoundEntity(name);
    }

    async createText(text: string) : Promise<Entity> {
        return this.entity.containerA.createText(text);
    }

    async createList() : Promise<Entity> {
        return this.entity.containerA.createList();
    }

    async createTextWithList(text : string, ...jsList : Array<Entity>) : Promise<Entity> {
        return this.entity.containerA.createTextWithList(text, ...jsList);
    }

    createPath(listOfNames: Array<string>, subject : Entity) : PathA {
        let path = this.createEntityWithApp();
        path.installPathA();
        path.pathA.listOfNames = listOfNames;
        path.pathA.subject = subject;
        return path.pathA;
    }

    direct(entity : Entity) : Entity {
        let path = this.createEntityWithApp();
        path.installPathA();
        path.pathA.direct = entity;
        return path;
    }

    direct_typed(entity : Entity) : PathA {
        return this.direct(entity).pathA;
    }

    async createLink(href: string, text?: string) {
        return await this.entity.containerA.createLink(href, text);
    }

    createStarter() : StarterA {
        let starter = this.createEntityWithApp();
        starter.starterA = new StarterA(starter);
        return starter.starterA;
    }

    getProfile() : Entity {
        return this.entity.containerA.mapNameEntity.get('profile');
    }

    setProfile(profile: Entity) {
        this.entity.containerA.bind(profile, 'profile');
    }
}