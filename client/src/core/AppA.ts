import type {AppA_Ui} from "@/ui/AppA_Ui";
import {ListA} from "@/core/ListA";
import {PathA} from "@/core/PathA";
import {Entity} from "@/Entity";
import {LogG} from "@/LogG";
import {getPromiseAndResolver} from "@/utils";
import type {AppA_TestA} from "@/test/AppA_TestA";

export class AppA {

    ui: AppA_Ui;
    server: string;
    readonly logG: LogG;
    testA : AppA_TestA;

    constructor(private entity : Entity) {
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

    // 'simple' means that the created object has no container and no name. It is simply an object in the memory.
    simple_createList(...jsList : Array<Entity>) : Entity {
        let list = this.createEntityWithApp();
        list.list = new ListA(list, ...jsList);
        return list;
    }

    simple_createText(text: string) : Entity {
        let entity = this.createEntityWithApp();
        entity.text = text;
        return entity;
    }

    simple_createLink(href: string, text?: string) {
        let entity = this.createEntityWithApp();
        entity.link = href;
        entity.text = text;
        return entity;
    }

    simple_createTextWithList(text : string, ...jsList : Array<Entity>) : Entity {
        let entity = this.createEntityWithApp();
        entity.text = text;
        entity.list = new ListA(entity, ...jsList);
        return entity;
    }

    simple_createButton(label : string, func : Function) : Entity {
        let button = this.createEntityWithApp();
        button.text = label;
        button.action = func;
        return button;
    }

    async createText(text: string) : Promise<Entity> {
        return this.getCurrentContainer().containerA.createText(text);
    }

    async createList() : Promise<Entity> {
        return this.getCurrentContainer().containerA.createList();
    }

    getCurrentContainer() : Entity {
        return this.entity;
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
            await list.list.add(await this.createText(dependencyValue.text));
        }
    }

    getBlocker() : {resolve : () => void, block : () => Promise<void>} {
        let promiseAndResolver = getPromiseAndResolver();
        let block = (async () => {
            this.entity.log('start blocking');
            await promiseAndResolver.promise.then(() => {
                this.entity.log('end blocking');
            });
        });
        return {
            resolve: promiseAndResolver.resolve,
            block: block
        };
    }
}