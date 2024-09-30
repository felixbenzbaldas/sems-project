import type {Entity} from "@/Entity";
import {notNullUndefined} from "@/utils";

export class UiG_HeaderG {
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
            this.entity.uiG.htmlElement.style.minWidth = '100%';
        }
        this.htmlElement.style.display = 'flex';
        this.htmlElement.style.flexWrap = 'wrap';
        this.htmlElement.appendChild(this.content);
        this.htmlElement.appendChild(this.bodyIcon);
        this.htmlElement.onclick = async (event) => {
            if (!event.ctrlKey) {
                await this.entity.expandOrCollapse();
            }
            if (notNullUndefined(this.entity.text)) {
                this.entity.uiG.textG.htmlElement.focus();
            }
        };
        this.htmlElement.style.border = 'solid';
        this.focusStyle_update();
        this.updateCursorStyle();
    }

    updateBodyIcon() {
        this.bodyIcon.style.display = 'inline-block';
        this.bodyIcon.style.marginLeft = '0.7rem';
        if (this.entity.collapsible && this.entity.uiG.bodyG.bodyAvailable()) {
            this.bodyIcon.style.display = 'default';
            if (this.entity.collapsed) {
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
        if (this.entity.isTest) {
            this.content.appendChild(this.entity.uiG.testG.headerContent_htmlElement);
        } else if (this.entity.action) {
            this.content.appendChild(this.action_getUiElement());
        } else if (notNullUndefined(this.entity.link)) {
            let link = document.createElement('a');
            link.href = this.entity.link;
            link.innerText = this.link_getText();
            this.content.appendChild(link);
        } else if (notNullUndefined(this.entity.text)) {
            this.content.appendChild(this.entity.uiG.textG.htmlElement);
        }
    }

    private content_fullWidth() : boolean {
        if (this.entity.isTest) {
            return true;
        } else {
            return !this.entity.action;
        }
    }

    action_getUiElement() {
        let button = document.createElement('button');
        button.innerText = this.entity.text;
        button.onclick = (event) => { this.entity.action(); };
        button.style.margin = '0.3rem 0.3rem 0.3rem 0rem';
        button.style.fontSize = '0.9rem';
        this.htmlElement.style.display = 'inline';
        return button;
    }

    link_getText() {
        return notNullUndefined(this.entity.text) ? this.entity.text : this.entity.link;
    }

    headerAvailable(): boolean {
        return notNullUndefined(this.entity.isTest) ||
            notNullUndefined(this.entity.action) ||
            notNullUndefined(this.entity.link) ||
            notNullUndefined(this.entity.text);
    }

    private updateCursorStyle() {
        if (this.entity.collapsible && this.entity.uiG.bodyG.bodyAvailable()) {
            this.htmlElement.style.cursor = 'pointer';
        } else {
            this.htmlElement.style.cursor = 'default';
        }
    }

    focusStyle_update() {
        if (this.entity.ui_hasFocus()) {
            this.htmlElement.style.borderColor = 'orange';
        } else {
            this.htmlElement.style.borderColor = 'white';
        }
    }
}