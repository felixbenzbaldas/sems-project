import {Identity} from "@/Identity";
import {Output} from "@/abstract-ui/Output";

export class AbstractUi {

    readonly content: Identity;
    commands: Identity;
    isWebsite: boolean;
    readonly output : Output;

    private focused : Identity;

    constructor(private identity: Identity) {
        this.content = identity.createList();
        this.output = new Output(identity);
        this.focused = identity;
    }

    async globalEvent_defaultAction() {
        await this.focused.defaultAction();
    }

    globalEvent_export() {
        this.output.set(JSON.stringify(this.identity.json()));
    }

    async defaultAction() {
        this.content.list.add(await this.identity.remote_createText('new item'));
    }
}