import {ListA} from "@/ListA";
import {PathA} from "@/PathA";
import {AppA} from "@/AppA";
import {ContainerA} from "@/ContainerA";
import {UiA} from "@/ui/UiA";
import {notNullUndefined, nullUndefined} from "@/utils";
import type {StarterA} from "@/StarterA";
import {TestG_NestedTestsA} from "@/test/TestG_NestedTestsA";
import {TestRunA} from "@/test/TestRunA";

export class Entity {

    name: string;
    container: Entity;
    text: string;
    link: string;
    app: Entity;
    action: Function;
    editable: boolean;
    collapsible: boolean;
    dangerous_html: HTMLElement;
    uis: Array<Entity>;
    formalTextG_jsFunction: Function;

    listA: ListA;
    installListA() {
        this.listA = new ListA(this);
    }
    pathA: PathA;
    appA: AppA;
    containerA: ContainerA;
    uiA: UiA;
    starterA: StarterA;
    testRunA: TestRunA;
    installTestRunA() {
        this.testRunA = new TestRunA(this);
    }

    // deprecated
    test_result_error: any;
    test_result: boolean;
    test_app: Entity;
    isTest: boolean;

    testG_nestedTestsA : TestG_NestedTestsA;
    testG_installNestedTestsA() {
        this.testG_nestedTestsA = new TestG_NestedTestsA(this);
        this.testG_nestedTestsA.install();
    }

    json_withoutContainedObjects() : any {
        let obj: any = {
            text: this.text,
            list: this.listA?.json_withoutContainedObjects(),
            collapsible: this.collapsible,
            collapsed: this.uiA?.collapsed,
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
            }
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

    createFormalText(name: string, jsFunction: Function) : Entity {
        let formalText : Entity = new Entity();
        formalText.app = this.getApp();
        formalText.formalTextG_jsFunction = jsFunction;
        this.containerA.bind(formalText, name);
        return formalText;
    }

    async testG_run() {
        let testRun : Entity = new Entity();
        testRun.app = this.getApp();
        testRun.installTestRunA();
        testRun.testRunA.test = this;
        if (this.testG_nestedTestsA) {
            testRun.testRunA.nestedRuns = this.getApp().appA.unboundG.createList();
            for (let nestedTest of await (this.testG_nestedTestsA.nestedTests.listA.getResolvedList())) {
                let nestedTestRun = await nestedTest.testG_run();
                testRun.testRunA.nestedRuns.listA.jsList.push(nestedTestRun);
                if (!nestedTestRun.testRunA.resultG_success) {
                    testRun.testRunA.resultG_success = false;
                }
            }
        }
        try {
            this.formalTextG_jsFunction(testRun);
            if (testRun.testRunA.resultG_success != false) {
                testRun.testRunA.resultG_success = true;
            }
        } catch (e : any) {
            testRun.testRunA.resultG_error = e;
            testRun.testRunA.resultG_success = false;
            console.error(e);
        }
        return testRun;
    }
}