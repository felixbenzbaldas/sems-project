import type {Entity} from "@/Entity";
import {UiA} from "@/ui/UiA";
import type {TestRunA} from "@/test/TestRunA";
import {notNullUndefined} from "@/utils";

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
            notNullUndefined(this.getTestRun().nestedRuns);
    }
}