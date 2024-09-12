import type {Entity} from "@/Entity";
import {notNullUndefined} from "@/utils";

export class GuiG_HeaderG {
    uiElement: HTMLElement = document.createElement('div');
    content: HTMLElement = document.createElement('div');

    constructor(private entity: Entity) {
    }

    unsafeUpdate() {
        this.uiElement.innerHTML = null;
        this.updateContent();
        if (this.content_fullWidth()) {
            this.entity.guiG.uiElement.style.minWidth = '100%';
        }
        this.uiElement.style.display = 'flex';
        this.uiElement.style.flexWrap = 'wrap';
        this.uiElement.appendChild(this.content);
        if (this.entity.collapsed) {
            let icon = document.createElement('div');
            icon.innerText = '[...]';
            icon.style.display = 'inline-block';
            icon.style.marginLeft = '0.2rem';
            this.uiElement.appendChild(icon);
        }
        this.uiElement.onclick = async (event) => {
            if (!event.ctrlKey) {
                this.entity.expandOrCollapse();
            }
            if (notNullUndefined(this.entity.text)) {
                this.entity.guiG.textG.uiElement.focus();
            }
        };
    }

    private updateContent() {
        this.content.innerHTML = null;
        if (notNullUndefined(this.entity.test_result)) {
            let textElem = this.entity.guiG.textG.uiElement;
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
            this.content.appendChild(this.entity.guiG.textG.uiElement);
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