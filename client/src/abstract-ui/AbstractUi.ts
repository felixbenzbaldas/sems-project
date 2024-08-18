import {Identity} from "@/Identity";
import {Output} from "@/abstract-ui/Output";

export class AbstractUi {

    readonly content: Identity;
    commands: Identity;
    isWebsite: boolean;
    readonly output : Output;

    constructor(private identity: Identity) {
        this.content = identity.createList();
        this.output = new Output(identity);
    }

    async defaultAction() {
        this.content.list.add(await this.identity.remote_createText('new item'));
    }

    export() {
        this.output.set(JSON.stringify(this.identity.json()));
    }
}