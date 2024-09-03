import type {Identity} from "@/Identity";

export class Output {

    private readonly ui : Identity;
    private readonly output : Identity;

    constructor(private identity : Identity) {
        this.output = this.identity.appA.simple_createText('');
        this.ui = this.identity.appA.simple_createTextWithList('output', this.output, this.identity.appA.simple_createButton('hide output', async () => {
            await this.ui.setHidden(true);
        }));
        this.ui.hidden = true;
    }

    async set(string : string) {
        await this.output.setText(string);
        this.ui.setHidden(false);
    }

    getUi() : Identity {
        return this.ui;
    }

}