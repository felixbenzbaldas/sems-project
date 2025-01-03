import type {Entity} from "@/Entity";
import type {UiA} from "@/ui/UiA";
import {AnimatedExpandAndCollapse} from "@/ui/AnimatedExpandAndCollapse";

// TODO the body aspect should only exist if showBody === true
export class UiA_BodyG {

    htmlElement : HTMLElement = document.createElement('div');
    content_htmlElement : HTMLElement;
    content_contextAsSubitem_htmlElement : HTMLElement = document.createElement('div');
    content_meta_htmlElement : HTMLElement = document.createElement('div');
    animatedExpandAndCollapse : AnimatedExpandAndCollapse = new AnimatedExpandAndCollapse();

    constructor(private entity: Entity) {
        this.htmlElement.style.display = 'none';
    }

    async expandWithAnimation() {
        this.htmlElement.innerHTML = null;
        this.htmlElement.style.display = 'block';
        await this.content_update();
        this.animatedExpandAndCollapse = new AnimatedExpandAndCollapse();
        this.htmlElement.appendChild(this.animatedExpandAndCollapse.outerDiv);
        this.animatedExpandAndCollapse.innerDiv.innerHTML = null;
        this.animatedExpandAndCollapse.innerDiv.appendChild(this.content_htmlElement);
        this.animatedExpandAndCollapse.innerDiv.style.paddingLeft = '0.8rem';
        this.animatedExpandAndCollapse.innerDiv.style.paddingTop = '0.2rem';
        this.animatedExpandAndCollapse.innerDiv.style.paddingBottom = '0.2rem';
        await this.animatedExpandAndCollapse.expand();
    }

    async collapseWithAnimation() {
        await this.animatedExpandAndCollapse.collapse().then(() => {
            this.htmlElement.innerHTML = null;
            this.htmlElement.style.display = 'none';
        });
    }

    async update() {
        if (!this.getObject().collapsible && await this.getUiA().headerBodyG.hasBodyContent()) {
            this.htmlElement.innerHTML = null;
            await this.displayBody();
        } else {
            await this.ensureCollapsed();
        }
    }

    async ensureCollapsed() {
        this.htmlElement.innerHTML = null;
        this.htmlElement.style.display = 'none';
    }

    async displayBody() {
        this.htmlElement.style.display = 'block';
        await this.content_update();
        this.htmlElement.appendChild(this.animatedExpandAndCollapse.outerDiv);
        this.animatedExpandAndCollapse.innerDiv.appendChild(this.content_htmlElement);
        this.animatedExpandAndCollapse.innerDiv.style.paddingLeft = '0.8rem';
        this.animatedExpandAndCollapse.innerDiv.style.paddingTop = '0.2rem';
        this.animatedExpandAndCollapse.innerDiv.style.paddingBottom = '0.2rem';
        this.animatedExpandAndCollapse.expandWithoutAnimation();
    }

    async content_update() {
        this.content_htmlElement = document.createElement('div');
        if (this.getObject().isTest) {
            this.content_htmlElement.appendChild(this.getUiA().testG.bodyContent.uiA.htmlElement);
        } else if (this.getObject().testRunA) {
            this.content_htmlElement = this.getUiA().testRunG.bodyContent.uiA.htmlElement;
        } else {
            this.content_htmlElement.appendChild(this.content_contextAsSubitem_htmlElement);
            await this.updateContextAsSubitem();
            this.content_htmlElement.appendChild(this.content_meta_htmlElement);
            if (this.getObject().listA && !this.getObject().testRunA) {
                await this.getUiA().listG.update();
                this.content_htmlElement.appendChild(this.getUiA().listG.htmlElement);
            }
        }
    }

    async updateContextAsSubitem() {
        this.content_contextAsSubitem_htmlElement.innerHTML = null;
        if (await this.getUiA().hasContextAsSubitem()) {
            let contextObj = await this.getObject().context.pathA.resolve();
            let contextAsSubitem = this.entity.getApp_typed().unboundG.createTextWithList('[context]', contextObj);
            contextAsSubitem.collapsible = true;
            contextAsSubitem.editable = false;
            let ui = this.entity.getApp_typed().uiA.createUiFor_typed(contextAsSubitem);
            ui.editable = this.getUiA().editable;
            await ui.update();
            ui.htmlElement.style.marginBottom = '0.1rem';
            ui.headerG.htmlElement.style.fontSize = '0.8rem';
            ui.headerG.htmlElement.style.color = this.entity.getApp_typed().uiA.theme_buttonFontColor;
            this.content_contextAsSubitem_htmlElement.appendChild(ui.htmlElement);
        }
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
            return this.getUiA().testG.bodyContent.uiA.getRawText();
        } else if (this.getObject().listA && !this.getObject().testRunA) {
            if (this.getUiA().isCollapsed()) {
                return '';
            } else {
                return this.getUiA().listG.getRawText();
            }
        } else if (this.getObject().testRunA) {
            if (this.getUiA().testRunG.bodyContent) {
                return this.getUiA().testRunG.bodyContent.uiA.getRawText();
            }
        }
        return '';
    }

    async showMeta() {
        this.content_meta_htmlElement.innerHTML = null;
        this.content_meta_htmlElement.style.marginLeft = '0.7rem';
        this.content_meta_htmlElement.style.borderLeft = '0.3rem solid ' + this.entity.getApp_typed().uiA.theme_meta;
        let hideButton : HTMLButtonElement = document.createElement('button');
        hideButton.onclick = async () => {
            await this.getUiA().hideMeta();
        }
        hideButton.innerText = ' - ';
        hideButton.style.marginLeft = '0.4rem';
        this.content_meta_htmlElement.appendChild(hideButton);
        let app = this.entity.getApp_typed();
        let meta = app.unboundG.createList();
        if (this.getObject().hasUrl()) {
            meta.listA.addDirect(app.unboundG.createLink(this.getObject().getUrl()));
        }
        let ui = app.uiA.createUiFor_typed(meta);
        await ui.update();
        this.content_meta_htmlElement.appendChild(ui.htmlElement);
    }

    hideMeta() {
        this.content_meta_htmlElement.innerHTML = null;
    }
}