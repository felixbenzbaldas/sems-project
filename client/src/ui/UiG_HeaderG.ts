import type {Entity} from "@/Entity";
import {notNullUndefined} from "@/utils";

export class UiG_HeaderG {
    uiElement: HTMLElement = document.createElement('div');
    content: HTMLElement = document.createElement('div');
    bodyIcon : HTMLElement = document.createElement('div');

    constructor(private entity: Entity) {
    }

    unsafeUpdate() {
        this.uiElement.innerHTML = null;
        this.updateContent();
        this.updateBodyIcon();
        if (this.content_fullWidth()) {
            this.entity.uiG.uiElement.style.minWidth = '100%';
        }
        this.uiElement.style.display = 'flex';
        this.uiElement.style.flexWrap = 'wrap';
        this.uiElement.appendChild(this.content);
        this.uiElement.appendChild(this.bodyIcon);
        this.uiElement.onclick = async (event) => {
            if (!event.ctrlKey) {
                await this.entity.expandOrCollapse();
            }
            if (notNullUndefined(this.entity.text)) {
                this.entity.uiG.textG.uiElement.focus();
            }
        };
    }

    updateBodyIcon() {
        this.bodyIcon.style.display = 'inline-block';
        this.bodyIcon.style.marginLeft = '0.7rem';
        if (this.entity.collapsible && this.entity.uiG.bodyG.bodyAvailable()) {
            this.bodyIcon.hidden = false;
            if (this.entity.collapsed) {
                this.bodyIcon.innerText = '[...]';
            } else {
                this.bodyIcon.innerText = ' _';
            }
        } else {
            this.bodyIcon.hidden = true;
        }
    }

    private updateContent() {
        this.content.innerHTML = null;
        if (notNullUndefined(this.entity.test_result)) {
            let textElem = this.entity.uiG.textG.uiElement;
            textElem.style.color = this.entity.test_result ? 'green' : 'red';
            this.content.appendChild(textElem);
        } else if (this.entity.action) {
            this.content.appendChild(this.action_getUiElement());
        } else if (notNullUndefined(this.entity.link)) {
            let link = document.createElement('a');
            link.href = this.entity.link;
            link.innerText = this.link_getText();
            this.content.appendChild(link);
        } else if (notNullUndefined(this.entity.text)) {
            this.content.appendChild(this.entity.uiG.textG.uiElement);
        }
    }

    private content_fullWidth() : boolean {
        return !this.entity.action;
    }

    action_getUiElement() {
        let button = document.createElement('button');
        button.innerText = this.entity.text;
        button.onclick = (event) => { this.entity.action(); };
        button.style.margin = '0.3rem 0.3rem 0.3rem 0rem';
        this.uiElement.style.display = 'inline';
        return button;
    }

    link_getText() {
        return notNullUndefined(this.entity.text) ? this.entity.text : this.entity.link;
    }

    headerAvailable(): boolean {
        return notNullUndefined(this.entity.test_result) ||
            notNullUndefined(this.entity.action) ||
            notNullUndefined(this.entity.link) ||
            notNullUndefined(this.entity.text);
    }
}