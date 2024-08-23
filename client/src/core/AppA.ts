import type {AppA_AbstractUi} from "@/abstract-ui/AppA_AbstractUi";
import {ListA} from "@/core/ListA";
import {PathA} from "@/core/PathA";
import {Identity} from "@/Identity";

export class AppA {

    abstractUi: AppA_AbstractUi;
    server: string;

    constructor(private identity : Identity) {
    }

    createIdentity() {
        return new Identity();
    }

    // 'simple' means that the created object has no container and no name. It is simply an object in the memory.
    simple_createList(...jsList : Array<Identity>) : Identity {
        let list = this.createIdentity();
        list.list = new ListA(list, ...jsList);
        return list;
    }

    simple_createText(text: string) : Identity {
        let identity = this.createIdentity();
        identity.text = text;
        return identity;
    }

    simple_createLink(href: string, text?: string) {
        let identity = this.createIdentity();
        identity.link = href;
        identity.text = text;
        return identity;
    }

    simple_createTextWithList(text : string, ...jsList : Array<Identity>) : Identity {
        let identity = this.createIdentity();
        identity.text = text;
        identity.list = new ListA(identity, ...jsList);
        return identity;
    }

    simple_createButton(label : string, func : Function) : Identity {
        let button = this.createIdentity();
        button.text = label;
        button.action = func;
        return button;
    }

    async createText(text: string) : Promise<Identity> {
        return this.getCurrentContainer().containerA_createText(text);
    }

    async createList() : Promise<Identity> {
        return this.getCurrentContainer().containerA_createList();
    }

    getCurrentContainer() : Identity {
        return this.identity;
    }

    createPath(listOfNames: Array<string>) {
        let path = this.createIdentity();
        path.pathA = new PathA(listOfNames);
        return path;
    }

    async addAllToListFromRawData(list: Identity, rawData: any) {
        for (let path of rawData.list) {
            let dependencyValue = (rawData.dependencies as Array<any>).find((dependency : any) =>
                dependency.name === path.at(1)
            );
            list.list.add(await this.createText(dependencyValue.text));
        }
    }

}