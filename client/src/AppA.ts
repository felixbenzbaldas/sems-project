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

export class AppA {

    currentContainer: Entity;
    environment: Environment;
    readonly logG: LogG;
    readonly unboundG : AppA_UnboundG;
    uiA: AppA_UiA;
    testA : AppA_TestA; // deprecated
    testerG_test: Entity;
    testMode: boolean;

    constructor(public entity : Entity) {
        this.unboundG = new AppA_UnboundG(entity);
        this.logG = new LogG(entity);
        entity.containerA = new ContainerA(entity);
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

    createPath(listOfNames: Array<string>) {
        let path = this.createEntityWithApp();
        path.pathA = new PathA(listOfNames);
        return path;
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
            this.currentContainer.containerA = new ContainerA(this.currentContainer);
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

    async testerG_run() {
        let run = await this.testerG_test.testG_run();
        await this.uiA.content.listA.add(run);
    }
}