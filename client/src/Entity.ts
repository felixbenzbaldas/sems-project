import {ListA} from "@/ListA";
import {PathA} from "@/PathA";
import {AppA} from "@/AppA";
import {ContainerA} from "@/ContainerA";
import {UiA} from "@/ui/UiA";
import {notNullUndefined, nullUndefined} from "@/utils";
import type {StarterA} from "@/StarterA";
import {TestG_NestedTestsA} from "@/tester/TestG_NestedTestsA";
import {TestRunA} from "@/tester/TestRunA";
import {DeepCopyA} from "@/DeepCopyA";

export class Entity {

    name: string;
    container: Entity;
    text: string;
    link: string;
    app: Entity;
    action: Function;
    editable: boolean;
    collapsible: boolean;
    codeG_html: HTMLElement;
    uis: Array<UiA>;
    context: PathA;

    codeG_jsFunction: Function;

    listA: ListA;
    installListA() {
        this.listA = new ListA(this);
    }
    pathA: PathA;
    installPathA() {
        this.pathA = new PathA(this);
    }
    appA: AppA;
    containerA: ContainerA;
    installContainerA() {
        this.containerA = new ContainerA(this);
    }
    uiA: UiA;
    starterA: StarterA;
    testRunA: TestRunA;
    installTestRunA() {
        this.testRunA = new TestRunA(this);
    }

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
            link: this.link,
            editable: this.editable,
            content: this.appA?.uiA?.content.json_withoutContainedObjects(),
            context: this.context?.listOfNames
        };
        if (this.appA?.currentContainer) {
            obj.currentContainerText = this.appA.currentContainer.text;
        }
        return obj;
    }

    getPath(object: Entity) : PathA {
        this.logInfo('getPath of ' + object.getShortDescription());
        let listOfNames : Array<string>;
        if (this.contains(object)) {
            if (this === object) {
                listOfNames = [];
            } else {
                listOfNames = [...this.getPath(object.container).listOfNames, object.name];
            }
        } else {
            listOfNames = ['..', ...this.container.getPath(object).listOfNames];
        }
        return this.getApp_typed().createPath(listOfNames, this);
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

    async resolveListOfNames(listOfNames : Array<string>) : Promise<Entity> {
        if (listOfNames.length === 0) {
            return this;
        } else if (listOfNames.at(0) === '..') {
            return this.container.resolveListOfNames(listOfNames.slice(1));
        } else {
            return this.containerA.mapNameEntity.get(listOfNames[0]).resolveListOfNames(listOfNames.slice(1));
        }
    }

    pathOrDirect(object : Entity) : PathA {
        if (object.isUnbound()) {
            return this.getApp_typed().direct_typed(object);
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

    // flat export (not used at the moment)
    // async export_allDependenciesInOneContainer() {
    //     let exported = this.json_withoutContainedObjects();
    //     let dependencies = await this.getDependencies();
    //     if (dependencies.size > 0) {
    //         exported.dependencies = [];
    //         for (let dependency of dependencies) {
    //             exported.dependencies.push({
    //                 name: dependency.name,
    //                 ... dependency.json_withoutContainedObjects()
    //             });
    //         }
    //     }
    //     return exported;
    // }

    async getObjectAndDependencies() : Promise<Set<Entity>> {
        let set = new Set<Entity>();
        set.add(this);
        await this.addDependencies(set);
        return set;
    }

    async getDependencies() : Promise<Set<Entity>> {
        let set = await this.getObjectAndDependencies();
        set.delete(this);
        return set;
    }

    async addDependencies(set: Set<Entity>) {
        let add = async (set: Set<Entity>, toAdd : Entity) => {
            if (!set.has(toAdd)) {
                set.add(toAdd);
                await toAdd.addDependencies(set);
            }
        }
        if (this.listA) {
            for (let current of this.listA.jsList) {
                await add(set, await current.resolve());
            }
        }
        if (this.context) {
            await add(set, await this.context.resolve());
        }
    }

    getApp() {
        if (this.appA) {
            return this;
        } else {
            return this.app;
        }
    }

    getApp_typed() {
        return this.getApp().appA;
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
            return 'list (' + this.listA.jsList?.length + ')';
        } else if (this.pathA) {
            return 'path (' + this.pathA.listOfNames + ')';
        } else if (this.uiA) {
            return 'ui';
        } else if (notNullUndefined(this.name)) {
            return 'name: ' + this.name;
        } else if (this.testRunA) {
            return 'run: ' + this.testRunA.test?.name;
        }
        return 'tbd';
    }

    getShortDescription() {
        let description = this.getDescription();
        return description.substring(0, Math.min(description.length, 20));
    }

    getObject() : Entity {
        if (this.uiA?.object) {
            return this.uiA.object;
        } else {
            return this;
        }
    }

    uis_add(ui: UiA) {
        if (nullUndefined(this.uis)) {
            this.uis = [];
        }
        this.uis.push(ui);
    }

    async uis_update() {
        for (let ui of this.getAllUis()) {
            await ui.update();
        }
    }

    uis_update_currentContainerStyle() {
        for (let ui of this.getAllUis()) {
            ui.headerG.updateCurrentContainerStyle();
        }
    }

    async uis_update_addedListItem(position: number) {
        for (let ui of this.getAllUis()) {
            await ui.update_addedListItem(position);
        }
    }

    async uis_update_removedListItem(position: number) {
        for (let ui of this.getAllUis()) {
            await ui.update_removedListItem(position);
        }
    }

    async uis_update_text() {
        for (let ui of this.getAllUis()) {
            await ui.update_text();
        }
    }

    async uis_update_collapsible() {
        for (let ui of this.getAllUis()) {
            await ui.update_collapsible();
        }
    }

    async uis_update_context() {
        for (let ui of this.getAllUis()) {
            await ui.update_context();
        }
    }

    getAllUis() : Array<UiA> {
        let allUis : Array<UiA> = [];
        if (this.uiA) {
            allUis.push(this.uiA);
        }
        if(notNullUndefined(this.uis)) {
            allUis.push(...this.uis);
        }
        return allUis;
    }

    createCode(name: string, jsFunction: Function) : Entity {
        let code : Entity = new Entity();
        code.app = this.getApp();
        code.codeG_jsFunction = jsFunction;
        let containerA = this.containerA ? this.containerA : this.getApp().containerA;
        containerA.bind(code, name);
        return code;
    }

    async testG_run(withoutNestedTests? : boolean) : Promise<Entity> {
        let testRun : Entity = this.getApp_typed().createEntityWithApp();
        testRun.installTestRunA();
        let testRunA = testRun.testRunA;
        testRunA.test = this;
        testRun.collapsible = true;
        if (!withoutNestedTests && this.testG_nestedTestsA) {
            testRunA.nestedRuns = this.getApp().appA.unboundG.createList();
            for (let nestedTest of await (this.testG_nestedTestsA.nestedTests.listA.getResolvedList())) {
                let nestedTestRun = await nestedTest.testG_run();
                testRunA.nestedRuns.listA.addDirect(nestedTestRun);
                if (!nestedTestRun.testRunA.resultG_success) {
                    testRunA.resultG_success = false;
                }
            }
        }
        try {
            await this.codeG_jsFunction(testRunA);
            if (testRunA.resultG_success != false) {
                testRunA.resultG_success = true;
            }
        } catch (e : any) {
            testRunA.resultG_error = e;
            testRunA.resultG_success = false;
            console.error(e);
        }
        return testRun;
    }

    async shallowCopy() : Promise<Entity> {
        let copy = await this.getApp_typed().createBoundEntity();
        copy.text = this.text;
        copy.collapsible = this.collapsible;
        copy.link = this.link;
        copy.editable = this.editable;
        if (this.listA) {
            copy.installListA();
            for (let listItem of this.listA.jsList) {
                copy.listA.jsList.push(copy.getPath(await listItem.resolve()));
            }
        }
        return copy;
    }

    deepCopy(targetContainer : ContainerA) : DeepCopyA {
        return new DeepCopyA(this, targetContainer);
    }

    containerMark() : boolean {
        if (this.name === 'sa9llaMlry') {
            return true;
        } else {
            if (this.container) {
                return this.container.containerMark();
            } else {
                return false;
            }
        }
    }

    async script_setContextForAllObjectsInContainer() {
        for (let value of [this, ...this.containerA.mapNameEntity.values()]) {
            if (value.listA) {
                (await value.listA.getResolvedList()).forEach((subitem : Entity) => {
                    subitem.context = subitem.getPath(value);
                });
            }
        }
    }

    getUrl() : string {
        if (this.container) {
            let containerWithUrl = this.container.getContainerWithFixedUrl();
            return containerWithUrl.text.substring(1) + '/?path=' + containerWithUrl.getPath(this).asString();
        } else {
            return '';
        }
    }

    getContainerWithFixedUrl() : Entity {
        if (this.text?.startsWith('#http')) {
            return this;
        } else {
            if (this.container) {
                return this.container.getContainerWithFixedUrl();
            } else {
                return undefined;
            }
        }
    }

    hasUrl() {
        return notNullUndefined(this.getContainerWithFixedUrl());
    }

    delete() {
        if (this.container) {
            this.container.containerA.mapNameEntity.delete(this.name);
        }
        let app = this.getApp();
        let object : any = this;
        for (let key of Object.keys(object)) {
            object[key] = undefined;
        }
        this.app = app;
    }

    findContainer() : ContainerA {
        if (this.containerA) {
            return this.containerA;
        } else if (this.container) {
            return this.container.containerA;
        } else {
            throw new Error('found no container!');
        }
    }
}