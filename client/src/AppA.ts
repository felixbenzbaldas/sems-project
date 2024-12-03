import type {AppA_UiA} from "@/ui/AppA_UiA";
import {ListA} from "@/ListA";
import {PathA} from "@/PathA";
import {Entity} from "@/Entity";
import {LogG} from "@/LogG";
import type {AppA_TestA} from "@/test/AppA_TestA";
import {ContainerA} from "@/ContainerA";
import {AppA_UnboundG} from "@/AppA_UnboundG";
import {StarterA} from "@/StarterA";
import type {Environment} from "@/Environment";
import {AppA_TesterA} from "@/test/AppA_TesterA";

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

    async createBoundEntity() : Promise<Entity> {
        return await this.currentContainer.containerA.createBoundEntity();
    }

    async createText(text: string) : Promise<Entity> {
        return this.currentContainer.containerA.createText(text);
    }

    async createList() : Promise<Entity> {
        return this.currentContainer.containerA.createList();
    }

    createPath(listOfNames: Array<string>, subject? : Entity) {
        let path = this.createEntityWithApp();
        path.installPathA();
        path.pathA.listOfNames = listOfNames;
        path.pathA.subject = subject;
        return path;
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

    async addAllToListFromRawData(list: Entity, rawData: any) {
        for (let path of rawData.list) {
            let dependencyValue = (rawData.dependencies as Array<any>).find((dependency : any) =>
                dependency.name === path.at(1)
            );
            await list.listA.add(await this.createText(dependencyValue.text));
        }
    }

    async createCollapsible(text: string, ...jsList : Array<Entity>) {
        return await this.currentContainer.containerA.createCollapsible(text, ...jsList);
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

    ensureActive() {
        if (this.environment) {
            this.environment.ensureActive(this.entity);
        }
    }
}