import type {Entity} from "@/Entity";
import type {UiA} from "@/ui/UiA";
import {AnimatedExpandAndCollapse} from "@/ui/AnimatedExpandAndCollapse";
import {div} from "@/utils";

// TODO the body aspect should only exist if showBody === true
export class UiA_BodyG {

    htmlElement : HTMLElement = div();
    content_htmlElement : HTMLElement = div();
    content_contextAsSubitem_htmlElement : HTMLElement = div();
    content_meta_htmlElement : HTMLElement = div();
    animatedExpandAndCollapse : AnimatedExpandAndCollapse = new AnimatedExpandAndCollapse();

    constructor(private entity: Entity) {
        this.htmlElement.style.display = 'none';
        this.content_htmlElement.style.paddingLeft = '0.8rem';
        this.content_htmlElement.style.paddingTop = '0.2rem';
        this.content_htmlElement.style.paddingBottom = '0.2rem';
        this.htmlElement.appendChild(this.animatedExpandAndCollapse.outerDiv);
        this.animatedExpandAndCollapse.innerDiv.appendChild(this.content_htmlElement);
    }

    async expandWithAnimation() {
        this.htmlElement.style.display = 'block';
        await this.content_update();
        await this.animatedExpandAndCollapse.expand();
    }

    async collapseWithAnimation() {
        await this.animatedExpandAndCollapse.collapse().then(() => {
            this.content_htmlElement.innerHTML = null;
            this.htmlElement.style.display = 'none';
        });
    }

    async install() {
        if (!this.getObject().collapsible && await this.getUiA().headerBodyG.hasBodyContent()) {
            await this.displayBody();
        }
    }

    async ensureCollapsed() {
        this.content_htmlElement.innerHTML = null;
        this.htmlElement.style.display = 'none';
    }

    async displayBody() {
        this.htmlElement.style.display = 'block';
        await this.content_update();
        this.animatedExpandAndCollapse.expandWithoutAnimation();
    }

    async content_update() {
        this.content_htmlElement.innerHTML = null;
        if (this.getObject().testRunA) {
            this.content_htmlElement.appendChild(this.getUiA().testRunG.bodyContentUi.htmlElement);
        } else {
            this.content_htmlElement.appendChild(this.content_contextAsSubitem_htmlElement);
            await this.updateContextAsSubitem();
            this.content_htmlElement.appendChild(this.content_meta_htmlElement);
            if (this.getObject().listA && !this.getObject().testRunA) {
                this.getUiA().installListA();
                await this.getUiA().listA.update();
                this.content_htmlElement.appendChild(this.getUiA().listA.htmlElement);
            }
        }
    }

    async updateContextAsSubitem() {
        this.content_contextAsSubitem_htmlElement.innerHTML = null;
        if (await this.getUiA().hasContextAsSubitem()) {
            let contextObj = await this.getObject().context.resolve();
            let contextAsSubitem = this.entity.getApp_typed().unboundG.createTextWithList('[context]', contextObj);
            contextAsSubitem.collapsible = true;
            contextAsSubitem.editable = false;
            let ui = await this.getUiA().createSubUiFor_transmitEditability(contextAsSubitem); // it is important to transmit the editability for the subsubitems
            ui.htmlElement.style.marginBottom = '0.1rem';
            ui.headerG.htmlElement.style.fontSize = '0.8rem';
            ui.headerG.htmlElement.style.color = this.entity.getApp_typed().uiA.theme.buttonFontColor;
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

    async showMeta() {
        this.content_meta_htmlElement.innerHTML = null;
        this.content_meta_htmlElement.style.marginLeft = '0.7rem';
        this.content_meta_htmlElement.style.borderLeft = '0.3rem solid ' + this.entity.getApp_typed().uiA.theme.meta;
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
        let topLevelContainer = this.getObject().getTopLevelContainer();
        if (topLevelContainer) {
            meta.listA.addDirect(app.unboundG.createText(topLevelContainer.entity.getShortDescription() + ' > '
                + topLevelContainer.entity.getPath(this.getObject()).asString()));
        }
        let ui = await this.getUiA().createSubUiFor_transmitEditability(meta);
        this.content_meta_htmlElement.appendChild(ui.htmlElement);
    }

    hideMeta() {
        this.content_meta_htmlElement.innerHTML = null;
    }
}