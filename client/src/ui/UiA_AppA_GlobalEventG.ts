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
        await this.getAppUi().output.setAndUpdateUi(JSON.stringify(await this.entity.getApp().entity.export(), null, 4));
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
        this.getAppUi().ensureContainer_AndUpdateStyle(this.getAppUi().focused.object);

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
        this.getAppUi().focused.object.containerA.bind(created);
        this.getApp().uiA.clipboard = created;
    }

    async importOldJson() {
        let created = await this.getApp().unboundG.createFromOldJson(JSON.parse(this.getAppUi().input.get()));
        this.getAppUi().focused.object.containerA.bind(created);
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
        await this.getAppUi().focused.scaleUp();
    }

    async scaleDown() {
        await this.getAppUi().focused.scaleDown();
    }

    async deepCopy() {
        let focusedObject = this.getAppUi().focused.object;
        if (focusedObject.containerA) {
            let app_uiA = this.entity.getApp().uiA;
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
        await this.getAppUi().focused.object.script_setContextForAllObjectsInContainer();
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
        return this.entity.getApp();
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
        let exportedProfile = await this.getApp().profileG.exportProfile();
        await this.getAppUi().output.setAndUpdateUi(JSON.stringify(exportedProfile, null, 4));
        this.getAppUi().signal('Download the export from the output!');
    }

    async importProfile() {
        await this.getApp().profileG.importProfile(JSON.parse(this.getAppUi().input.get()));
        let profile = this.getApp().profileG.getProfile();
        this.getAppUi().focus(this.getAppUi().mainColumnUi);
        await this.getAppUi().input.clear();
        await this.getAppUi().input.ui.uiA.ensureCollapsed();
        if (await profile.has(this.getApp().profileG.rootString)) {
            let root = await profile.get(this.getApp().profileG.rootString);
            await this.entity.uiA.appA.supportColumn_freeSpace.listA.add(root);
            await this.entity.uiA.appA.supportColumn_freeSpace.uis_update();
        }
    }

    async toggleColumn() {
        if (this.getAppUi().focused.getColumn() === this.getAppUi().mainColumnUi) {
            this.getAppUi().supportColumnUi.columnA_takeFocus();
        } else {
            this.getAppUi().mainColumnUi.columnA_takeFocus();
        }
    }

    async exportRawText() {
        let rawText = await this.getAppUi().focused.textG.getRawText(0);
        await this.getAppUi().output.setAndUpdateUi(rawText);
    }

    async transformToProperty() {
        await this.getAppUi().focused.transformToProperty();
    }

    async transformToPlainList() {
        await this.getAppUi().focused.transformToPlainList();
    }
}