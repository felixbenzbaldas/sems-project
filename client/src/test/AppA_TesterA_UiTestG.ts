import type {Entity} from "@/Entity";
import {ContainerA} from "@/ContainerA";
import {assert, assert_sameAs, assertFalse} from "@/utils";

export class AppA_TesterA_UiTestG {

    name : string;
    test : Entity;

    constructor(public entity : Entity) {
        this.name = 'ui';
    }

    addTo(boundParent : Entity) {
        this.test = boundParent.testG_nestedTestsA.add(this.name, ()=>{});
        this.test.installContainerA()
        this.test.testG_installNestedTestsA();
        this.addTests();
    }

    addTests() {
        this.addTest('updateAddedSubitem', async run => {
            let appUi = this.entity.appA.createStarter().createAppWithUI_typed();
            let list = appUi.getApp().unboundG.createList_typed();
            let uiForList = appUi.createUiFor_typed(list.entity);
            await uiForList.update();
            list.jsList.push(appUi.getApp().unboundG.createText('subitem'));

            await list.entity.uis_update_addedListItem(0);

            assert_sameAs(1, uiForList.listG.uisOfListItems.length);
            assert(uiForList.htmlElement.innerHTML.includes('subitem'), 'update html');
        });
        this.addTest('updateRemovedSubitem', async run => {
            let appUi = this.entity.appA.createStarter().createAppWithUI_typed();
            let list = appUi.getApp().unboundG.createList_typed();
            list.jsList.push(appUi.getApp().unboundG.createText('subitem-one'));
            list.jsList.push(appUi.getApp().unboundG.createText('subitem-two'));
            let uiForList = appUi.createUiFor_typed(list.entity);
            await uiForList.update();
            list.jsList.splice(0, 1);

            await list.entity.uis_update_removedListItem(0);

            assert_sameAs(1, uiForList.listG.uisOfListItems.length);
            assert(!uiForList.htmlElement.innerHTML.includes('subitem-one'), 'update html');
            assert(uiForList.htmlElement.innerHTML.includes('subitem-two'), 'update html');
        });
        this.addTest('cut', async run => {
            let appUi = this.entity.appA.createStarter().createAppWithUI_typed();
            run.testRunA.appUi = appUi;
            let appA = appUi.entity.appA;
            let child = await appA.createText('child');
            let parent = await appA.createList();
            await parent.listA.add(child);
            child.context = child.getPath(parent);
            let parentUi = appUi.createUiFor_typed(parent);
            await parentUi.update();

            await parentUi.listG.uisOfListItems[0].uiA.cut();

            assert_sameAs(parent.listA.jsList.length, 0);
            // assert_sameAs(child.context, undefined);
        });
    }

    addTest(name : string, jsFunction: (testRun: Entity) => void) {
        this.test.testG_nestedTestsA.add(name, jsFunction);
    }
}