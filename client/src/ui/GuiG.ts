import type {Entity} from "@/Entity";
import {notNullUndefined} from "@/utils";
import {GuiG_AppG} from "@/ui/GuiG_AppG";
import {GuiG_ListG} from "@/ui/GuiG_ListG";
import {GuiG_TextG} from "@/ui/GuiG_TextG";
import {GuiG_BodyG} from "@/ui/GuiG_BodyG";
import {GuiG_HeaderG} from "@/ui/GuiG_HeaderG";

// TODO: should be an aspect (suffix 'A'), not a group (suffix 'G')
export class GuiG {

    editable: boolean;
    uiElement : HTMLDivElement = document.createElement('div');
    appG: GuiG_AppG;
    listG: GuiG_ListG;
    textG : GuiG_TextG;
    headerG : GuiG_HeaderG;
    bodyG: GuiG_BodyG;

    constructor(private entity : Entity) {
        this.appG = new GuiG_AppG(entity);
        this.listG = new GuiG_ListG(entity);
        this.textG = new GuiG_TextG(entity);
        this.headerG = new GuiG_HeaderG(entity);
        this.bodyG = new GuiG_BodyG(entity);
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
        this.uiElement.innerHTML = null;
        if (!this.entity.hidden) {
            if (this.entity.appA?.ui) {
                this.uiElement.appendChild(this.appG.uiElement);
            } else if (this.headerG.headerAvailable()) {
                this.uiElement.appendChild(this.headerG.uiElement);
                this.uiElement.appendChild(this.bodyG.uiElement);
            } else if (this.entity.list && this.entity.collapsed != true) {
                this.uiElement.appendChild(this.listG.uiElement);
            } else if (this.entity.dangerous_html) {
                this.uiElement.appendChild(this.entity.dangerous_html);
            } else {
                let div = document.createElement('div');
                div.innerText = this.entity.getDescription();
                this.uiElement.appendChild(div);
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