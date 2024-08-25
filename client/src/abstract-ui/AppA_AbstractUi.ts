import {Identity} from "@/Identity";
import {Output} from "@/abstract-ui/Output";
import {Input} from "@/abstract-ui/Input";

export class AppA_AbstractUi {

    readonly content: Identity;
    commands: Identity;
    isWebsite: boolean;
    readonly output : Output;
    readonly input : Input;

    private focused : Identity;

    constructor(private identity: Identity) {
        this.content = identity.appA.simple_createList();
        this.content.container = identity;
        this.output = new Output(identity);
        this.input = new Input(identity);
        this.focused = identity;
    }

    async globalEvent_defaultAction() {
        await this.focused.defaultAction();
    }

    async globalEvent_exportApp() {
        this.output.set(JSON.stringify(await this.identity.export_keepContainerStructure_ignoreExternalDependencies()));
    }

    async globalEvent_exportContent() {
        this.output.set(JSON.stringify(await this.content.export_allDependenciesInOneContainer()));
    }

    async globalEvent_importToContent() {
        this.input.showInput();
        await this.identity.appA.addAllToListFromRawData(this.content, JSON.parse(this.input.get()));
    }

    async defaultAction() {
        this.content.list.add(await this.identity.appA.createText('new item'));
    }
}