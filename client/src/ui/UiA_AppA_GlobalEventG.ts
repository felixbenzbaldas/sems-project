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

    async clear() {
        await this.getAppUi().clear();
    }

    async exportProfile() {
        let profile = this.entity.getApp_typed().getProfile();
        let forContent = await profile.listA.findByText('#content');
        forContent.listA.jsList = [];
        let content = this.entity.getApp_typed().uiA.content;
        for (let resolved of await content.listA.getResolvedList()) {
            await forContent.listA.add(resolved);
        }
        await this.getAppUi().output.setAndUpdateUi(JSON.stringify(await profile.export(), null, 4));
        this.getAppUi().signal('exported the profile');
    }

    async importProfile() {
        let created = this.getApp().unboundG.createFromJson(JSON.parse(this.getAppUi().input.get()));
        this.entity.getApp_typed().setProfile(created);
        await this.getAppUi().input.clear();
        let forContent = await created.listA.findByText('#content');
        for (let resolved of await forContent.listA.getResolvedList()) {
            await this.getApp().uiA.content.listA.add(resolved);
        }
        await this.getApp().uiA.content.uis_update();
        forContent.listA.jsList = [];
        this.getAppUi().focus(this.getAppUi().contentUi.listA.uisOfListItems[0]);
        await this.getAppUi().input.ui.uiA.ensureCollapsed();
        window.scroll(0, 0);
    }
}