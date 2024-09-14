import type {Entity} from "@/Entity";

export class InputA {

    private readonly ui : Entity;
    private readonly input : Entity;
    private readonly button : Entity;
    private readonly inputWrapper : Entity;


    constructor(private entity : Entity) {
        this.input = entity.appA.simple_createText('');
        this.input.editable = true;
        this.button = entity.appA.simple_createButton('show input', () => {
            this.showInput();
        });
        this.button.hidden = false;
        this.inputWrapper = entity.appA.simple_createTextWithList('input', entity.appA.simple_createButton('hide input', async () => {
            await this.showButton();
        }), this.input);
        this.inputWrapper.hidden = true;
        this.ui = entity.appA.simple_createList(this.button, this.inputWrapper);
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

    async showInput() {
        await this.inputWrapper.setHidden(false);
        await this.button.setHidden(true);
    }

    async showButton() {
        await this.inputWrapper.setHidden(true);
        await this.button.setHidden(false);
    }
}