import type {Entity} from "@/Entity";
import {notNullUndefined} from "@/utils";
import {UiA_ListG} from "@/ui/UiA_ListG";
import {UiA_TextG} from "@/ui/UiA_TextG";
import {UiA_BodyG} from "@/ui/UiA_BodyG";
import {UiA_HeaderG} from "@/ui/UiA_HeaderG";
import {UiA_TestG} from "@/ui/UiA_TestG";

export class UiA {

    editable: boolean;
    htmlElement : HTMLElement = document.createElement('div');
    listG: UiA_ListG;
    textG : UiA_TextG;
    headerG : UiA_HeaderG;
    bodyG: UiA_BodyG;
    testG: UiA_TestG;
    object: Entity;

    constructor(private entity : Entity) {
        this.listG = new UiA_ListG(entity);
        this.textG = new UiA_TextG(entity);
        this.headerG = new UiA_HeaderG(entity);
        this.bodyG = new UiA_BodyG(entity);
        this.testG = new UiA_TestG(entity);
    }

    async update() {
        if (!this.entity.hidden && !this.entity.dangerous_html) {
            if (this.entity.appA?.uiA) {
                await this.entity.appA.uiA.update();
            } else {
                if (this.entity.isTest) {
                    await this.testG.update();
                }
                if (this.entity.list) {
                    await this.listG.update();
                }
                if (notNullUndefined(this.entity.text)) {
                    this.textG.update();
                }
                this.headerG.update();
                await this.bodyG.update();
            }
        }
        await this.updateUiElement();
        this.entity.log('ui_updated');
    }

    private async updateUiElement() {
        this.htmlElement.innerHTML = null;
        if (!this.entity.hidden) {
            if (this.entity.appA?.uiA) {
                this.htmlElement.appendChild(this.entity.appA.uiA.htmlElement);
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
            if (this.entity.appA?.uiA) {
                return this.entity.appA.uiA.getRawText();
            } else if (notNullUndefined(this.entity.link)) {
                return this.headerG.link_getText();
            } else {
                if (this.entity.isTest) {
                    return this.entity.uiA.testG.getRawText();
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
        }
        return '';
    }

    async click(text : string) {
        this.entity.log('click ' + text);
        if (!this.entity.hidden) {
            if (this.entity.appA?.uiA) {
                await this.entity.appA.uiA.click(text);
            } else if (this.entity.isTest) {
                await this.entity.uiA.testG.click(text);
            } else if (this.entity.action) {
                if (this.entity.text.includes(text)) {
                    await this.entity.action();
                }
            } else if (notNullUndefined(this.entity.text)) {
                if (this.entity.text.includes(text)) {
                    if (this.isEditable()) {
                        this.entity.getApp().appA.uiA.focus(this.entity);
                    } else {
                        await this.headerG.clickEvent();
                    }
                }
                if (!this.entity.collapsed && this.entity.uiA.bodyG.bodyAvailable()) {
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
            if (this.entity.appA?.uiA) {
                return this.entity.appA.uiA.countEditableTexts();
            } else {
                let counter = 0;
                if (notNullUndefined(this.entity.text)) {
                    if (this.entity.uiA.isEditable()) {
                        counter++;
                    }
                }
                if (this.entity.list && !this.entity.collapsed) {
                    counter += this.listG.countEditableTexts();
                }
                return counter;
            }
        }
        return 0;
    }

    updateFocusStyle() {
        if (this.entity.appA?.uiA) {
            this.entity.appA.uiA.focusStyle_update();
        } else {
            this.entity.uiA.headerG.focusStyle_update();
        }
    }

    takeCaret() {
        if (!this.entity.appA) {
            if (notNullUndefined(this.entity.text)) {
                this.textG.takeCaret();
            }
        }
    }
}