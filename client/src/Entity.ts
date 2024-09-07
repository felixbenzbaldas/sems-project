import {ListA} from "@/core/ListA";
import {PathA} from "@/core/PathA";
import {AppA} from "@/core/AppA";
import {ContainerA} from "@/core/ContainerA";
import {GuiG} from "@/ui/GuiG";
import {notNullUndefined} from "@/utils";
import {JobPipelineG} from "@/core/JobPipelineG";

export class Entity {

    name: string;
    container: Entity;
    text : string;
    link : string;
    list : ListA;
    app: Entity;
    action: Function;
    hidden: boolean = false;
    pathA: PathA;
    appA: AppA;
    readonly containerA : ContainerA = new ContainerA(this);
    editable: boolean;
    readonly guiG: GuiG;
    test_update: Function;
    jobPipelineG : JobPipelineG = new JobPipelineG();
    collapsible: boolean;
    ui_context: Entity;

    constructor() {
        this.guiG = new GuiG(this);
    }

    json() : any {
        return {
            'text': this.text,
            'list': this.list?.json(),
            'content': this.appA?.ui?.content.json(),
        }
    }

    async setText(string: string) {
        this.text = string;
        await this.update();
    }

    async setHidden(value : boolean) {
        this.hidden = value;
        await this.update();
    }

    async httpRequest(url : string, method : string, args : Array<any>) : Promise<any> {
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                'method': method,
                'args' : args
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'charset' : 'UTF-8'
            },
        }).then(response => response.json());
    }

    async defaultAction() {
        if (this.appA?.ui) {
            await this.appA.ui.defaultAction();
        } else if (this.action) {
            throw 'not implemented yet';
        } else {
            await this.ui_context.defaultActionOnSubitem(this);
        }
    }

    async defaultActionOnSubitem(subitem : Entity) {
        await this.guiG.listG.defaultActionOnSubitem(subitem);
    }

    getPath(object: Entity) : Entity {
        if (this.containerA.mapNameEntity) {
            if (object.container === this) {
                return this.getApp().appA.createPath([object.name]);
            }
        } else {
            if (this.container) {
                return this.getApp().appA.createPath(['..', ...this.container.getPath(object).pathA.listOfNames]);
            } else {
                throw 'not implemented yet';
            }
        }
    }

    async resolve(path: Entity) : Promise<Entity> {
        if (path.pathA.listOfNames.at(0) === '..') {
            return this.container.resolve(path.pathA.withoutFirst());
        } else {
            return this.containerA.mapNameEntity.get(path.pathA.listOfNames[0]);
        }
    }

    async export_keepContainerStructure_ignoreExternalDependencies() {
        let exported = this.json();
        if(this.containerA.mapNameEntity) {
            exported.objects = {};
            this.containerA.mapNameEntity.forEach((entity: Entity, name : string) => {
                exported.objects[name] = entity.json();
            });
        }
        return exported;
    }

    async export_allDependenciesInOneContainer() {
        let exported = this.json();
        let dependencies = await this.getDependencies();
        if (dependencies.size > 0) {
            exported.dependencies = [];
            for (let dependency of dependencies) {
                exported.dependencies.push({
                    name: dependency.name,
                    ... dependency.json()
                });
            }
        }
        return exported;
    }

    async getDependencies() : Promise<Set<Entity>> {
        let set = new Set<Entity>();
        set.add(this);
        await this.addDependencies(set, this);
        set.delete(this);
        return set;
    }

    private async addDependencies(set: Set<Entity>, entity: Entity) {
        if (entity.list) {
            for (let current of entity.list.jsList) {
                if (current.pathA) {
                    let currentObject = await this.resolve(current);
                    if (!set.has(currentObject)) {
                        set.add(currentObject);
                        await this.addDependencies(set, currentObject);
                    }
                }
            };
        }
    }

    ui_hasFocus() {
        return this.getApp().appA.ui.focused == this;
    }

    getApp() {
        if (this.appA) {
            return this;
        } else {
            return this.app;
        }
    }

    log(log: string) {
        this.getApp()?.appA?.logG.log(this, log);
    }

    getDescription() : string {
        if(notNullUndefined(this.text)) {
            return this.text ? this.text : '[empty text]';
        } else if (this.list) {
            return 'list (' + this.list.jsList.length + ')';
        } else if (this.pathA) {
            return 'path (' + this.pathA.listOfNames + ')';
        }
        return '';
    }

    getShortDescription() {
        let description = this.getDescription();
        return description.substring(0, Math.min(description.length, 20));
    }

    async update() {
        await this.jobPipelineG.runLater(async () => {
            if (this.test_update) {
                await this.test_update();
            }
            await this.guiG.unsafeUpdate();
        });
    }

    async newSubitem() {
        if (!this.list) {
            this.list = new ListA(this);
        }
        let created = await this.getApp().appA.createText('');
        await this.list.add(created);
        this.getApp().appA.ui.focused = created;
        await this.update();
    }
}