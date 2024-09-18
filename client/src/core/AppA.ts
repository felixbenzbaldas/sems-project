import type {AppA_UiA} from "@/ui/AppA_UiA";
import {ListA} from "@/core/ListA";
import {PathA} from "@/core/PathA";
import {Entity} from "@/Entity";
import {LogG} from "@/core/LogG";
import type {AppA_TestA} from "@/test/AppA_TestA";
import {ContainerA} from "@/core/ContainerA";
import {AppA_UnboundG} from "@/core/AppA_UnboundG";

export class AppA {

    uiA: AppA_UiA;
    server: string;
    readonly logG: LogG;
    testA : AppA_TestA;
    currentContainer: Entity;
    unboundG : AppA_UnboundG;

    constructor(private entity : Entity) {
        this.unboundG = new AppA_UnboundG(entity);
        entity.containerA = new ContainerA(entity);
        this.currentContainer = entity;
        this.logG = new LogG(entity);
    }

    createEntityWithApp() {
        let entity = this.createEntity();
        entity.app = this.entity;
        return entity;
    }

    createEntity() {
        return new Entity();
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
            await list.list.addAndUpdateUi(await this.createText(dependencyValue.text));
        }
    }
}