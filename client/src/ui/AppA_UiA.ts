import {Entity} from "@/Entity";
import {UiA} from "@/ui/UiA";
import {notNullUndefined, nullUndefined} from "@/utils";
import {Color} from "@/ui/Color";
import type {UiA_AppA} from "@/ui/UiA_AppA";

export class AppA_UiA {

    readonly content: Entity;
    clipboard: Entity;
    clipboard_lostContext: boolean;
    theme_fontColor : string = 'unset';
    theme_backgroundColor : string = 'white';
    theme_secondBackgroundColor: string = Color.LIGHT_GREY;
    theme_buttonFontColor: string = 'grey';
    theme_markColor: string = '#efefef';
    theme_secondMarkColor : string = 'green';
    theme_focusBorderColor: string = 'orange';
    theme_highlight: string = 'green';
    theme_success : string = 'green';
    theme_failure : string = 'red';
    theme_meta: string = 'blue';
    theme_font: string = 'unset';
    theme_fontSize: string = '1rem';
    webMeta: Entity;
    isWebsite: boolean;

    constructor(public entity: Entity) {
        this.content = entity.appA.unboundG.createList();
        this.content.container = entity;
    }

    createUiFor(object: Entity) : Entity {
        let ui : Entity = this.entity.getApp().appA.createEntityWithApp();
        ui.uiA = new UiA(ui);
        ui.uiA.object = object;
        object.uis_add(ui.uiA);
        return ui;
    }

    createUiFor_typed(object: Entity) : UiA {
        return this.createUiFor(object).uiA;
    }

    async createAppUi(withPlaceholderArea : boolean, editable? : boolean, withMeta? : boolean) : Promise<UiA_AppA> {
        let ui = this.createUiFor_typed(this.entity);
        ui.htmlElement.style.height = '100%';
        ui.installAppUi();
        ui.appA.withPlaceholderArea = withPlaceholderArea;
        ui.editable = editable;
        if (withMeta) {
            ui.appA.showMeta = true;
            ui.appA.commands = ui.appA.createCommands();
            ui.appA.commandsUi = this.createUiFor_typed(ui.appA.commands);
            ui.appA.commandsUi.context = ui;
        }
        await ui.appA.update();
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