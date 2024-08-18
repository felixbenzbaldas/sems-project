import type {Identity} from "@/Identity";

export class Output {

    private readonly ui : Identity;
    private readonly text : Identity;

    constructor(private identity : Identity) {
        this.text = this.identity.createText('');
        this.ui = this.identity.createTextWithList('output', this.text, this.identity.createButton('hide output', () => {
            this.ui.hidden = true;
            this.ui.subject.next(null);
        }));
        this.ui.hidden = true;
    }

    set(string : string) {
        this.text.text = string;
        this.text.subject.next(null);
        this.ui.hidden = false;
        this.ui.subject.next(null);
    }

    getUi() : Identity {
        return this.ui;
    }

}