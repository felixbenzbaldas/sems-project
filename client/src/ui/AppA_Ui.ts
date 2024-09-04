import {Entity} from "@/Entity";
import {Output} from "@/ui/Output";
import {Input} from "@/ui/Input";

export class AppA_Ui {

    readonly content: Entity;
    commands: Entity;
    isWebsite: boolean;
    readonly output : Output;
    readonly input : Input;
    focused : Entity;

    constructor(private entity: Entity) {
        this.content = entity.appA.simple_createList();
        this.content.container = entity;
        this.output = new Output(entity);
        this.input = new Input(entity);
        this.focused = entity;
    }

    async globalEvent_defaultAction() {
        await this.focused.defaultAction();
    }

    async globalEvent_exportApp() {
        await this.output.set(JSON.stringify(await this.entity.export_keepContainerStructure_ignoreExternalDependencies()));
    }

    async globalEvent_exportContent() {
        await this.output.set(JSON.stringify(await this.content.export_allDependenciesInOneContainer()));
    }

    async globalEvent_importToContent() {
        this.input.showInput();
        await this.entity.appA.addAllToListFromRawData(this.content, JSON.parse(this.input.get()));
    }

    async defaultAction() {
        let created = await this.entity.appA.createText('');
        await this.content.list.add(created);
        this.focused = created;
    }

    async defaultActionOnSubitem(subitem: Entity) {
        let created = await this.entity.appA.createText('');
        let position : number = this.content.guiG.listG.guisOfListItems.indexOf(subitem) + 1;
        this.content.list.jsList.splice(position, 0, this.content.getPath(created));
        await this.content.update();
        this.focused = this.content.guiG.listG.guisOfListItems.at(position);
    }

    async focus(entity: Entity) {
        this.focused = entity;
    }
}