import type {Entity} from "@/Entity";
import {textFileInput} from "@/utils";

export class InputA {

    ui : Entity;
    input : Entity;

    private constructor(public entity : Entity) {
    }

    static async create(entity : Entity) {
        let inputA = new InputA(entity);
        let app = entity.getApp_typed();
        inputA.input = app.unboundG.createText('');
        inputA.input.editable = true;
        let html = entity.getApp_typed().createEntityWithApp();
        html.codeG_html = textFileInput(async text => {
            inputA.input.text = text;
            await inputA.input.uis_update();
        });
        let uiData = app.unboundG.createTextWithList('input', inputA.input,
            app.unboundG.createTextWithList('You can choose a text file as input:', html));
        uiData.collapsible = true;
        inputA.ui = (await entity.uiA.createSubUiFor(uiData)).entity;
        return inputA;
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