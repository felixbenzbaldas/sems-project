import {ListA} from "@/ListA";
import {PathA} from "@/PathA";
import {AppA} from "@/AppA";
import {ContainerA} from "@/ContainerA";
import {UiA} from "@/ui/UiA";
import {ensureEndsWithSlash, notNullUndefined, nullUndefined} from "@/utils";
import type {StarterA} from "@/StarterA";
import {TestG_NestedTestsA} from "@/tester/TestG_NestedTestsA";
import {TestRunA} from "@/tester/TestRunA";
import {DeepCopyA} from "@/DeepCopyA";
import {CommandA} from "@/CommandA";
import {RelationshipA} from "@/RelationshipA";
import {ParameterizedActionA} from "@/ParameterizedActionA";

export class Entity {

    name: string;
    container: Entity;
    text: string;
    link: string;
    app: Entity;
    editable: boolean;
    collapsible: boolean;
    codeG_html: HTMLElement;
    uis: Array<UiA>;
    context: PathA;
    commandA : CommandA;
    installCommandA() {
        this.commandA = new CommandA(this);
    }
    parameterizedActionA: ParameterizedActionA;
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
    relationshipA: RelationshipA;
    installRelationshipA() {
        this.relationshipA = new RelationshipA(this);
    }

    json_withoutContainedObjects() : any {
        let obj: any = {
            text: this.text,
            list: this.listA?.json_withoutContainedObjects(),
            collapsible: this.collapsible,
            link: this.link,
            editable: this.editable,
            content: this.appA?.uiA?.mainColumnData.json_withoutContainedObjects(),
            context: this.context?.listOfNames,
            to: this.relationshipA?.to?.listOfNames
        };
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
        return this.getApp().createPath(listOfNames, this);
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
        } else if (listOfNames[0] === '..') {
            return this.container.resolveListOfNames(listOfNames.slice(1));
        } else {
            return this.containerA.mapNameEntity.get(listOfNames[0]).resolveListOfNames(listOfNames.slice(1));
        }
    }

    pathOrDirect(object : Entity) : PathA {
        if (object.isUnbound()) {
            return this.getApp().direct(object);
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
        await this.addObjectAndDependencies_onlyIfNotContained(set);
        return set;
    }

    async getDependencies() : Promise<Set<Entity>> {
        let set = await this.getObjectAndDependencies();
        set.delete(this);
        return set;
    }

    private async addObjectAndDependencies_onlyIfNotContained(set: Set<Entity>) {
        if (!set.has(this)) {
            set.add(this);
            if (this.listA) {
                for (let current of this.listA.jsList) {
                    await (await current.resolve()).addObjectAndDependencies_onlyIfNotContained(set);
                }
            }
            if (this.context) {
                await (await this.context.resolve()).addObjectAndDependencies_onlyIfNotContained(set);
            }
            if (this.relationshipA) {
                if (this.relationshipA.to) {
                    await (await this.relationshipA.to.resolve()).addObjectAndDependencies_onlyIfNotContained(set);
                }
            }
        }
    }

    getApp() : AppA {
        if (this.appA) {
            return this.appA;
        } else {
            return this.app?.appA;
        }
    }

    log(log: string) {
        this.getApp()?.logG.log(this, log);
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
            await ui.withObjectA_update();
        }
    }

    uis_update_containerStyle() {
        for (let ui of this.getAllUis()) {
            ui.headerG.updateContainerStyle();
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
        code.app = this.getApp().entity;
        code.codeG_jsFunction = jsFunction;
        let containerA = this.containerA ? this.containerA : this.getApp().entity.containerA;
        containerA.bind(code, name);
        return code;
    }

    async testG_run(withoutNestedTests? : boolean) : Promise<Entity> {
        let testRun : Entity = this.getApp().createEntityWithApp();
        testRun.installTestRunA();
        let testRunA = testRun.testRunA;
        testRunA.test = this;
        testRun.collapsible = true;
        if (!withoutNestedTests && this.testG_nestedTestsA) {
            testRunA.nestedRuns = this.getApp().unboundG.createList();
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
        let copy = await this.getApp().createBoundEntity();
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

    async script_setContextForAllObjectsInContainer() {
        for (let value of [this, ...this.containerA.mapNameEntity.values()]) {
            if (value.listA) {
                (await value.listA.getResolvedList()).forEach((subitem : Entity) => {
                    subitem.context = subitem.getPath(value);
                });
            }
        }
    }

    async getUrl() : Promise<string> {
        if (await this.getFixedUrl()) {
            return await this.getFixedUrl();
        } else {
            let superiorWithFixedUrl = await this.getSuperiorWithFixedUrl();
            if (superiorWithFixedUrl) {
                return ensureEndsWithSlash(await superiorWithFixedUrl.getFixedUrl()) + superiorWithFixedUrl.getPath(this).listOfNames.join('/');
            }
        }
        return undefined;
    }

    async getFixedUrl() : Promise<string> {
        let propertyName = 'fixedUrl';
        if (await this.has(propertyName)) {
            return (await this.get(propertyName)).text;
        }
    }

    async getSuperiorWithFixedUrl() : Promise<Entity> {
        if (this.container) {
            if (await this.container.getFixedUrl()) {
                return this.container;
            } else {
                return await this.container.getSuperiorWithFixedUrl();
            }
        } else {
            return undefined;
        }
    }

    getTopLevelContainer() : ContainerA {
        if (this.container) {
            return this.container.getTopLevelContainer();
        } else if (this.containerA) {
            return this.containerA;
        } else {
            return undefined;
        }
    }

    delete() {
        if (this.container) {
            this.container.containerA.mapNameEntity.delete(this.name);
        }
        let app = this.getApp().entity;
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

    canFindContainer() : boolean {
        return !!this.containerA || !!this.container;
    }

    async set(propertyName: string, value : Entity) {
        if (!this.listA) {
            this.installListA();
        }
        let relationship : RelationshipA;
        if (await this.has(propertyName)) {
            relationship = await this.getProperty(propertyName);
        } else {
            relationship = await this.addProperty(propertyName);
        }
        relationship.to = relationship.entity.getPath(value);
    }

    async has(propertyName : string) {
        return notNullUndefined(this.listA) && notNullUndefined(await this.getProperty(propertyName));
    }

    async getProperty(propertyName : string) : Promise<RelationshipA> {
        for (let item of (await this.listA.getResolvedList())) {
            if (item.relationshipA && item.text === propertyName)  {
                return item.relationshipA;
            }
        }
    }

    async addProperty(propertyName : string) : Promise<RelationshipA> {
        let property : RelationshipA;
        if (this.canFindContainer()) {
            property = await this.findContainer().createRelationship();
            await this.listA.add(property.entity);
        } else {
            property = this.getApp().unboundG.createRelationship();
            this.listA.addDirect(property.entity);
        }
        property.entity.text = propertyName;
        return property;
    }

    async get(propertyName: string) : Promise<Entity> {
        if (this.listA) {
            return await (await this.getProperty(propertyName)).to.resolve();
        }
        return null;
    }

    async find(pattern: string) : Promise<ListA> {
        let list = this.getApp().unboundG.createList();
        if (notNullUndefined(this.text) && this.text.indexOf(pattern) >= 0) {
            list.listA.addDirect(this);
        }
        if (this.containerA) {
            for (let contained of this.containerA.mapNameEntity.values()) {
                let subresults = await contained.find(pattern);
                if (subresults.jsList.length > 0) {
                    list.listA.addDirect(subresults.entity);
                }
            }
        }
        return list.listA;
    }
}