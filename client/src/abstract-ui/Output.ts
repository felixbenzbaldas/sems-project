import type {Identity} from "@/Identity";

export class Output {

    private readonly ui : Identity;
    private readonly output : Identity;

    constructor(private identity : Identity) {
        this.output = this.identity.appA_simple_createText('');
        this.ui = this.identity.appA_simple_createTextWithList('output', this.output, this.identity.appA_simple_createButton('hide output', () => {
            this.ui.setHidden(true);
        }));
        this.ui.hidden = true;
    }

    set(string : string) {
        this.output.setText(string);
        this.ui.setHidden(false);
    }

    getUi() : Identity {
        return this.ui;
    }

}