import type {Entity} from "@/Entity";
import {UiA} from "@/ui/UiA";
import {selectAllTextOfDiv} from "@/utils";

export class OutputA {

    private readonly ui : Entity;
    private readonly output : Entity;

    constructor(private entity : Entity) {
        this.output = this.entity.appA.unboundG.createText('There is no output. Click on \'export\'');
        this.ui = this.entity.appA.unboundG.createTextWithList('output', this.entity.appA.unboundG.createButton('select', () => {
            selectAllTextOfDiv(this.ui.uiA.listG.uisOfListItems.at(1).uiA.textG.htmlElement);
        }), this.output);
        this.ui.uiA = new UiA(this.ui);
        this.ui.collapsible = true;
    }

    async setAndUpdateUi(string : string) {
        this.output.text = string;
        await this.ui.uiA.expand();
        await this.ui.uiA.update();
    }

    getUi() : Entity {
        return this.ui;
    }
}