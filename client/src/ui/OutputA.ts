import type {Entity} from "@/Entity";
import {UiA} from "@/ui/UiA";
import {downloadText, selectAllTextOfDiv} from "@/utils";

export class OutputA {

    private readonly ui : Entity;
    private readonly output : Entity;
    private readonly outputDownload : Entity;

    constructor(private entity : Entity) {
        this.output = this.entity.appA.unboundG.createText('There is no output. Click on \'export\'');
        this.outputDownload = this.entity.appA.createEntityWithApp();
        this.outputDownload.codeG_html = document.createElement('div');
        this.outputDownload.codeG_html.style.margin = '0.5rem';
        this.ui = this.entity.appA.unboundG.createTextWithList('output', this.outputDownload, this.entity.appA.unboundG.createButton('select', () => {
            selectAllTextOfDiv(this.ui.uiA.listG.uisOfListItems.at(2).uiA.textG.htmlElement);
        }), this.output);
        this.ui.uiA = new UiA(this.ui);
        this.ui.collapsible = true;
    }

    async setAndUpdateUi(string : string) {
        this.output.text = string;
        this.outputDownload.codeG_html.innerHTML = null;
        this.outputDownload.codeG_html.appendChild(downloadText(string, 'output.txt', 'download output'));
        await this.ui.uiA.update();
        await this.ui.uiA.ensureExpanded();
    }

    getUi() : Entity {
        return this.ui;
    }
}