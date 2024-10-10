import type {Entity} from "@/Entity";
import type {AppA_UiA} from "@/ui/AppA_UiA";
import {ContainerA} from "@/core/ContainerA";
import {ListA} from "@/core/ListA";

export class AppA_UiA_GlobalEventG {

    constructor(private entity : Entity) {
    }

    async defaultAction() {
        await this.getUiA().focused.defaultAction();
    }

    async exportApp() {
        await this.getUiA().output.setAndUpdateUi(JSON.stringify(await this.entity.export(), null, 4));
    }

    async flatExportContent() {
        await this.getUiA().output.setAndUpdateUi(JSON.stringify(await this.getUiA().content.export_allDependenciesInOneContainer(), null, 4));
    }

    async flatImportToContent() {
        await this.getUiA().input.getUi().expand();
        await this.entity.appA.addAllToListFromRawData(this.getUiA().content, JSON.parse(this.getUiA().input.get()));
    }

    async toggleCollapsible() {
        await this.getUiA().focused.toggleCollapsible();
    }

    async newSubitem() {
        this.entity.logInfo('newSubitem');
        await this.getUiA().focused.newSubitem();
    }

    async expandOrCollapse() {
        await this.getUiA().focused.expandOrCollapse();
    }

    async switchCurrentContainer() {
        this.getUiA().switchCurrentContainer_AndUpdateStyles(this.getUiA().focused.getObject());

    }

    private getUiA() {
        return this.entity.appA.uiA;
    }

    async switchToAppContainer() {
        this.getUiA().switchCurrentContainer_AndUpdateStyles(this.entity);
    }

    async export() {
        let toExport;
        toExport = this.getUiA().focused.uiA.object;
        await this.getUiA().output.setAndUpdateUi(JSON.stringify(await toExport.export(), null, 4));
    }

    async import() {
        let focused = this.getUiA().focused;
        let created = this.entity.appA.unboundG.createFromJson(JSON.parse(this.getUiA().input.get()));
        this.entity.appA.currentContainer.containerA.bind(created);
        let focusedObject = focused.getObject();
        if (!focusedObject.list) {
            focusedObject.list = new ListA(focusedObject);
        }
        await focused.uiA.listG.insertObjectAtPosition(created, 0);
        await focused.uiA.update(); // TODO update in insertObjectAtPosition (without deleting old uis)
        this.getUiA().focus(focused.uiA.listG.uisOfListItems.at(0));
    }

    async focusRoot() {
        this.getUiA().focus(this.entity);
    }

    async cut() {
        let ui = this.getUiA().focused;
        this.getUiA().clipboard = ui.uiA.object;
        let uiContext = ui.ui_context;
        let position = uiContext.uiA.listG.uisOfListItems.indexOf(ui);
        uiContext.getObject().list.jsList.splice(position, 1);
        await uiContext.getObject().uis_update();
    }

    async pasteNext() {
        await this.getUiA().focused.ui_context.pasteNextOnSubitem(this.getUiA().focused);
    }
}