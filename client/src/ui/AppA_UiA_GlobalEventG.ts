import type {Entity} from "@/Entity";
import type {AppA_UiA} from "@/ui/AppA_UiA";
import {ContainerA} from "@/ContainerA";
import {ListA} from "@/ListA";

export class AppA_UiA_GlobalEventG {

    constructor(private entity : Entity) {
    }

    async defaultAction() {
        await this.getUiA().focused.uiA.defaultAction();
    }

    async exportApp() {
        await this.getUiA().output.setAndUpdateUi(JSON.stringify(await this.entity.export(), null, 4));
    }

    async flatExportContent() {
        await this.getUiA().output.setAndUpdateUi(JSON.stringify(await this.getUiA().content.export_allDependenciesInOneContainer(), null, 4));
    }

    async flatImportToContent() {
        await this.getUiA().input.getUi().uiA.expand();
        await this.entity.appA.addAllToListFromRawData(this.getUiA().content, JSON.parse(this.getUiA().input.get()));
    }

    async toggleCollapsible() {
        await this.getUiA().focused.uiA.toggleCollapsible();
    }

    async newSubitem() {
        this.entity.logInfo('newSubitem');
        await this.getUiA().focused.uiA.newSubitem();
    }

    async expandOrCollapse() {
        await this.getUiA().focused.uiA.expandOrCollapse();
    }

    async switchCurrentContainer() {
        this.getUiA().switchCurrentContainer_AndUpdateStyles(this.getUiA().focused.uiA.getObject());

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
        let focusedObject = focused.uiA.getObject();
        if (!focusedObject.listA) {
            focusedObject.installListA();
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
        let uiContext = ui.uiA.context;
        let position = uiContext.uiA.listG.uisOfListItems.indexOf(ui);
        uiContext.getObject().listA.jsList.splice(position, 1);
        await uiContext.getObject().uis_update();
    }

    async pasteNext() {
        await this.getUiA().focused.uiA.context.uiA.pasteNextOnSubitem(this.getUiA().focused);
    }
}