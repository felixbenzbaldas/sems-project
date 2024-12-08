import type {Entity} from "@/Entity";

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

    async toggleCollapsible() {
        await this.getUiA().focused.uiA.toggleCollapsible();
    }

    async newSubitem() {
        this.entity.logInfo('newSubitem');
        await this.getUiA().focused.uiA.newSubitem();
    }

    async paste() {
        await this.getUiA().focused.uiA.paste();
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
        let toExport = this.getUiA().focused.uiA.object;
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
        let position = 0;
        let listA = focusedObject.listA;
        await listA.insertPathOrDirectAtPosition(created, position);
        await listA.entity.uis_update_addedListItem(position);
        await focused.uiA.ensureExpanded();
        focused.getApp().appA.uiA.focus(focused.uiA.listG.uisOfListItems.at(position));
    }

    async load() {
        (document.activeElement as HTMLElement).blur();
        let created = this.entity.appA.unboundG.createFromJson(JSON.parse(this.getUiA().input.get()));
        this.entity.containerA.bind(created);
        await this.getUiA().content.listA.insertPathOrDirectAtPosition(created, 0);
        await this.getUiA().content.uis_update_addedListItem(0);
        this.getUiA().focus(this.getUiA().content.uiA.listG.uisOfListItems[0]);
        await this.getUiA().input.ui.uiA.ensureCollapsed();
        window.scroll(0, 0);
        await this.switchCurrentContainer();
    }

    async importOldJson() {
        let focused = this.getUiA().focused;
        let created = await this.entity.appA.unboundG.createFromOldJson(JSON.parse(this.getUiA().input.get()));
        this.entity.appA.currentContainer.containerA.bind(created);
        let focusedObject = focused.uiA.getObject();
        if (!focusedObject.listA) {
            focusedObject.installListA();
        }
        let position = 0;
        let listA = focusedObject.listA;
        await listA.insertPathOrDirectAtPosition(created, position);
        await listA.entity.uis_update_addedListItem(position);
        await focused.uiA.ensureExpanded();
        focused.getApp().appA.uiA.focus(focused.uiA.listG.uisOfListItems.at(position));
    }

    async focusRoot() {
        this.getUiA().focus(this.entity);
    }

    async cut() {
        await this.getUiA().focused.uiA.cut();
    }

    async mark() {
        await this.getUiA().focused.uiA.mark();
    }

    async pasteNext() {
        await this.getUiA().focused.uiA.pasteNext();
    }

    async scaleUp() {
        if (this.getUiA().focused.getObject().collapsible) {
            await this.getUiA().focused.uiA.ensureExpanded();
        }
    }

    async scaleDown() {
        if (this.getUiA().focused.getObject().collapsible) {
            await this.getUiA().focused.uiA.ensureCollapsed();
        }
    }

    async deepCopy() {
        this.getUiA().clipboard = await this.getUiA().focused.getObject().deepCopy().run();
    }

    async toggleContext() {
        await this.getUiA().focused.uiA.toggleContext()
    }

    async script_setContextForAllObjectsInContainer() {
        await this.getUiA().focused.uiA.getObject().script_setContextForAllObjectsInContainer();
    }

    async focusUiContext() {
        this.entity.getApp_typed().uiA.focus(this.getUiA().focused.uiA.context);
    }
}