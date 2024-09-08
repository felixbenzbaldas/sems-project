import type {Entity} from "@/Entity";
import {notNullUndefined} from "@/utils";
import {GuiG_AppG} from "@/ui/GuiG_AppG";
import {GuiG_ListG} from "@/ui/GuiG_ListG";

// TODO: should be an aspect (suffix 'A'), not a group (suffix 'G')
export class GuiG {

    editable: boolean;
    uiElement : HTMLDivElement = document.createElement('div');
    appG: GuiG_AppG;
    listG: GuiG_ListG;

    constructor(private entity : Entity) {
        this.appG = new GuiG_AppG(entity);
        this.listG = new GuiG_ListG(entity);
        entity.update();
    }

    async unsafeUpdate() {
        if (!this.entity.hidden) {
            if (this.entity.appA?.ui) {
                await this.appG.unsafeUpdate();
            } else if (this.entity.list) {
                await this.listG.unsafeUpdate();
            }
        }
        await this.updateUiElement();
        this.entity.log('gui_updated');
    }

    private async updateUiElement() {
        this.uiElement.innerHTML = null;
        this.uiElement.style.all = 'revert';
        if (!this.entity.hidden) {
            if (this.entity.appA?.ui) {
                this.uiElement.appendChild(this.appG.uiElement);
            } else if (this.entity.action) {
                this.uiElement.appendChild(this.action_getUiElement());
            } else if (notNullUndefined(this.entity.link)) {
                let link = document.createElement('a');
                link.href = this.entity.link;
                link.innerText = this.link_getText();
                this.uiElement.appendChild(link);
            } else if (notNullUndefined(this.entity.text)) {
                this.uiElement.style.minWidth = '100%';
                let header = document.createElement('div');
                this.uiElement.appendChild(header);
                header.style.minWidth = '100%';
                header.style.display = 'flex';
                header.style.flexWrap = 'wrap';
                header.appendChild(this.text_getUiElement());
                if (this.entity.collapsed) {
                    let icon = document.createElement('div');
                    icon.innerText = '[...]';
                    icon.style.display = 'inline-block';
                    icon.style.marginLeft = '0.2rem';
                    header.appendChild(icon);
                }
                header.onclick = (event) => {
                    if (!event.ctrlKey) {
                        this.entity.toggleCollapsed();
                    }
                };
                if (this.entity.list && this.entity.list.jsList.length > 0 && this.entity.collapsed != true) {
                    let listWrapper = document.createElement('div');
                    listWrapper.style.marginLeft = '0.8rem';
                    listWrapper.style.marginTop = '0.2rem';
                    listWrapper.style.marginBottom = '0.2rem';
                    listWrapper.appendChild(this.listG.uiElement);
                    this.uiElement.appendChild(listWrapper);
                }
            } else if (this.entity.list && this.entity.collapsed != true) {
                this.uiElement.appendChild(this.listG.uiElement);
            } else {
                let div = document.createElement('div');
                div.innerText = this.entity.getDescription();
                return div;
            }
        }
    }

    link_getText() {
        return notNullUndefined(this.entity.text) ? this.entity.text : this.entity.link;
    }

    text_getUiElement() {
        let uiElement = document.createElement('div');
        uiElement.innerText = this.entity.text;
        uiElement.style.minHeight = '1rem';
        uiElement.style.whiteSpace = 'pre-wrap';
        uiElement.style.outline = "0px solid transparent"; // prevent JS focus
        uiElement.onblur = (event : any) => {
            this.entity.setText(event.target.innerText.trim())
        }
        uiElement.onfocus = () => {
            this.entity.getApp().appA.ui.focus(this.entity);
            uiElement.style.borderLeft = 'none';
        };
        uiElement.onclick = (event) => {
            if (this.isEditable()) {
                event.stopPropagation();
            }
        }
        uiElement.contentEditable = (this.isEditable()) ? 'true' : 'false';
        if (this.entity.guiG.isEditable() && this.entity.text.length === 0) {
            uiElement.style.borderLeft = 'solid';
        }
        uiElement.style.display = 'inline-block';
        uiElement.style.minWidth = '1rem';
        return uiElement;
    }

    action_getUiElement() {
        let button = document.createElement('button');
        button.innerText = this.entity.text;
        button.onclick = (event) => { this.entity.action(); };
        button.style.margin = '0.3rem 0.3rem 0.3rem 0rem';
        this.uiElement.style.display = 'inline';
        return button;
    }

    isEditable() {
        if (notNullUndefined(this.editable)) {
            if (notNullUndefined(this.entity.editable)) {
                if (this.editable == true) {
                    return this.entity.editable;
                } else {
                    return false;
                }
            } else {
                return this.editable;
            }
        } else {
            if (notNullUndefined(this.entity.editable)) {
                return this.entity.editable;
            } else {
                return false;
            }
        }
    }

    getRawText() : string {
        if (!this.entity.hidden) {
            if (this.entity.appA?.ui) {
                return this.appG.getRawText();
            } else if (notNullUndefined(this.entity.link)) {
                return this.link_getText();
            } else {
                let rawText = '';
                if (notNullUndefined(this.entity.text)) {
                    rawText += this.entity.text;
                }
                if (this.entity.list && this.entity.collapsed != true) {
                    rawText += this.listG.getRawText();
                }
                return rawText;
            }
        }
        return '';
    }

    async click(text : string) {
        this.entity.log('click ' + text);
        if (!this.entity.hidden) {
            if (this.entity.appA?.ui) {
                await this.appG.click(text);
            } else if (this.entity.action) {
                if (this.entity.text.includes(text)) {
                    await this.entity.action();
                }
            } else if (notNullUndefined(this.entity.text)) {
                if (this.entity.text.includes(text)) {
                    await this.entity.getApp().appA.ui.focus(this.entity);
                    if (!this.isEditable() && this.entity.collapsible) {
                        await this.entity.toggleCollapsed();
                    }
                }
                if (this.entity.list) {
                    await this.listG.click(text);
                }
            } else if (this.entity.list) {
                await this.listG.click(text);
            }
        }
    }

    countEditableTexts() : number {
        this.entity.log('countEditableTexts');
        if (!this.entity.hidden) {
            if (this.entity.appA?.ui) {
                return this.appG.countEditableTexts();
            } else {
                let counter = 0;
                if (notNullUndefined(this.entity.text)) {
                    if (this.entity.guiG.isEditable()) {
                        counter++;
                    }
                }
                if (this.entity.list) {
                    counter += this.listG.countEditableTexts();
                }
                return counter;
            }
        }
        return 0;
    }

    async getUpdatedUiElement() : Promise<HTMLElement> {
        await this.unsafeUpdate();
        return this.uiElement;
    }

}