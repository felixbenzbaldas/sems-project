import type {Entity} from "@/Entity";

export class OutputA {

    private readonly ui : Entity;
    private readonly output : Entity;

    constructor(private entity : Entity) {
        this.output = this.entity.appA.simple_createText('');
        this.ui = this.entity.appA.simple_createTextWithList('output', this.output, this.entity.appA.simple_createButton('hide output', async () => {
            await this.ui.setHidden(true);
        }));
        this.ui.hidden = true;
    }

    async setAndUpdateUi(string : string) {
        this.output.text = string;
        this.ui.hidden = false;
        await this.ui.uiG.unsafeUpdate();
    }

    getUi() : Entity {
        return this.ui;
    }

}