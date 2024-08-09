import {Identity} from "@/Identity";

export class AbstractUi {

    readonly content: Identity;
    commands: Identity;
    isWebsite: boolean;

    constructor(private app: Identity) {
        this.content = app.createList();
    }

    async defaultAction() {
        this.content.list.add(await this.app.remote_createText('new item'));
    }
}