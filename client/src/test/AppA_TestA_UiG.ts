import {Starter} from "@/Starter";
import type {Entity} from "@/Entity";
import {UiA} from "@/ui/UiA";

export class AppA_TestA_UiG {

    constructor(private entity: Entity) {
    }

    createTests() {
        return [
            this.createTest('ui_makeCollapsible', async test => {
                let app = Starter.createAppWithUI();
                await app.appA.uiA.globalEventG.defaultAction();

                await app.appA.uiA.globalEventG.toggleCollapsible();

                return (await app.appA.uiA.content.list.getObject(0)).collapsible;
            }),
            this.createTest('ui_collapse', async test => {
                let app = Starter.createAppWithUI();
                await app.appA.uiA.globalEventG.defaultAction();
                await app.appA.uiA.globalEventG.toggleCollapsible();
                await app.appA.uiA.globalEventG.newSubitem();
                let firstObject = await app.appA.uiA.content.list.getObject(0);
                app.appA.uiA.focus(firstObject);

                await app.appA.uiA.globalEventG.expandOrCollapse();

                return firstObject.collapsed;
            }),
            this.createTest('ui_collapsible', async test => {
                let app = Starter.createAppWithUI();
                let collapsible = app.appA.unboundG.createCollapsible('', app.appA.unboundG.createText(''));
                collapsible.uiA = new UiA(collapsible);

                await collapsible.updateUi();

                return collapsible.collapsed;
            }),
            this.createTest('ui_newSubitem', async test => {
                let app = Starter.createAppWithUI();
                await app.appA.uiA.globalEventG.defaultAction();

                await app.appA.uiA.globalEventG.newSubitem();

                let firstObject = await app.appA.uiA.content.list.getObject(0);
                return firstObject.list.jsList.length == 1
                    && (await firstObject.list.getObject(0)).text === '';
            }),
            this.createTest('ui_switchCurrentContainer', async test => {
                let app = Starter.createAppWithUI();
                await app.appA.uiA.globalEventG.defaultAction();

                await app.appA.uiA.globalEventG.switchCurrentContainer();

                return app.appA.currentContainer === app.appA.uiA.focused &&
                    app.appA.currentContainer.containerA;
            })
        ]
    }

    private createTest(name: string, testAction: (test: Entity) => Promise<any>) {
        return this.entity.appA.testA.createTest(name, testAction);
    }
}