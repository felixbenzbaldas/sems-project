import {ListA} from "@/core/ListA";
import {PathA} from "@/core/PathA";
import {AppA} from "@/core/AppA";
import {ContainerA} from "@/core/ContainerA";
import {UiA} from "@/ui/UiA";
import {notNullUndefined} from "@/utils";

export class Entity {

    name: string;
    container: Entity;
    text: string;
    link: string;
    list: ListA;
    app: Entity;
    action: Function;
    hidden: boolean = false;
    pathA: PathA;
    appA: AppA;
    containerA: ContainerA;
    editable: boolean;
    uiA: UiA;
    ui_context: Entity;
    test_result_error: any;
    collapsible: boolean;
    collapsed: boolean;
    test_result: boolean;
    test_app: Entity;
    dangerous_html: HTMLElement;
    isTest: boolean;
    uis: Array<Entity>;

    json_withoutContainedObjects() : any {
        let obj: any = {
            text: this.text,
            list: this.list?.json_withoutContainedObjects(),
            collapsible: this.collapsible,
            collapsed: this.collapsed,
            link: this.link,
            editable: this.editable,
            content: this.appA?.uiA?.content.json_withoutContainedObjects(),
        };
        if (this.appA?.currentContainer) {
            obj.currentContainerText = this.appA.currentContainer.text;
        }
        return obj;
    }

    async setHiddenAndUpdateUi(value : boolean) {
        this.hidden = value;
        await this.uiA.update();
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
        if (this.appA?.uiA) {
            await this.appA.uiA.newSubitem();
        } else if (this.action) {
            throw 'not implemented yet';
        } else {
            await this.ui_context.defaultActionOnSubitem(this);
        }
    }

    async defaultActionOnSubitem(subitem : Entity) {
        await this.uiA.listG.defaultActionOnSubitem(subitem);
    }

    getPath(object: Entity) : Entity {
        this.logInfo('getPath of ' + object.getShortDescription());
        if (this.contains(object)) {
            if (this === object) {
                return this.getApp().appA.createPath([]);
            } else {
                return this.getApp().appA.createPath([...this.getPath(object.container).pathA.listOfNames, object.name]);
            }
        } else {
            return this.getApp().appA.createPath(['..', ...this.container.getPath(object).pathA.listOfNames]);
        }
    }

    contains(object : Entity) : boolean {
        if (this === object) {
            return true;
        } else {
            if (object.container) {
                return this.contains(object.container);
            } else {
                return false;
            }
        }
    }

    async resolve(path: Entity) : Promise<Entity> {
        if (path.pathA.listOfNames.length === 0) {
            return this;
        } else if (path.pathA.listOfNames.at(0) === '..') {
            return this.container.resolve(path.pathA.withoutFirst());
        } else {
            return this.containerA.mapNameEntity.get(path.pathA.listOfNames[0]).resolve(path.pathA.withoutFirst());
        }
    }

    async export(): Promise<any> {
        let exported = this.json_withoutContainedObjects();
        if(this.containerA) {
            exported.objects = {};
            for (let entry of this.containerA.mapNameEntity.entries()) {
                let name : string = entry[0];
                let entity : Entity = entry[1];
                exported.objects[name] = await entity.export();
            }
        }
        return exported;
    }

    async export_allDependenciesInOneContainer() {
        let exported = this.json_withoutContainedObjects();
        let dependencies = await this.getDependencies();
        if (dependencies.size > 0) {
            exported.dependencies = [];
            for (let dependency of dependencies) {
                exported.dependencies.push({
                    name: dependency.name,
                    ... dependency.json_withoutContainedObjects()
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
        return this.getApp().appA.uiA.focused == this;
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

    logInfo(log: string) {
        this.log('                                      (info)           ' + log);
    }

    getDescription() : string {
        if(notNullUndefined(this.text)) {
            return this.text ? this.text : '[empty text]';
        } else if (this.list) {
            return 'list (' + this.list.jsList.length + ')';
        } else if (this.pathA) {
            return 'path (' + this.pathA.listOfNames + ')';
        }
        return 'tbd';
    }

    getShortDescription() {
        let description = this.getDescription();
        return description.substring(0, Math.min(description.length, 20));
    }

    async updateUi() {
        await this.uiA.update();
    }

    async newSubitem() {
        if (this.appA?.uiA) {
            await this.appA.uiA.newSubitem();
        } else {
            if (!this.list) {
                this.list = new ListA(this);
            }
            let created = await this.getApp().appA.createText('');
            await this.list.add(created);
            await this.uiA.update();
            this.getApp().appA.uiA.focus(created);
        }
    }

    async toggleCollapsible() {
        this.collapsible = !this.collapsible;
        this.collapsed = false;
        await this.uiA.update();
    }

    async expandOrCollapse() {
        if (this.collapsible) {
            if (this.collapsed) {
                await this.expand();
            } else {
                await this.collapse();
            }
        } else {
            this.log('warning: not collapsible!');
        }
    }

    async expand() {
        if (this.list?.jsList.length > 0) {
            this.collapsed = false;
            this.uiA.headerG.updateBodyIcon();
            await this.uiA.listG.update();
            await this.uiA.bodyG.expand();
        }
    }

    async collapse() {
        this.collapsed = true;
        this.uiA.headerG.updateBodyIcon();
        await this.uiA.bodyG.collapse();
    }

    uis_add(ui: Entity) {
        if (!notNullUndefined(this.uis)) {
            this.uis = [];
        }
        this.uis.push(ui);
    }

    async uis_update() {
        if (this.uiA) {
            await this.uiA.update();
        }
        if (notNullUndefined(this.uis)) {
            for (let ui of this.uis) {
                await ui.uiA.update();
            }
        }
    }
}