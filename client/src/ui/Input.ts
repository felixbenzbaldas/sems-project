import type {Identity} from "@/Identity";

export class Input {

    private readonly ui : Identity;
    private readonly input : Identity;
    private readonly button : Identity;
    private readonly inputWrapper : Identity;


    constructor(private identity : Identity) {
        this.input = identity.appA.simple_createText('[enter input here]');
        this.input.editable = true;
        this.button = identity.appA.simple_createButton('show input', () => {
            this.showInput();
        });
        this.button.hidden = false;
        this.inputWrapper = identity.appA.simple_createTextWithList('input', identity.appA.simple_createButton('hide input', async () => {
            await this.showButton();
        }), this.input);
        this.inputWrapper.hidden = true;
        this.ui = identity.appA.simple_createList(this.button, this.inputWrapper);
    }

    getUi() : Identity {
        return this.ui;
    }

    async set(string: string) {
        await this.input.setText(string);
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