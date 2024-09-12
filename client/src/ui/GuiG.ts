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
    headerContent : HTMLElement;
    headerContent_fullWidth : boolean;
    bodyContent : HTMLElement;

    constructor(private entity : Entity) {
        this.appG = new GuiG_AppG(entity);
        this.listG = new GuiG_ListG(entity);
        entity.update();
    }

    async unsafeUpdate() {
        if (!this.entity.hidden) {
            if (this.entity.appA?.ui) {
                await this.appG.unsafeUpdate();
            } else {
                if (this.entity.list) {
                    await this.listG.unsafeUpdate();
                }
                this.headerContent_unsafeUpdate();
                await this.bodyContent_unsafeUpdate();
            }
        }
        await this.updateUiElement();
        this.entity.log('gui_updated');
    }

    headerContent_unsafeUpdate() {
        this.headerContent = document.createElement('div');
        this.headerContent_fullWidth = true;
        if (notNullUndefined(this.entity.test_result)) {
            let textElem = this.text_getUiElement();
            textElem.style.color = this.entity.test_result ? 'green' : 'red';
            this.headerContent.appendChild(textElem);
        } else if (this.entity.action) {
            this.headerContent.appendChild(this.action_getUiElement());
            this.headerContent_fullWidth = false;
        } else if (notNullUndefined(this.entity.link)) {
            let link = document.createElement('a');
            link.href = this.entity.link;
            link.innerText = this.link_getText();
            this.headerContent.appendChild(link);
        } else if (notNullUndefined(this.entity.text)) {
            this.headerContent.appendChild(this.text_getUiElement());
        } else {
            this.headerContent = null;
        }
    }

    async bodyContent_unsafeUpdate() {
        if (notNullUndefined(this.entity.test_result)) {
            this.bodyContent = document.createElement('div');
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
            this.bodyContent.appendChild(list.guiG.uiElement);
        } else if (this.entity.list && this.entity.list.jsList.length > 0 && this.entity.collapsed != true) {
            this.bodyContent = this.listG.uiElement;
        } else {
            this.bodyContent = null;
        }
    }

    private async updateUiElement() {
        this.uiElement.innerHTML = null;
        this.uiElement.style.all = 'revert';
        if (!this.entity.hidden) {
            if (this.entity.appA?.ui) {
                this.uiElement.appendChild(this.appG.uiElement);
            } else if (this.headerContent) {
                this.uiElement.appendChild(this.createHeader());
                if (this.bodyContent) {
                    this.uiElement.appendChild(this.createBody());
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

    private createHeader() {
        if (this.headerContent_fullWidth) {
            this.uiElement.style.minWidth = '100%';
        }
        let header = document.createElement('div');
        header.style.display = 'flex';
        header.style.flexWrap = 'wrap';
        header.appendChild(this.headerContent);
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
        return header;
    }

    private createBody() {
        let body = document.createElement('div');
        body.style.paddingLeft = '0.8rem';
        body.style.paddingTop = '0.2rem';
        body.style.paddingBottom = '0.2rem';
        body.appendChild(this.bodyContent);
        return body;
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
            this.entity.text = event.target.innerText.trim();
            this.text_updateEmptyMarker(uiElement);
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
        this.text_updateEmptyMarker(uiElement);
        uiElement.style.display = 'inline-block';
        uiElement.style.minWidth = '1rem';
        return uiElement;
    }

    private text_updateEmptyMarker(uiElement: HTMLDivElement) {
        if (this.entity.guiG.isEditable() && this.entity.text.length === 0) {
            uiElement.style.borderLeft = 'solid';
        }
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
                if (this.entity.test_result_error) {
                    rawText += this.entity.test_result_error;
                }
                if (this.entity.test_app) {
                    rawText += this.entity.test_app.appA.logG.listOfStrings.join('\n');
                    rawText += this.entity.test_app.guiG.getRawText();
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
}