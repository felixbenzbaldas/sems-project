import type {Entity} from "@/Entity";
import {notNullUndefined} from "@/utils";
import {GuiG_AppG} from "@/ui/GuiG_AppG";
import {UiG_ListG} from "@/ui/UiG_ListG";
import {UiG_TextG} from "@/ui/UiG_TextG";
import {UiG_BodyG} from "@/ui/UiG_BodyG";
import {UiG_HeaderG} from "@/ui/UiG_HeaderG";

// TODO: should be an aspect (suffix 'A'), not a group (suffix 'G')
export class UiG {

    editable: boolean;
    htmlElement : HTMLElement = document.createElement('div');
    appG: GuiG_AppG;
    listG: UiG_ListG;
    textG : UiG_TextG;
    headerG : UiG_HeaderG;
    bodyG: UiG_BodyG;

    constructor(private entity : Entity) {
        this.appG = new GuiG_AppG(entity);
        this.listG = new UiG_ListG(entity);
        this.textG = new UiG_TextG(entity);
        this.headerG = new UiG_HeaderG(entity);
        this.bodyG = new UiG_BodyG(entity);
    }

    async unsafeUpdate() {
        if (!this.entity.hidden && !this.entity.dangerous_html) {
            if (this.entity.appA?.ui) {
                await this.appG.unsafeUpdate();
            } else {
                if (this.entity.list) {
                    await this.listG.unsafeUpdate();
                }
                if (notNullUndefined(this.entity.text)) {
                    this.textG.unsafeUpdate();
                }
                this.headerG.unsafeUpdate();
                await this.bodyG.unsafeUpdate();
            }
        }
        await this.updateUiElement();
        this.entity.log('gui_updated');
    }

    private async updateUiElement() {
        this.htmlElement.innerHTML = null;
        if (!this.entity.hidden) {
            if (this.entity.appA?.ui) {
                this.htmlElement.appendChild(this.appG.htmlElement);
            } else if (this.headerG.headerAvailable()) {
                this.htmlElement.appendChild(this.headerG.htmlElement);
                this.htmlElement.appendChild(this.bodyG.htmlElement);
            } else if (this.entity.list && this.entity.collapsed != true) {
                this.htmlElement.appendChild(this.listG.htmlElement);
            } else if (this.entity.dangerous_html) {
                this.htmlElement.appendChild(this.entity.dangerous_html);
            } else {
                let div = document.createElement('div');
                div.innerText = this.entity.getDescription();
                this.htmlElement.appendChild(div);
            }
        }
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
        this.entity.log('getRawText');
        if (!this.entity.hidden) {
            if (this.entity.appA?.ui) {
                return this.appG.getRawText();
            } else if (notNullUndefined(this.entity.link)) {
                return this.headerG.link_getText();
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
                    rawText += this.entity.test_app.uiG.getRawText();
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
                        await this.entity.expandOrCollapse();
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
                    if (this.entity.uiG.isEditable()) {
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