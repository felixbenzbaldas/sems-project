import type {Entity} from "@/Entity";

export class UiG_TestG {

    headerContent_htmlElement: HTMLElement = document.createElement('div');
    bodyContent_htmlElement: HTMLElement = document.createElement('div');

    constructor(private entity : Entity) {
    }

    async update() {
        this.updateHeaderContent();
        await this.updateBodyContent();
    }

    private updateHeaderContent() {
        this.headerContent_htmlElement.innerHTML = null;
        this.entity.uiG.textG.htmlElement.style.color = this.entity.test_result ? 'green' : 'red';
        this.headerContent_htmlElement.appendChild(this.entity.uiG.textG.htmlElement);
    }

    async click() {

    }
    getRawText(): string {
        return '';
    }

    private async updateBodyContent() {
        this.bodyContent_htmlElement.innerHTML = null;
        let appA = this.entity.getApp().appA;
        let list = appA.simple_createList();
        if (this.entity.test_result_error) {
            await list.list.addAndUpdateUi(appA.simple_createText('failed with error: ' + this.entity.test_result_error));
        }
        if (this.entity.test_app) {
            await list.list.addAndUpdateUi(appA.simple_createCollapsible('log',
                appA.simple_createText(this.entity.test_app.appA.logG.listOfStrings.join('\n'))));
            await list.list.addAndUpdateUi(appA.simple_createCollapsible('ui',
                this.entity.test_app));
        }
        this.bodyContent_htmlElement.appendChild(list.uiG.htmlElement);
    }
}