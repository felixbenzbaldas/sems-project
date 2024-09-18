import type {Entity} from "@/Entity";

export class UiG_TestG {

    headerContent_htmlElement: HTMLElement = document.createElement('div');
    bodyContent: Entity;

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

    async click(text : string) {
        await this.bodyContent.uiG.click(text);
    }

    getRawText(): string {
        let rawText = '';
        rawText += this.entity.text;
        rawText += this.bodyContent.uiG.getRawText();
        return rawText;
    }

    private async updateBodyContent() {
        let appA = this.entity.getApp().appA;
        this.bodyContent = appA.unboundG.createList();
        if (this.entity.test_result_error) {
            let errorUi = appA.unboundG.createCollapsible('failed with ' + this.entity.test_result_error.toString());
            if (this.entity.test_result_error.stack) {
                errorUi.list.jsList.push(appA.unboundG.createTextWithList('stacktrace:', appA.unboundG.createText(this.entity.test_result_error.stack)));
            }
            this.bodyContent.list.jsList.push(errorUi);
        }
        if (this.entity.test_app) {
            await this.bodyContent.list.addAndUpdateUi(appA.unboundG.createCollapsible('log',
                appA.unboundG.createText(this.entity.test_app.appA.logG.listOfStrings.join('\n'))));
            await this.bodyContent.list.addAndUpdateUi(appA.unboundG.createCollapsible('ui',
                this.entity.test_app));
        }
        await this.bodyContent.uiG.update();
    }
}