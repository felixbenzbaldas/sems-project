import type {Entity} from "@/Entity";
import {UiA} from "@/ui/UiA";
import {textFileInput} from "@/utils";

export class InputA {

    readonly ui : Entity;
    readonly input : Entity;

    constructor(private entity : Entity) {
        this.input = entity.appA.unboundG.createText('');
        this.input.editable = true;
        let html = entity.getApp_typed().createEntityWithApp();
        html.codeG_html = textFileInput(async text => {
            this.input.text = text;
            await this.input.uis_update();
        });
        this.ui = entity.appA.unboundG.createTextWithList('input', this.input,
            entity.appA.unboundG.createTextWithList('You can choose a text file as input:', html));
        this.ui.uiA = new UiA(this.ui);
        this.ui.collapsible = true;
    }

    getUi() : Entity {
        return this.ui;
    }

    get() : string {
        return this.input.text;
    }

    async clear() {
        this.input.text = '';
        await this.input.uis_update_text();
    }
}