import type {Entity} from "@/Entity";

export class InputA {

    private readonly ui : Entity;
    private readonly input : Entity;
    private readonly button : Entity;
    private readonly inputWrapper : Entity;


    constructor(private entity : Entity) {
        this.input = entity.appA.unboundG.createText('');
        this.input.editable = true;
        this.button = entity.appA.unboundG.createButton('show input', () => {
            this.showInput();
        });
        this.button.hidden = false;
        this.inputWrapper = entity.appA.unboundG.createTextWithList('input', entity.appA.unboundG.createButton('hide input', async () => {
            await this.showButton();
        }), this.input);
        this.inputWrapper.hidden = true;
        this.ui = entity.appA.unboundG.createList(this.button, this.inputWrapper);
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
        await this.inputWrapper.setHiddenAndUpdateUi(false);
        await this.button.setHiddenAndUpdateUi(true);
    }

    async showButton() {
        await this.inputWrapper.setHiddenAndUpdateUi(true);
        await this.button.setHiddenAndUpdateUi(false);
    }
}