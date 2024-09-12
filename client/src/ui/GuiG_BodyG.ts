import type {Entity} from "@/Entity";
import {notNullUndefined} from "@/utils";

export class GuiG_BodyG {

    uiElement : HTMLElement = document.createElement('div');
    content_uiElement : HTMLElement;

    constructor(private entity: Entity) {
    }

    async unsafeUpdate() {
        if (this.bodyAvailable()) {
            this.uiElement.hidden = false;
            this.uiElement.innerHTML = null;
            await this.content_unsafeUpdate();
            this.uiElement.appendChild(this.content_uiElement);
            this.uiElement.style.paddingLeft = '0.8rem';
            this.uiElement.style.paddingTop = '0.2rem';
            this.uiElement.style.paddingBottom = '0.2rem';
        } else {
            this.uiElement.hidden = true;
        }
    }

    async content_unsafeUpdate() {
        this.content_uiElement = document.createElement('div');
        if (notNullUndefined(this.entity.test_result)) {
            let appA = this.entity.getApp().appA;
            let list = appA.simple_createList();
            if (this.entity.test_result_error) {
                await list.list.add(appA.simple_createText('failed with error: ' + this.entity.test_result_error));
            }
            if (this.entity.test_app) {
                await list.list.add(appA.simple_createCollapsible('log',
                    appA.simple_createText(this.entity.test_app.appA.logG.listOfStrings.join('\n'))));
                await list.list.add(appA.simple_createCollapsible('gui',
                    this.entity.test_app));
            }
            this.content_uiElement.appendChild(list.guiG.uiElement);
        } else if (this.entity.list && this.entity.list.jsList.length > 0 && this.entity.collapsed != true) {
            this.content_uiElement = this.entity.guiG.listG.uiElement;
        }
    }

    bodyAvailable() : boolean {
        if (notNullUndefined(this.entity.test_result)) {
            return true;
        } else if (this.entity.list && this.entity.list.jsList.length > 0 && this.entity.collapsed != true) {
            return true;
        }
        return false;
    }
}