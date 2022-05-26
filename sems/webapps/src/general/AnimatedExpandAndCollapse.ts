export class AnimatedExpandAndCollapse {
    private outerDiv : HTMLDivElement;
    private innerDiv : HTMLDivElement;
    public basisAnimationTime : number = 0.11;
    public basisHeight : number = 60;
    private isCollapsedFlag : boolean;

    constructor() {
        this.outerDiv = document.createElement("div");
        this.innerDiv = document.createElement("div");
        this.outerDiv.appendChild(this.innerDiv);
        this.outerDiv.style.overflow = "hidden";
        this.outerDiv.style.height = "0px";
        this.isCollapsedFlag = true;
    }

    public getOuterDiv() {
        return this.outerDiv;
    }

    public getInnerDiv() {
        return this.innerDiv;
    }

    public expand(callback : Function) {
        let effectiveAnimationTime = this.setEffectiveAnimationTime();
        this.outerDiv.style.height = this.innerDiv.offsetHeight + "px";
        this.isCollapsedFlag = false;
        setTimeout(() => {
            this.outerDiv.style.height = "auto";
            this.outerDiv.style.overflow = "visible";
            callback();
        }, effectiveAnimationTime * 1000);
    }

    private setEffectiveAnimationTime() {
        let effectiveAnimationTime = this.basisAnimationTime * Math.pow(this.innerDiv.offsetHeight / this.basisHeight, 1 / 3);
        this.outerDiv.style.transition = "height " + effectiveAnimationTime + "s";
        return effectiveAnimationTime;
    }
    
    public expandWithoutAnimation() {
        this.outerDiv.style.height = "auto";
        this.outerDiv.style.overflow = "visible";
        this.isCollapsedFlag = false;
    }

    public collapse(callback: Function) {
        let effectiveAnimationTime = this.setEffectiveAnimationTime();
        this.outerDiv.style.overflow = "hidden";
        this.outerDiv.style.height = this.innerDiv.offsetHeight + "px";
        this.isCollapsedFlag = true;
        // Es wird ein kleiner Timeout benötigt, damit zuerst die Höhe korrekt gesetzt wird.
        setTimeout(() => {
            this.outerDiv.style.height = "0px";
            setTimeout(() => {
                callback();
            }, effectiveAnimationTime * 1000);
        }, 20);
    }

    public collapseWithoutAnimation() {
        this.outerDiv.style.height = "0px";
        this.outerDiv.style.overflow = "hidden";
        this.isCollapsedFlag = true;
    }

    public isCollapsed() : boolean {
        return this.isCollapsedFlag;
    }
}