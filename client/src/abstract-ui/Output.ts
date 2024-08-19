import type {Identity} from "@/Identity";

export class Output {

    private readonly ui : Identity;
    private readonly text : Identity;

    constructor(private identity : Identity) {
        this.text = this.identity.createText('');
        this.ui = this.identity.createTextWithList('output', this.text, this.identity.createButton('hide output', () => {
            this.ui.setHidden(true);
        }));
        this.ui.hidden = true;
    }

    set(string : string) {
        this.text.setText(string);
        this.ui.setHidden(false);
    }

    getUi() : Identity {
        return this.ui;
    }

}