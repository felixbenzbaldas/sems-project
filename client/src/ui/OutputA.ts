import type {Entity} from "@/Entity";

export class OutputA {

    private readonly ui : Entity;
    private readonly output : Entity;

    constructor(private entity : Entity) {
        this.output = this.entity.appA.unboundG.createText('');
        this.ui = this.entity.appA.unboundG.createTextWithList('output', this.output, this.entity.appA.unboundG.createButton('hide output', async () => {
            await this.ui.setHiddenAndUpdateUi(true);
        }));
        this.ui.hidden = true;
    }

    async setAndUpdateUi(string : string) {
        this.output.text = string;
        this.ui.hidden = false;
        await this.ui.uiG.update();
    }

    getUi() : Entity {
        return this.ui;
    }
}