import type {Entity} from "@/Entity";
import {notNullUndefined} from "@/utils";

export class UiG_BodyG {

    htmlElement : HTMLElement = document.createElement('div');
    content_htmlElement : HTMLElement;

    constructor(private entity: Entity) {
    }

    async unsafeUpdate() {
        this.htmlElement.innerHTML = null;
        if (!this.entity.collapsed && this.bodyAvailable()) {
            this.htmlElement.hidden = false;
            await this.content_unsafeUpdate();
            this.htmlElement.appendChild(this.content_htmlElement);
            this.htmlElement.style.paddingLeft = '0.8rem';
            this.htmlElement.style.paddingTop = '0.2rem';
            this.htmlElement.style.paddingBottom = '0.2rem';
        } else {
            this.htmlElement.hidden = true;
        }
    }

    async content_unsafeUpdate() {
        this.content_htmlElement = document.createElement('div');
        if (notNullUndefined(this.entity.test_result)) {
            let appA = this.entity.getApp().appA;
            let list = appA.simple_createList();
            if (this.entity.test_result_error) {
                await list.list.add(appA.simple_createText('failed with error: ' + this.entity.test_result_error));
            }
            if (this.entity.test_app) {
                await list.list.add(appA.simple_createCollapsible('log',
                    appA.simple_createText(this.entity.test_app.appA.logG.listOfStrings.join('\n'))));
                await list.list.add(appA.simple_createCollapsible('ui',
                    this.entity.test_app));
            }
            this.content_htmlElement.appendChild(list.uiG.htmlElement);
        } else if (this.entity.list && this.entity.list.jsList.length > 0) {
            this.content_htmlElement = this.entity.uiG.listG.htmlElement;
        }
    }

    bodyAvailable() : boolean {
        return notNullUndefined(this.entity.test_result) ||
            this.entity.list && this.entity.list.jsList.length > 0;
    }

    async expand() {
        await this.unsafeUpdate();
    }

    async collapse() {
        await this.unsafeUpdate();
    }
}