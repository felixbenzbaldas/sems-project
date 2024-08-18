import {Identity} from "@/Identity";

export class AbstractUi {

    readonly content: Identity;
    commands: Identity;
    isWebsite: boolean;

    constructor(private app: Identity) {
        this.content = app.createList();
        this.output_abstractUi = app.createTextWithList('output');
    }

    async defaultAction() {
        this.content.list.add(await this.app.remote_createText('new item'));
    }

    export() {
        this.output_setString(JSON.stringify(this.app.json()));
        this.app.subject.next('new output');
    }

    ////////////////////////////////////////////////////////////////////////////////////
    // output aspect
    private readonly output_abstractUi: Identity;

    output_exists() : boolean {
        return this.output_abstractUi.list.jsList.length > 0;
    }

    output_setString(string : string) {
        this.output_abstractUi.list.jsList = [this.app.createText(string), this.app.createButton('hide output', () => {
            this.output_abstractUi.list.jsList = [];
            this.app.subject.next('clicked hide output');
        })];
        this.output_abstractUi.subject.next('changed');
    }

    output_getAbstractUi() : Identity {
        return this.output_abstractUi;
    }
}