import type {Entity} from "@/Entity";
import type {UiA} from "@/ui/UiA";

export class UiA_ParameterizedActionA {
    bodyContentUi: UiA;
    constructor(public entity : Entity) {
    }

    async bodyContentG_update() {
        let bodyContent = this.entity.getApp().unboundG.createList();
        let parameters = await this.entity.getApp().createList();
        for (let parameter of this.entity.uiA.object.parameterizedActionA.parameters) {
            await parameters.set(parameter, await this.entity.getApp().createText(''));
        }
        bodyContent.listA.addDirect(parameters);
        let button = this.entity.getApp().unboundG.createButton('run', async () => {
            let result = await this.entity.uiA.object.codeG_jsFunction(parameters);
            if (result) {
                this.entity.getApp().uiA.clipboard = result;
                this.entity.getApp().uiA.clipboard_lostContext = false;
            }
            this.entity.uiA.findAppUi().signal('run: ' + this.entity.uiA.object.text);
        });
        bodyContent.listA.addDirect(button);
        this.bodyContentUi = await this.entity.uiA.createSubUiFor(bodyContent);
    }
}