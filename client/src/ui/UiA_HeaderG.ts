import type {Entity} from "@/Entity";
import {notNullUndefined} from "@/utils";
import type {UiA} from "@/ui/UiA";

export class UiA_HeaderG {

    htmlElement: HTMLElement = document.createElement('div');
    content: HTMLElement = document.createElement('div');
    bodyIcon : HTMLElement = document.createElement('div');

    constructor(private entity: Entity) {
    }

    update() {
        this.htmlElement.innerHTML = null;
        this.updateContent();
        this.updateBodyIcon();
        if (this.content_fullWidth()) {
            this.getUiA().htmlElement.style.minWidth = '100%';
        }
        this.htmlElement.style.display = 'flex';
        this.htmlElement.style.flexWrap = 'wrap';
        this.htmlElement.appendChild(this.content);
        this.htmlElement.appendChild(this.bodyIcon);
        this.htmlElement.onclick = async (event) => {
            this.entity.getApp().appA.ensureActive();
            if (!event.ctrlKey) {
                await this.clickEvent();
            }
        };
        this.htmlElement.style.border = 'solid';
        this.htmlElement.style.borderWidth = '0.1rem';
        this.focusStyle_update();
        this.updateCursorStyle();
        this.updateCurrentContainerStyle();
    }

    updateBodyIcon() {
        this.bodyIcon.style.display = 'inline-block';
        this.bodyIcon.style.marginLeft = '0.7rem';
        if (this.getObject().collapsible && this.getUiA().bodyG.bodyAvailable()) {
            this.bodyIcon.style.display = 'default';
            if (this.entity.uiA.collapsed) {
                this.bodyIcon.innerText = '[...]';
            } else {
                this.bodyIcon.innerText = ' _';
            }
        } else {
            this.bodyIcon.style.display = 'none';
        }
    }

    private updateContent() {
        this.content.innerHTML = null;
        if (this.getObject().isTest) {
            this.content.appendChild(this.getUiA().testG.headerContent_htmlElement);
        } else if (this.getObject().action) {
            this.content.appendChild(this.action_getUiElement());
        } else if (notNullUndefined(this.getObject().link)) {
            let link = document.createElement('a');
            link.href = this.getObject().link;
            link.innerText = this.link_getText();
            this.content.appendChild(link);
        } else if (notNullUndefined(this.getObject().text)) {
            this.entity.uiA.textG.update();
            this.content.appendChild(this.getUiA().textG.htmlElement);
        } else if (notNullUndefined(this.getObject().testRunA)) {
            let result = this.getObject().testRunA.resultG_success ? 'S' : 'F';
            this.content.innerText = result + ' ' + this.testRun_getPathString();
            this.content.style.color = this.getObject().testRunA.resultG_success ? 'green' : 'red';
        }
    }

    private content_fullWidth() : boolean {
        if (this.getObject().isTest) {
            return true;
        } else {
            return !this.getObject().action;
        }
    }

    testRun_getPathString() : string {
        return this.entity.getApp().getPath(this.getObject().testRunA.test).pathA.listOfNames.join('_');
    }

    action_getUiElement() {
        let button = document.createElement('button');
        button.innerText = this.getObject().text;
        button.onclick = (event) => {
            this.entity.getApp().appA.ensureActive();
            this.getObject().action();
            event.stopPropagation();
        };
        button.style.margin = '0.3rem 0.3rem 0.3rem 0rem';
        button.style.fontSize = '0.9rem';
        this.htmlElement.style.display = 'inline';
        return button;
    }

    link_getText() {
        return notNullUndefined(this.getObject().text) ? this.getObject().text : this.getObject().link;
    }

    private updateCursorStyle() {
        if (this.getObject().collapsible && this.getUiA().bodyG.bodyAvailable()) {
            this.htmlElement.style.cursor = 'pointer';
        } else {
            this.htmlElement.style.cursor = 'default';
        }
    }

    focusStyle_update() {
        if (this.entity.uiA.hasFocus() && this.entity.getApp().appA.uiA.isActive()) {
            this.htmlElement.style.borderColor = 'orange';
        } else {
            this.htmlElement.style.borderColor = 'white';
        }
    }

    updateCurrentContainerStyle() {
        if (this.entity.getApp().appA.currentContainer === this.getObject()) {
            this.htmlElement.style.backgroundColor = '#efefef';
        } else {
            this.htmlElement.style.backgroundColor = 'white';
        }
    }

    async clickEvent() {
        await this.entity.uiA.expandOrCollapse();
        this.entity.getApp().appA.uiA.focus(this.entity);
    }

    getUiA() : UiA {
        return this.entity.uiA;
    }

    getObject() : Entity {
        if (this.getUiA().object) {
            return this.getUiA().object;
        } else {
            return this.entity;
        }
    }
}