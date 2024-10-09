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
                app.appA.uiA.setExtraObjectForUi(true);
                await app.appA.uiA.globalEventG.defaultAction();

                await app.appA.uiA.globalEventG.toggleCollapsible();

                return (await app.appA.uiA.content.list.getObject(0)).collapsible;
            }),
            this.createTest('ui_collapse', async test => {
                let app = Starter.createAppWithUI();
                app.appA.uiA.setExtraObjectForUi(true);
                await app.appA.uiA.globalEventG.defaultAction();
                await app.appA.uiA.globalEventG.toggleCollapsible();
                await app.appA.uiA.globalEventG.newSubitem();
                let firstObjectUi = app.appA.uiA.content.uiA.listG.uisOfListItems.at(0);
                app.appA.uiA.focus(firstObjectUi);

                await app.appA.uiA.globalEventG.expandOrCollapse();

                return firstObjectUi.collapsed;
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
            }),
            this.createTest('ui_cut', async test => {
                let app = Starter.createAppWithUI();
                test.test_app = app;
                app.appA.logG.toListOfStrings = true;
                await app.appA.uiA.globalEventG.defaultAction();
                let object = app.appA.uiA.focused;

                await app.appA.uiA.globalEventG.cut();

                return app.appA.uiA.content.list.jsList.length === 0 && app.appA.uiA.clipboard === object;
            }),
            this.createTest('ui_createUiFor', async test => {
                let app = Starter.createAppWithUI();
                test.test_app = app;
                app.appA.logG.toListOfStrings = true;
                let object = app.appA.unboundG.createText('');

                let ui : Entity = app.appA.uiA.createUiFor(object);

                return ui.uiA.object === object && object.uis.at(0) === ui;
            }),
            this.createTest('ui_list_extraObjectForUi', async test => {
                let app = Starter.createAppWithUI();
                test.test_app = app;
                app.appA.logG.toListOfStrings = true;
                let listItem = app.appA.unboundG.createText('listItem');
                let list = app.appA.unboundG.createList(listItem);
                let uiForList : Entity = app.appA.uiA.createUiFor(list);
                uiForList.uiA.listG.extraObjectForUi = true;

                await uiForList.uiA.update();

                return uiForList.uiA.listG.uisOfListItems.at(0).uiA.object === listItem
                    && uiForList.uiA.listG.uisOfListItems.at(0) != listItem;
            }),
            this.createTest('ui_list_insertObjectAtPosition', async test => {
                let app = Starter.createAppWithUI();
                test.test_app = app;
                app.appA.logG.toListOfStrings = true;
                let listItem = app.appA.unboundG.createText('listItem');
                let list = app.appA.unboundG.createList();
                let uiForList : Entity = app.appA.uiA.createUiFor(list);
                uiForList.uiA.listG.extraObjectForUi = true;
                await uiForList.uiA.update();

                let uiForListItem : Entity = await uiForList.uiA.listG.insertObjectAtPosition(listItem, 0);

                return uiForListItem.uiA.object === listItem
                    && uiForList.uiA.listG.uisOfListItems.at(0) === uiForListItem;
            })
        ]
    }

    private createTest(name: string, testAction: (test: Entity) => Promise<any>) {
        return this.entity.appA.testA.createTest(name, testAction);
    }
}