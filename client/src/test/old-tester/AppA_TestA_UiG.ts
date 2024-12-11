import {StarterA} from "@/StarterA";
import type {Entity} from "@/Entity";
import {UiA} from "@/ui/UiA";
import {assert, assert_sameAs} from "@/utils";

export class AppA_TestA_UiG {

    constructor(private entity: Entity) {
    }

    createTests() {
        return [
            this.createTest('ui_switchCurrentContainer', async test => {
                let app = this.entity.appA.createStarter().createAppWithUI()
                await app.appA.uiA.globalEventG.defaultAction();

                await app.appA.uiA.globalEventG.switchCurrentContainer();

                return app.appA.currentContainer === app.appA.uiA.focused.uiA.object &&
                    app.appA.currentContainer.containerA;
            }),
        ]
    }

    private createTest(name: string, testAction: (test: Entity) => Promise<any>) {
        return this.entity.appA.testA.createTest(name, testAction);
    }
}