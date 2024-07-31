import {Identity} from "@/restart-with-aspects/Identity";

export class UI {

    readonly content: Identity;
    commands: Identity;

    constructor(private app: Identity) {
        this.content = app.createList();
    }

    async newSubitem() {
        this.content.list.add(await this.app.remote_createText('new item'));
    }
}