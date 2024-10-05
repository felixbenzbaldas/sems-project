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
        this.entity.appA.uiA.switchCurrentContainer_updateStyles(this.entity.appA.uiA.focused);

    }

    private getUiA() {
        return this.entity.appA.uiA;
    }

    async switchToAppContainer() {
        this.entity.appA.uiA.switchCurrentContainer_updateStyles(this.entity);
    }

    async export() {
        let toExport = this.entity.appA.uiA.focused;
        await this.getUiA().output.setAndUpdateUi(JSON.stringify(await toExport.export(), null, 4));
    }

    async import() {
        let focused = this.entity.appA.uiA.focused;
        let created = this.entity.appA.unboundG.createFromJson(JSON.parse(this.entity.appA.uiA.input.get()));
        this.entity.appA.currentContainer.containerA.take(created);
        if (!focused.list) {
            focused.list = new ListA(focused);
        }
        await focused.list.addAndUpdateUi(created);
        this.entity.appA.uiA.focus(created);
    }

    async focusRoot() {
        this.entity.appA.uiA.focus(this.entity);
    }
}