import type {Entity} from "@/Entity";
import type {AppA_UiA} from "@/ui/AppA_UiA";
import {ContainerA} from "@/core/ContainerA";

export class AppA_UiA_GlobalEventG {

    constructor(private entity : Entity) {
    }

    async defaultAction() {
        await this.getUiA().focused.defaultAction();
    }

    async exportApp() {
        await this.getUiA().output.setAndUpdateUi(JSON.stringify(await this.entity.export_keepContainerStructure_ignoreExternalDependencies()));
    }

    async exportContent() {
        await this.getUiA().output.setAndUpdateUi(JSON.stringify(await this.getUiA().content.export_allDependenciesInOneContainer()));
    }

    async importToContent() {
        await this.getUiA().input.showInput();
        await this.entity.appA.addAllToListFromRawData(this.getUiA().content, JSON.parse(this.getUiA().input.get()));
    }

    async toggleCollapsible() {
        await this.getUiA().focused.toggleCollapsible();
    }

    async newSubitem() {
        console.log('newSubitem');
        await this.getUiA().focused.newSubitem();
    }

    async expandOrCollapse() {
        await this.getUiA().focused.expandOrCollapse();
    }

    async switchCurrentContainer() {
        this.entity.appA.currentContainer = this.entity.appA.uiA.focused;
        if (!this.entity.appA.currentContainer.containerA) {
            this.entity.appA.currentContainer.containerA = new ContainerA(this.entity.appA.currentContainer);
        }
    }

    private getUiA() {
        return this.entity.appA.uiA;
    }

    async switchToAppContainer() {
        this.entity.appA.currentContainer = this.entity;
    }
}