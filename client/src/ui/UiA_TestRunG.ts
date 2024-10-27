import type {Entity} from "@/Entity";
import {UiA} from "@/ui/UiA";
import type {TestRunA} from "@/test/TestRunA";

export class UiA_TestRunG {

    bodyContent: Entity;

    constructor(private entity : Entity) {
    }

    async update() {
        await this.updateBodyContent()
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
        this.bodyContent.uiA = new UiA(this.bodyContent);
        await this.bodyContent.uiA.update();
    }

    getTestRun() : TestRunA {
        return this.entity.uiA.getObject().testRunA;
    }

}