import type {Entity} from "@/Entity";
import {UiA} from "@/ui/UiA";

export class InputA {

    private readonly ui : Entity;
    private readonly input : Entity;

    constructor(private entity : Entity) {
        this.input = entity.appA.unboundG.createText('');
        this.input.editable = true;
        this.ui = entity.appA.unboundG.createTextWithList('input', this.input);
        this.ui.uiA = new UiA(this.ui);
        this.ui.collapsible = true;
    }

    getUi() : Entity {
        return this.ui;
    }

    set(string: string) {
        this.input.text = string;
    }

    get() : string {
        return this.input.text;
    }
}