import {ListA} from "@/ListA";
import {PathA} from "@/PathA";
import {AppA} from "@/AppA";
import {ContainerA} from "@/ContainerA";
import {UiA} from "@/ui/UiA";
import {notNullUndefined, nullUndefined} from "@/utils";
import type {StarterA} from "@/StarterA";
import type {Environment} from "@/Environment";

export class Entity {

    name: string;
    container: Entity;
    text: string;
    link: string;
    app: Entity;
    action: Function;
    hidden: boolean;
    editable: boolean;
    collapsible: boolean;
    dangerous_html: HTMLElement;
    uis: Array<Entity>;

    listA: ListA;
    pathA: PathA;
    appA: AppA;
    containerA: ContainerA;
    uiA: UiA;
    starterA: StarterA;


    test_result_error: any;
    test_result: boolean;
    test_app: Entity;
    isTest: boolean;

    json_withoutContainedObjects() : any {
        let obj: any = {
            text: this.text,
            list: this.listA?.json_withoutContainedObjects(),
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

    pathOrObject(object : Entity) : Entity {
        if (object.isUnbound()) {
            return object;
        } else {
            return this.getPath(object);
        }
    }

    isUnbound() : boolean {
        return nullUndefined(this.name) || !this.container;
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
        if (entity.listA) {
            for (let current of entity.listA.jsList) {
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
        } else if (this.listA) {
            return 'list (' + this.listA.jsList.length + ')';
        } else if (this.pathA) {
            return 'path (' + this.pathA.listOfNames + ')';
        } else if (this.uiA) {
            if (this.uiA.object) {
                return 'ui for:' + this.uiA.object.text;
            }
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

    getObject() : Entity {
        if (this.uiA?.object) {
            return this.uiA.object;
        } else {
            return this;
        }
    }

    uis_add(ui: Entity) {
        if (nullUndefined(this.uis)) {
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

    uis_update_currentContainerStyle() {
        if (this.uiA) {
            this.uiA.headerG.updateCurrentContainerStyle();
        }
        if (notNullUndefined(this.uis)) {
            for (let ui of this.uis) {
                ui.uiA.headerG.updateCurrentContainerStyle();
            }
        }
    }

    // TODO the following members belong to uiA

    ui_context: Entity;
    collapsed: boolean;

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

    async pasteNextOnSubitem(subitem: Entity) {
        await this.uiA.listG.pasteNextOnSubitem(subitem);
    }

    async newSubitem() {
        this.log('newSubitem');
        if (this.appA?.uiA) {
            await this.appA.uiA.newSubitem();
        } else {
            if (this.uiA?.object) {
                if (!this.getObject().listA) {
                    this.getObject().listA = new ListA(this.getObject());
                }
                let created = await this.getApp().appA.createText('');
                await this.uiA.listG.insertObjectAtPosition(created, 0);
                await this.uiA.update(); // TODO update in insertObjectAtPosition (without deleting old uis)
                this.getApp().appA.uiA.focus(this.uiA.listG.uisOfListItems.at(0));
            } else {
                if (!this.listA) {
                    this.listA = new ListA(this);
                }
                let created = await this.getApp().appA.createText('');
                await this.listA.add(created);
                await this.uiA.update();
                this.getApp().appA.uiA.focus(created);
            }
        }
    }

    async toggleCollapsible() {
        this.getObject().collapsible = !this.getObject().collapsible;
        this.collapsed = false;
        await this.uiA.update();
    }

    async expandOrCollapse() {
        if (this.getObject().collapsible) {
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
        if (this.getObject().listA?.jsList.length > 0) {
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

}