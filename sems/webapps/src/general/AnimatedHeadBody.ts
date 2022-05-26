import { AnimatedExpandAndCollapse } from "./AnimatedExpandAndCollapse";

export class AnimatedHeadBody {

    private animatedExpandAndCollapse : AnimatedExpandAndCollapse = new AnimatedExpandAndCollapse();
    private uiElement : HTMLElement = document.createElement("div");
    private head : HTMLElement = document.createElement("div");

    static create() : AnimatedHeadBody {
        let hb = new AnimatedHeadBody();
        hb.uiElement.appendChild(hb.head);
        hb.uiElement.appendChild(hb.animatedExpandAndCollapse.getOuterDiv());
        return hb;
    }

    public getHead() : HTMLElement {
        return this.head;
    }

    public getBody() : HTMLElement {
        return this.animatedExpandAndCollapse.getInnerDiv();
    }

    public expand(callback : Function) {
        this.animatedExpandAndCollapse.expand(callback);
    }

    public expandWithoutAnimation() {
        this.animatedExpandAndCollapse.expandWithoutAnimation();
    }

    public collapse(callback: Function) {
        this.animatedExpandAndCollapse.collapse(callback);
    }

    public collapseWithoutAnimation() {
        this.animatedExpandAndCollapse.collapseWithoutAnimation();
    }

    public isCollapsed() : boolean {
        return this.animatedExpandAndCollapse.isCollapsed();
    }

    public getUiElement() : HTMLElement {
        return this.uiElement;
    }
}