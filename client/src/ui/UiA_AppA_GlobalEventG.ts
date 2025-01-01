import type {Entity} from "@/Entity";
import type {UiA_AppA} from "@/ui/UiA_AppA";
import type {AppA} from "@/AppA";

export class UiA_AppA_GlobalEventG {

    constructor(public entity : Entity) {
    }

    async defaultAction() {
        await this.getAppUi().focused.uiA.defaultAction();
    }

    async exportApp() {
        await this.getAppUi().output.setAndUpdateUi(JSON.stringify(await this.entity.getApp().export(), null, 4));
    }

    async toggleCollapsible() {
        await this.getAppUi().focused.uiA.toggleCollapsible();
    }

    async newSubitem() {
        this.entity.logInfo('newSubitem');
        await this.getAppUi().focused.uiA.newSubitem();
    }

    async paste() {
        await this.getAppUi().focused.uiA.paste();
    }

    async expandOrCollapse() {
        await this.getAppUi().focused.uiA.expandOrCollapse();
    }

    async switchCurrentContainer() {
        this.getAppUi().switchCurrentContainer_AndUpdateStyles(this.getAppUi().focused.uiA.getObject());

    }

    private getAppUi() : UiA_AppA {
        return this.entity.uiA.appA;
    }

    async switchToAppContainer() {
        this.getAppUi().switchCurrentContainer_AndUpdateStyles(this.entity.getApp());
    }

    async export() {
        let toExport = this.getAppUi().focused.uiA.object;
        await this.getAppUi().output.setAndUpdateUi(JSON.stringify(await toExport.export(), null, 4));
    }

    async import() {
        let focused = this.getAppUi().focused;
        let created = this.getApp().unboundG.createFromJson(JSON.parse(this.getAppUi().input.get()));
        this.getApp().currentContainer.containerA.bind(created);
        let focusedObject = focused.uiA.getObject();
        if (!focusedObject.listA) {
            focusedObject.installListA();
        }
        let position = 0;
        let listA = focusedObject.listA;
        await listA.insertPathOrDirectAtPosition(created, position);
        await listA.entity.uis_update_addedListItem(position);
        await focused.uiA.ensureExpanded();
        this.getAppUi().focus(focused.uiA.listG.uisOfListItems.at(position));
    }

    async load() {
        (document.activeElement as HTMLElement).blur();
        let created = this.getApp().unboundG.createFromJson(JSON.parse(this.getAppUi().input.get()));
        await this.getAppUi().input.clear();
        this.entity.getApp().containerA.bind(created);
        await this.getApp().uiA.content.listA.insertPathOrDirectAtPosition(created, 0);
        await this.getApp().uiA.content.uis_update_addedListItem(0);
        this.getAppUi().focus(this.getAppUi().contentUi.listG.uisOfListItems[0]);
        await this.getAppUi().input.ui.uiA.ensureCollapsed();
        window.scroll(0, 0);
        await this.switchCurrentContainer();
    }

    async importOldJson() {
        let focused = this.getAppUi().focused;
        let created = await this.getApp().unboundG.createFromOldJson(JSON.parse(this.getAppUi().input.get()));
        this.getApp().currentContainer.containerA.bind(created);
        let focusedObject = focused.uiA.getObject();
        if (!focusedObject.listA) {
            focusedObject.installListA();
        }
        let position = 0;
        let listA = focusedObject.listA;
        await listA.insertPathOrDirectAtPosition(created, position);
        await listA.entity.uis_update_addedListItem(position);
        await focused.uiA.ensureExpanded();
        this.getAppUi().focus(focused.uiA.listG.uisOfListItems.at(position));
    }

    async focusRoot() {
        this.getAppUi().focus(this.getAppUi().entity);
    }

    async cut() {
        await this.getAppUi().focused.uiA.cut();
    }

    async mark() {
        await this.getAppUi().focused.uiA.mark();
    }

    async pasteNext() {
        await this.getAppUi().focused.uiA.pasteNext();
    }

    async scaleUp() {
        if (this.getAppUi().focused.getObject().collapsible) {
            await this.getAppUi().focused.uiA.expandWithAnimation();
        }
    }

    async scaleDown() {
        if (this.getAppUi().focused.getObject().collapsible) {
            await this.getAppUi().focused.uiA.collapseWithAnimation();
        }
    }

    async deepCopy() {
        let focusedObject = this.getAppUi().focused.getObject();
        this.getAppUi().getObject().appA.uiA.clipboard = await focusedObject.deepCopy().run();
        this.getAppUi().signal('copied deep: ' + this.getAppUi().getObject().appA.uiA.clipboard.getShortDescription());
    }

    async toggleContext() {
        await this.getAppUi().focused.uiA.toggleContext()
    }

    async script_setContextForAllObjectsInContainer() {
        await this.getAppUi().focused.uiA.getObject().script_setContextForAllObjectsInContainer();
    }

    async focusUiContext() {
        this.getAppUi().focus(this.getAppUi().focused.uiA.context);
    }

    async setLink() {
        await this.getAppUi().focused.uiA.setLink();
    }

    async shakeTree() {
        await this.getAppUi().focused.uiA.shakeTree();
    }

    getApp() : AppA {
        return this.entity.getApp_typed();
    }
}