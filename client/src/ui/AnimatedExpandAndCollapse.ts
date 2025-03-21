// The expand- and collapse-methods throw an exception when called while instance is busy.
import {div, wait} from "@/utils";

type AnimationStyle = 'linear' | 'natural';

export class AnimatedExpandAndCollapse {
    outerDiv : HTMLDivElement = div();
    innerDiv : HTMLDivElement = div();
    basisAnimationTime_inSeconds : number = 0.2;
    basisHeight_inPixel : number = 120;
    maxAnimationTime_inSeconds: number = 2;
    private animationStyle : AnimationStyle = 'natural';
    setAnimationStyle(animationStyle : AnimationStyle) {
        if (animationStyle === 'natural') {
            this.animationStyle = animationStyle;
            this.outerDiv.style.transitionTimingFunction = 'ease';
        } else if (animationStyle === 'linear') {
            this.animationStyle = animationStyle;
            this.outerDiv.style.transitionTimingFunction = 'linear';
        }
    }

    isCollapsedFlag : boolean;
    isBusyFlag : boolean = false;

    constructor() {
        this.outerDiv.appendChild(this.innerDiv);
        this.outerDiv.style.overflow = "hidden";
        this.outerDiv.style.height = "0px";
        this.outerDiv.style.transitionProperty = "height";
        this.isCollapsedFlag = true;
    }

    async expand() {
        this.checkBusy();
        let effectiveAnimationTime = this.setEffectiveAnimationTime();
        this.outerDiv.style.height = this.innerDiv.offsetHeight + "px";
        this.isCollapsedFlag = false;
        this.isBusyFlag = true;
        await wait(effectiveAnimationTime * 1000);
        this.outerDiv.style.height = "auto";
        this.outerDiv.style.overflow = "visible";
        this.isBusyFlag = false;
    }

    private setEffectiveAnimationTime() {
        let effectiveAnimationTime : number;
        if (this.animationStyle === 'natural') {
            effectiveAnimationTime = this.basisAnimationTime_inSeconds * Math.pow(this.innerDiv.offsetHeight / this.basisHeight_inPixel, 1 / 3);
        } else {
            effectiveAnimationTime = this.basisAnimationTime_inSeconds * this.innerDiv.offsetHeight / this.basisHeight_inPixel;
        }
        if (this.maxAnimationTime_inSeconds > 0) {
            effectiveAnimationTime = Math.min(effectiveAnimationTime, this.maxAnimationTime_inSeconds);
        }
        this.outerDiv.style.transitionDuration = effectiveAnimationTime + "s";
        return effectiveAnimationTime;
    }

    expandWithoutAnimation() {
        this.checkBusy();
        this.outerDiv.style.height = "auto";
        this.outerDiv.style.overflow = "visible";
        this.isCollapsedFlag = false;
    }

    async collapse() {
        this.checkBusy();
        let effectiveAnimationTime = this.setEffectiveAnimationTime();
        this.outerDiv.style.overflow = "hidden";
        this.outerDiv.style.height = this.innerDiv.offsetHeight + "px";
        this.isCollapsedFlag = true;
        this.isBusyFlag = true;
        await wait(20); // we need a short timeout to set the height
        this.outerDiv.style.height = "0px";
        await wait (effectiveAnimationTime * 1000);
        this.isBusyFlag = false;
    }

    collapseWithoutAnimation() {
        this.checkBusy();
        this.outerDiv.style.height = "0px";
        this.outerDiv.style.overflow = "hidden";
        this.isCollapsedFlag = true;
    }

    private checkBusy() {
        if (this.isBusyFlag) {
            throw new Error('busy!');
        }
    }
}