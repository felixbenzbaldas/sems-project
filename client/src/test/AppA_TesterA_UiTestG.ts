import type {Entity} from "@/Entity";
import {ContainerA} from "@/ContainerA";
import {assert, assert_sameAs} from "@/utils";

export class AppA_TesterA_UiTestG {

    constructor(public entity : Entity) {
    }

    addTo(boundParent : Entity) {
        let uiTest : Entity = boundParent.testG_nestedTestsA.add('ui', ()=>{});
        uiTest.containerA = new ContainerA(uiTest);
        uiTest.testG_installNestedTestsA();
        uiTest.testG_nestedTestsA.add('updateAddedSubitem', async run => {
            let appUi = this.entity.appA.createStarter().createAppWithUI_typed();
            let list = appUi.getApp().unboundG.createList_typed();
            let uiForList = appUi.createUiFor_typed(list.entity);
            await uiForList.update();
            list.jsList.push(appUi.getApp().unboundG.createText('subitem'));

            await list.entity.uis_update_addedListItem(0);

            assert_sameAs(1, uiForList.listG.uisOfListItems.length);
            assert(uiForList.htmlElement.innerHTML.includes('subitem'), 'update html');
        });
        uiTest.testG_nestedTestsA.add('updateRemovedSubitem', async run => {
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
    }
}