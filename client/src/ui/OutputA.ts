import type {Entity} from "@/Entity";
import {UiA} from "@/ui/UiA";
import {div, downloadText, selectAllTextOfDiv} from "@/utils";

export class OutputA {

    private readonly ui : Entity;
    private readonly output : Entity;
    private readonly outputDownload : Entity;

    constructor(public entity : Entity) {
        let app = this.entity.getApp_typed();
        this.output = app.unboundG.createText('There is no output. Click on \'export\'');
        this.outputDownload = app.createEntityWithApp();
        this.outputDownload.codeG_html = div();
        this.outputDownload.codeG_html.style.margin = '0.5rem';
        let uiData = app.unboundG.createTextWithList('output',
            this.outputDownload,
            app.unboundG.createButton('select', () => {
                selectAllTextOfDiv(this.ui.uiA.listG.uisOfListItems[2].textG.htmlElement);
            }), this.output);
        uiData.collapsible = true;
        this.ui = entity.uiA.createSubUiFor(uiData).entity;
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