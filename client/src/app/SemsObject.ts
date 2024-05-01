import {SemsAddress} from "./SemsAddress";
import {Observer, Subscribable, Unsubscribable} from "rxjs";
import {SemsObjectType} from "./SemsObjectType";
import {SemsText} from "./SemsText";

export interface SemsObject extends Subscribable<any> {
    addDetail(detail: SemsAddress): Promise<void>;

    getDetails(): Array<SemsAddress>;

    subscribe(observer: Partial<Observer<any>>): Unsubscribable;

    getSemsAddress(): SemsAddress;

    getType(): SemsObjectType;

    getText(): SemsText;
}