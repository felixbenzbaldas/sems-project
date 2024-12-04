import type {Entity} from "@/Entity";
import {UiA} from "@/ui/UiA";
import type {TestRunA} from "@/test/TestRunA";
import {notNullUndefined} from "@/utils";
import {run} from "vue-tsc";

export class UiA_TestRunG {

    bodyContent: Entity;
    headerContent_htmlElement: HTMLElement;

    constructor(private entity : Entity) {
    }

    async update() {
        this.updateHeaderContent();
        await this.updateBodyContent();
    }

    updateHeaderContent() {
        this.headerContent_htmlElement = document.createElement('div');
        this.headerContent_htmlElement.innerText = this.header_getText();
        this.headerContent_htmlElement.style.color = this.getTestRun().resultG_success ? 'green' : 'red';
        let runInOwnWindow = document.createElement('a');
        runInOwnWindow.href = this.entity.getApp_typed().environment.url.origin + '/?run=' + this.getPathString();
        runInOwnWindow.innerText = '[open]';
        runInOwnWindow.style.marginLeft = '0.6rem';
        runInOwnWindow.style.fontSize = '0.7rem';
        runInOwnWindow.style.color = 'grey';
        runInOwnWindow.style.textDecoration = "none";
        this.headerContent_htmlElement.appendChild(runInOwnWindow);
    }

    async updateBodyContent() {
        let appA = this.entity.getApp().appA;
        this.bodyContent = appA.unboundG.createList();
        if (this.getTestRun().resultG_error) {
            let error = appA.unboundG.createCollapsible('failed with ' + this.getTestRun().resultG_error.message);
            if (this.getTestRun().resultG_error.stack) {
                error.listA.jsList.push(appA.unboundG.createTextWithList('stacktrace:',
                    appA.unboundG.createText(this.getTestRun().resultG_error.stack)));
            }
            this.bodyContent.listA.jsList.push(error);
        }
        if (this.getObject().testRunA.nestedRuns) {
            this.bodyContent.listA.jsList.push(this.getObject().testRunA.nestedRuns);
        }
        if (this.getObject().testRunA.appUi) {
            this.bodyContent.listA.jsList.push(
                this.entity.getApp().appA.unboundG.createCollapsible('ui', this.getObject().testRunA.appUi.entity));
        }
        this.bodyContent.uiA = new UiA(this.bodyContent);
        await this.bodyContent.uiA.update();
    }

    getTestRun() : TestRunA {
        return this.getObject().testRunA;
    }

    getObject() : Entity {
        return this.entity.uiA.getObject();
    }

    getPathString() : string {
        return this.entity.getApp().getPath(this.getTestRun().test).pathA.listOfNames.join('_');
    }

    header_getText() : string {
        return 'run: ' + this.getPathString();
    }

    hasBodyContent() : boolean {
        return notNullUndefined(this.getTestRun().resultG_error) ||
            notNullUndefined(this.getTestRun().nestedRuns) ||
            notNullUndefined(this.getTestRun().appUi);
    }
}