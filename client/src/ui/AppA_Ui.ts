import {Entity} from "@/Entity";
import {Output} from "@/ui/Output";
import {Input} from "@/ui/Input";
import {notNullUndefined} from "@/utils";

export class AppA_Ui {

    readonly content: Entity;
    commands: Entity;
    isWebsite: boolean;
    readonly output : Output;
    readonly input : Input;
    focused : Entity;
    topImpressum: Entity;

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
        await this.input.showInput();
        await this.entity.appA.addAllToListFromRawData(this.content, JSON.parse(this.input.get()));
    }

    async defaultAction() {
        let created = await this.entity.appA.createText('');
        await this.content.list.add(created);
        this.focused = created;
    }

    async focus(entity: Entity) {
        this.focused = entity;
    }

    async globalEvent_makeCollapsible() {
        this.entity.log('globalEvent_makeCollapsible');
        this.focused.collapsible = true;
        if (!this.focused.collapsed) {
            this.focused.collapsed = false;
        }
        await this.focused.update();
    }

    async globalEvent_newSubitem() {
        console.log('globalEvent_newSubitem');
        await this.focused.newSubitem();
    }
}