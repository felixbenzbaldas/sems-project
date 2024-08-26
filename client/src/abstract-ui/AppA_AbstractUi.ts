import {Identity} from "@/Identity";
import {Output} from "@/abstract-ui/Output";
import {Input} from "@/abstract-ui/Input";
import {AppA_AbstractUi_JS} from "@/ui/AppA_AbstractUi_JS";

export class AppA_AbstractUi {

    readonly content: Identity;
    commands: Identity;
    isWebsite: boolean;
    readonly output : Output;
    readonly input : Input;
    focused : Identity;
    readonly js: AppA_AbstractUi_JS;

    constructor(private identity: Identity) {
        this.content = identity.appA.simple_createList();
        this.content.container = identity;
        this.output = new Output(identity);
        this.input = new Input(identity);
        this.js = new AppA_AbstractUi_JS(identity);
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
        let created = await this.identity.appA.createText('');
        this.content.list.add(created);
        this.focused = created;
    }
}