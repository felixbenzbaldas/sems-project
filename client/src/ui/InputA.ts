import type {Entity} from "@/Entity";
import {textFileInput} from "@/utils";

export class InputA {

    readonly ui : Entity;
    readonly input : Entity;

    constructor(public entity : Entity) {
        let app = entity.getApp_typed();
        this.input = app.unboundG.createText('');
        this.input.editable = true;
        let html = entity.getApp_typed().createEntityWithApp();
        html.codeG_html = textFileInput(async text => {
            this.input.text = text;
            await this.input.uis_update();
        });
        let uiData = app.unboundG.createTextWithList('input', this.input,
            app.unboundG.createTextWithList('You can choose a text file as input:', html));
        uiData.collapsible = true;
        this.ui = entity.uiA.createSubUiFor(uiData).entity;
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