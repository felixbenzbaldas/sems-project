import {Entity} from "@/Entity";
import {UiA} from "@/ui/UiA";
import {notNullUndefined} from "@/utils";
import {UiA_AppA} from "@/ui/UiA_AppA";
import {Theme} from "@/ui/Theme";

export class AppA_UiA {

    readonly content: Entity;
    clipboard: Entity;
    clipboard_lostContext: boolean;
    theme : Theme = Theme.default();
    webMeta: Entity;
    isWebsite: boolean;

    constructor(public entity: Entity) {
        this.content = entity.appA.unboundG.createList();
        this.content.container = entity;
    }

    prepareUiFor(object: Entity) : UiA {
        let ui : Entity = this.entity.getApp().appA.createEntityWithApp();
        ui.uiA = new UiA(ui);
        ui.uiA.object = object;
        object.uis_add(ui.uiA);
        return ui.uiA;
    }

    async createAppUi(withPlaceholderArea : boolean, editable? : boolean, withMeta? : boolean) : Promise<UiA_AppA> {
        let ui = this.prepareUiFor(this.entity);
        ui.htmlElement.style.height = '100%';
        ui.editable = editable;
        ui.appA = new UiA_AppA(ui.entity);
        await ui.appA.install(withMeta, withPlaceholderArea);
        ui.htmlElement.appendChild(ui.appA.htmlElement);
        return ui.appA;
    }

    async insertClipboardAtPosition(object: Entity, position: number) {
        await object.listA.insertObjectAtPosition(this.clipboard, position);
        if (this.clipboard_lostContext) {
            if (notNullUndefined(object.text)) {
                this.clipboard.context = this.clipboard.getPath(object);
                this.clipboard_lostContext = false;
            }
        }
        await object.uis_update_addedListItem(position);
    }
}