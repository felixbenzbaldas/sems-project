import type {Entity} from "@/Entity";
import {UiA} from "@/ui/UiA";
import {div} from "@/utils";

export class UiA_TestG {

    headerContent_htmlElement: HTMLElement = div();
    bodyContentUi : UiA;

    constructor(private entity : Entity) {
    }

    async update() {
        await this.updateHeaderContent();
        await this.updateBodyContent();
    }

    async updateHeaderContent() {
        this.headerContent_htmlElement.innerHTML = null;
        this.getUiA().textG.htmlElement.style.color = this.getObject().test_result ? 'green' : 'red';
        await this.entity.uiA.textG.update();
        this.headerContent_htmlElement.appendChild(this.getUiA().textG.htmlElement);
    }

    private async updateBodyContent() {
        // let appA = this.entity.getApp().appA;
        // let bodyContent = appA.unboundG.createList();
        // if (this.getObject().test_result_error) {
        //     let errorUi = appA.unboundG.createCollapsible('failed with ' + this.getObject().test_result_error.toString());
        //     if (this.getObject().test_result_error.stack) {
        //         errorUi.listA.jsList.push(appA.unboundG.createTextWithList('stacktrace:', appA.unboundG.createText(this.getObject().test_result_error.stack)));
        //     }
        //     bodyContent.listA.jsList.push(errorUi);
        // }
        // if (this.getObject().test_app) {
        //     let log = appA.unboundG.createText('');
        //     let updateLogFunc = async () => {
        //         log.text = this.getObject().test_app.appA.logG.listOfStrings.join('\n');
        //         if (log.uiA) {
        //             await log.updateUi();
        //         }
        //     }
        //     await updateLogFunc();
        //     bodyContent.listA.addDirect(appA.unboundG.createCollapsible('log',
        //         log,
        //         appA.unboundG.createButton('update log', updateLogFunc)));
        //     bodyContent.listA.addDirect(appA.unboundG.createCollapsible('ui',
        //         this.getObject().test_app));
        // }
        // this.bodyContentUi = this.getUiA().createSubUiFor(bodyContent);
        // await this.bodyContentUi.update();

    }

    getUiA() : UiA {
        return this.entity.uiA;
    }

    getObject() : Entity {
        if (this.getUiA().object) {
            return this.getUiA().object;
        } else {
            return this.entity;
        }
    }

    header_getRawText() {
        return this.getObject().text;
    }
}