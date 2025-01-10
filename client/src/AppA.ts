import type {AppA_UiA} from "@/ui/AppA_UiA";
import {ListA} from "@/ListA";
import {PathA} from "@/PathA";
import {Entity} from "@/Entity";
import {LogG} from "@/LogG";
import type {AppA_TestA} from "@/test/old-tester/AppA_TestA";
import {ContainerA} from "@/ContainerA";
import {AppA_UnboundG} from "@/AppA_UnboundG";
import {StarterA} from "@/StarterA";
import type {Environment} from "@/Environment";
import {AppA_TesterA} from "@/tester/AppA_TesterA";

export class AppA {

    currentContainer: Entity;
    environment: Environment;
    readonly logG: LogG;
    readonly unboundG : AppA_UnboundG;
    uiA: AppA_UiA;
    testA : AppA_TestA; // deprecated
    testMode: boolean;
    testerA: AppA_TesterA;
    installTesterA() {
        this.testerA = new AppA_TesterA(this.entity);
    }

    constructor(public entity : Entity) {
        this.unboundG = new AppA_UnboundG(entity);
        this.logG = new LogG(entity);
        entity.installContainerA();
        this.currentContainer = entity;
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
        return await this.currentContainer.containerA.createBoundEntity(name);
    }

    async createText(text: string) : Promise<Entity> {
        return this.currentContainer.containerA.createText(text);
    }

    async createList() : Promise<Entity> {
        return this.currentContainer.containerA.createList();
    }

    async createTextWithList(text : string, ...jsList : Array<Entity>) : Promise<Entity> {
        return this.currentContainer.containerA.createTextWithList(text, ...jsList);
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
        return await this.currentContainer.containerA.createLink(href, text);
    }

    switchCurrentContainer(entity: Entity) {
        this.currentContainer = entity;
        if (!this.currentContainer.containerA) {
            this.currentContainer.installContainerA();
        }
    }

    createStarter() : StarterA {
        let starter = this.createEntityWithApp();
        starter.starterA = new StarterA(starter);
        return starter.starterA;
    }
}