import type {Entity} from "@/Entity";
import type {UiA_AppA} from "@/ui/UiA_AppA";
import type {AppA} from "@/AppA";

export class UiA_AppA_GlobalEventG {

    constructor(public entity : Entity) {
    }

    async defaultAction() {
        await this.getAppUi().focused.defaultAction();
    }

    async exportApp() {
        await this.getAppUi().output.setAndUpdateUi(JSON.stringify(await this.entity.getApp().export(), null, 4));
    }

    async toggleCollapsible() {
        await this.getAppUi().focused.toggleCollapsible();
    }

    async newSubitem() {
        this.entity.logInfo('newSubitem');
        await this.getAppUi().focused.newSubitem();
    }

    async paste() {
        await this.getAppUi().focused.paste();
    }

    async expandOrCollapse() {
        await this.getAppUi().focused.expandOrCollapse();
    }

    async ensureContainer() {
        this.getAppUi().ensureContainer_AndUpdateStyle(this.getAppUi().focused.getObject());

    }

    private getAppUi() : UiA_AppA {
        return this.entity.uiA.appA;
    }

    async export() {
        let toExport = this.getAppUi().focused.object;
        await this.getAppUi().output.setAndUpdateUi(JSON.stringify(await toExport.export(), null, 4));
    }

    async import() {
        let created = this.getApp().unboundG.createFromJson(JSON.parse(this.getAppUi().input.get()));
        this.getAppUi().focused.getObject().containerA.bind(created);
        this.getApp().uiA.clipboard = created;
    }

    async load() {
        (document.activeElement as HTMLElement).blur();
        let created = this.getApp().unboundG.createFromJson(JSON.parse(this.getAppUi().input.get()));
        await this.getAppUi().input.clear();
        this.entity.getApp().containerA.bind(created);
        await this.getApp().uiA.content.listA.insertPathOrDirectAtPosition(created, 0);
        await this.getApp().uiA.content.uis_update_addedListItem(0);
        this.getAppUi().focus(this.getAppUi().contentUi.listA.uisOfListItems[0]);
        await this.getAppUi().input.ui.uiA.ensureCollapsed();
        window.scroll(0, 0);
        await this.ensureContainer();
    }

    async importOldJson() {
        let created = await this.getApp().unboundG.createFromOldJson(JSON.parse(this.getAppUi().input.get()));
        this.getAppUi().focused.getObject().containerA.bind(created);
        this.getApp().uiA.clipboard = created;
    }

    async focusRoot() {
        this.getAppUi().focus(this.getAppUi().entity.uiA);
    }

    async cut() {
        await this.getAppUi().focused.cut();
    }

    async mark() {
        await this.getAppUi().focused.mark();
    }

    async pasteNext() {
        await this.getAppUi().focused.pasteNext();
    }

    async scaleUp() {
        if (this.getAppUi().focused.getObject().collapsible) {
            await this.getAppUi().focused.expandWithAnimation();
        }
    }

    async scaleDown() {
        if (this.getAppUi().focused.getObject().collapsible) {
            await this.getAppUi().focused.collapseWithAnimation();
        }
    }

    async deepCopy() {
        let focusedObject = this.getAppUi().focused.getObject();
        if (focusedObject.containerA) {
            let app_uiA = this.entity.getApp_typed().uiA;
            if (app_uiA.clipboard) {
                app_uiA.clipboard = await app_uiA.clipboard.deepCopy(focusedObject.containerA).run();
                this.getAppUi().signal('copied deep: ' + app_uiA.clipboard.getShortDescription());
            } else {
                this.getAppUi().signal('Error: no object in clipboard (will be copied)');
            }
        } else {
            this.getAppUi().signal('Error: the target is not a container (target = focus)');
        }
    }

    async toggleContext() {
        await this.getAppUi().focused.toggleContext()
    }

    async script_setContextForAllObjectsInContainer() {
        await this.getAppUi().focused.getObject().script_setContextForAllObjectsInContainer();
    }

    async focusUiContext() {
        this.getAppUi().focus(this.getAppUi().focused.context);
    }

    async setLink() {
        await this.getAppUi().focused.setLink();
    }

    async shakeTree() {
        await this.getAppUi().focused.shakeTree();
    }

    getApp() : AppA {
        return this.entity.getApp_typed();
    }

    async editMode() {
        await this.getAppUi().focused.enterEditMode();
    }

    async focusPrevious() {
        await this.getAppUi().focused.focusPrevious();
    }

    async focusNext() {
        await this.getAppUi().focused.focusNext();
    }

    async toEndOfList() {
        await this.getAppUi().focused.toEndOfList();
    }

    leaveEditMode() {
        this.getAppUi().focused.leaveEditMode();
    }

    async exportProfile() {
        let toExport = this.entity.getApp().containerA.mapNameEntity.get('profile');
        await this.getAppUi().output.setAndUpdateUi(JSON.stringify(await toExport.export(), null, 4));
    }

    async importProfile() {
        (document.activeElement as HTMLElement).blur();
        let created = this.getApp().unboundG.createFromJson(JSON.parse(this.getAppUi().input.get()));
        await this.getAppUi().input.clear();
        this.entity.getApp().containerA.bind(created, 'profile');
        await this.getApp().uiA.content.listA.insertPathOrDirectAtPosition(created, 0);
        await this.getApp().uiA.content.uis_update_addedListItem(0);
        this.getAppUi().focus(this.getAppUi().contentUi.listA.uisOfListItems[0]);
        await this.getAppUi().input.ui.uiA.ensureCollapsed();
        window.scroll(0, 0);
        await this.ensureContainer();
    }

}