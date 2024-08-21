import {Identity} from "@/Identity";
import {Output} from "@/abstract-ui/Output";

export class AppA_AbstractUi {

    readonly content: Identity;
    commands: Identity;
    isWebsite: boolean;
    readonly output : Output;

    private focused : Identity;

    constructor(private identity: Identity) {
        this.content = identity.appA_simple_createList();
        this.content.container = identity;
        this.output = new Output(identity);
        this.focused = identity;
    }

    async globalEvent_defaultAction() {
        await this.focused.defaultAction();
    }

    async globalEvent_export() {
        this.output.set(JSON.stringify(await this.identity.export()));
    }

    async defaultAction() {
        this.content.list.add(await this.identity.appA_createText('new item'));
    }
}