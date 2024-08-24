import type {Identity} from "@/Identity";

export class Input {

    private readonly ui : Identity;
    private readonly input : Identity;
    private readonly showButton : Identity;
    private readonly inputWrapper : Identity;


    constructor(private identity : Identity) {
        this.input = identity.appA.simple_createText('[enter input here]');
        this.input.editable = true;
        this.showButton = identity.appA.simple_createButton('show input', () => {
            this.inputWrapper.setHidden(false);
            this.showButton.setHidden(true);
        });
        this.showButton.hidden = false;
        this.inputWrapper = identity.appA.simple_createTextWithList('input', identity.appA.simple_createButton('hide input', () => {
            this.inputWrapper.setHidden(true);
            this.showButton.setHidden(false);
        }), this.input);
        this.inputWrapper.hidden = true;
        this.ui = identity.appA.simple_createList(this.showButton, this.inputWrapper);
    }

    getUi() : Identity {
        return this.ui;
    }

    set(string: string) {
        this.input.setText(string);
    }

    get() : string {
        return this.input.text;
    }
}