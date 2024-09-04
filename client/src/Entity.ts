import {ListA} from "@/core/ListA";
import {Subject} from "rxjs";
import {PathA} from "@/core/PathA";
import {AppA} from "@/core/AppA";
import {ContainerA} from "@/core/ContainerA";
import {GuiG} from "@/ui/GuiG";
import {notNullUndefined} from "@/utils";
import {JobPipelineG} from "@/core/JobPipelineG";

/// An identity is an object without members. It only consists of its memory address.
/// The members of this class should be interpreted as aspects which can be assigned to the identity.
/// On the logical level they do not belong to this class.
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

    private promiseUpdate : Promise<void> = Promise.resolve();

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
            await this.ui_getContext().defaultActionOnSubitem(this);
        }
    }

    ui_getContext() : Entity {
        return this.getApp();
    }

    async defaultActionOnSubitem(subitem : Entity) {
        this.log('defaultActionOnSubitem');
        if (this.appA?.ui) {
            await this.appA.ui.defaultActionOnSubitem(subitem);
        } else {
            let error = 'not implemented yet';
            this.log(error);
            throw error;
        }
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
            this.containerA.mapNameEntity.forEach((identity: Entity, name : string) => {
                exported.objects[name] = identity.json();
            });
        }
        return exported;
    }

    async export_allDependenciesInOneContainer() {
        let exported = this.json();
        let dependencies = this.getDependencies();
        if (dependencies.size > 0) {
            exported.dependencies = [];
            for (let dependency of dependencies) {
                exported.dependencies.push({
                    name: dependency.pathA.listOfNames.at(1),
                    ... (await this.resolve(dependency)).json()
                });
            }
        }
        return exported;
    }

    getDependencies() : Set<Entity> {
        let set = new Set<Entity>();
        if (this.list) {
            this.list.jsList.forEach((identity : Entity) => {
                if (identity.pathA) {
                    set.add(identity);
                }
            });
        }
        // TODO get recursive dependencies
        return set;
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
            this.log('start update');
            if (this.test_update) {
                await this.test_update();
            }
            await this.guiG.unsafeUpdate();
            this.log('end update');
        });
    }
}