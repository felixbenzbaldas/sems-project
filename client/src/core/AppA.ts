import type {AppA_Ui} from "@/ui/AppA_Ui";
import {ListA} from "@/core/ListA";
import {PathA} from "@/core/PathA";
import {Identity} from "@/Identity";

export class AppA {

    ui: AppA_Ui;
    server: string;

    constructor(private identity : Identity) {
    }

    createIdentityWithApp() {
        let identity = this.createIdentity();
        identity.app = this.identity;
        return identity;
    }

    createIdentity() {
        return new Identity();
    }

// 'simple' means that the created object has no container and no name. It is simply an object in the memory.
    simple_createList(...jsList : Array<Identity>) : Identity {
        let list = this.createIdentityWithApp();
        list.list = new ListA(list, ...jsList);
        return list;
    }

    simple_createText(text: string) : Identity {
        let identity = this.createIdentityWithApp();
        identity.text = text;
        return identity;
    }

    simple_createLink(href: string, text?: string) {
        let identity = this.createIdentityWithApp();
        identity.link = href;
        identity.text = text;
        return identity;
    }

    simple_createTextWithList(text : string, ...jsList : Array<Identity>) : Identity {
        let identity = this.createIdentityWithApp();
        identity.text = text;
        identity.list = new ListA(identity, ...jsList);
        return identity;
    }

    simple_createButton(label : string, func : Function) : Identity {
        let button = this.createIdentityWithApp();
        button.text = label;
        button.action = func;
        return button;
    }

    async createText(text: string) : Promise<Identity> {
        return this.getCurrentContainer().containerA.createText(text);
    }

    async createList() : Promise<Identity> {
        return this.getCurrentContainer().containerA.createList();
    }

    getCurrentContainer() : Identity {
        return this.identity;
    }

    createPath(listOfNames: Array<string>) {
        let path = this.createIdentityWithApp();
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