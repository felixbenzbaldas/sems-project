import type {Entity} from "@/Entity";
import {notNullUndefined, setWidth} from "@/utils";
import type {UiA} from "@/ui/UiA";

export class UiA_HeaderG {

    htmlElement: HTMLElement = document.createElement('div');
    divForContentAndBodyIcon : HTMLElement = document.createElement('div');
    content: HTMLElement = document.createElement('div');
    bodyIcon : HTMLElement = document.createElement('div');
    contextIcon : HTMLElement = document.createElement('div');


    constructor(private entity: Entity) {
    }

    async update() {
        this.htmlElement.innerHTML = null;
        this.divForContentAndBodyIcon.innerHTML = null;
        await this.updateContextIcon();
        await this.updateContent();
        await this.updateBodyIcon();
        if (this.ownRow()) {
            this.getUiA().htmlElement.style.minWidth = '100%';
        }
        this.htmlElement.style.maxWidth = '42rem';
        this.htmlElement.style.display = 'flex';
        this.divForContentAndBodyIcon.style.flexGrow = '2';
        this.divForContentAndBodyIcon.style.display = 'flex';
        this.divForContentAndBodyIcon.style.flexWrap = 'wrap';
        // this.divForContentAndBodyIcon.style.padding = '0.05rem';
        this.htmlElement.appendChild(this.contextIcon);
        if (this.getUiA().showContainerMark()) {
            this.htmlElement.appendChild(this.createContainerMark());
        }
        this.htmlElement.appendChild(this.divForContentAndBodyIcon);
        this.divForContentAndBodyIcon.appendChild(this.content);
        this.divForContentAndBodyIcon.appendChild(this.bodyIcon);
        this.htmlElement.onclick = async (event) => {
            this.getUiA().findAppUi().ensureActive();
            if (!event.ctrlKey) {
                await this.clickEvent();
            }
        };
        this.htmlElement.oncontextmenu = async (event) => {
            if (!this.getObject().link) {
                await this.getUiA().showMeta();
                event.preventDefault();
            }
        }
        this.divForContentAndBodyIcon.style.border = 'solid';
        this.divForContentAndBodyIcon.style.borderWidth = '0.1rem';
        this.focusStyle_update();
        await this.updateCursorStyle();
        this.updateCurrentContainerStyle();
    }

    async updateContextIcon() {
        this.contextIcon.style.display = 'block';
        setWidth(this.contextIcon, '0.4rem');
        if (this.getUiA().objectHasContext()) {
            if (await this.getUiA().inContext()) {
                this.contextIcon.innerText = '-';
            } else {
                this.contextIcon.innerText = '/';
            }
        } else {
            this.contextIcon.innerText = '';
        }
    }

    createContainerMark() {
        let containerMark = document.createElement('div');
        containerMark.style.display = 'block';
        setWidth(containerMark, '0.8rem');
        containerMark.innerText = 'O'
        containerMark.style.color = this.entity.getApp_typed().uiA.theme_secondMarkColor;
        return containerMark;
    }

    async updateContent() {
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
            await this.entity.uiA.textG.update();
            this.content.appendChild(this.getUiA().textG.htmlElement);
        } else if (notNullUndefined(this.getObject().testRunA)) {
            this.content.appendChild(this.getUiA().testRunG.headerContent_htmlElement);
        }
    }

    async updateBodyIcon() {
        this.bodyIcon.style.display = 'inline-block';
        if (this.getObject().collapsible && await this.getUiA().headerBodyG.hasBodyContent()) {
            this.bodyIcon.style.display = 'default';
            this.bodyIcon.style.width = '1.5rem';
            this.bodyIcon.style.textAlign = 'center';
            this.bodyIcon.style.marginLeft = '0.7rem';
            if (this.entity.uiA.isCollapsed()) {
                this.bodyIcon.innerText = '[...]';
            } else {
                this.bodyIcon.innerText = '_';
            }
        } else {
            this.bodyIcon.style.display = 'none';
        }
    }

    ownRow() : boolean {
        if (this.getObject().isTest) {
            return true;
        } else {
            return !this.getObject().action;
        }
    }
    
    action_getUiElement() {
        let button = document.createElement('button');
        button.innerText = this.getObject().text;
        button.onclick = (event) => {
            this.getUiA().findAppUi().ensureActive();
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

    async updateCursorStyle() {
        if (this.getObject().collapsible && await this.getUiA().headerBodyG.hasBodyContent()) {
            this.divForContentAndBodyIcon.style.cursor = 'pointer';
        } else {
            this.divForContentAndBodyIcon.style.cursor = 'default';
        }
    }

    focusStyle_update() {
        if (this.entity.uiA.hasFocus() && this.getUiA().findAppUi().isActive()) {
            this.divForContentAndBodyIcon.style.borderColor = this.entity.getApp_typed().uiA.theme_focusBorderColor;
        } else {
            this.divForContentAndBodyIcon.style.borderColor = this.entity.getApp_typed().uiA.theme_backgroundColor;
        }
    }

    updateCurrentContainerStyle() {
        if (this.entity.getApp().appA.currentContainer === this.getObject()) {
            this.divForContentAndBodyIcon.style.backgroundColor = this.entity.getApp_typed().uiA.theme_markColor;
        } else {
            this.divForContentAndBodyIcon.style.backgroundColor = this.entity.getApp_typed().uiA.theme_backgroundColor;
        }
    }

    async clickEvent() {
        await this.entity.uiA.expandOrCollapse();
        this.getUiA().findAppUi().focus(this.entity);
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

    getRawText() : string {
        if (this.getObject().isTest) {
            return this.getUiA().testG.header_getRawText();
        } else if (notNullUndefined(this.getObject().link)) {
            return this.link_getText();
        } else if (notNullUndefined(this.getObject().text)) {
            return this.getObject().text;
        } else if (notNullUndefined(this.getObject().testRunA)) {
            return this.getUiA().testRunG.header_getText();
        }
    }
}