import {SemsAddress} from "./SemsAddress";
import {Observer, Subscribable, Unsubscribable} from "rxjs";

export interface SemsObject extends Subscribable<any> {
    addDetail(detail: SemsAddress) : Promise<void>;
    getDetails() : Array<SemsAddress>;
    subscribe(observer: Partial<Observer<any>>): Unsubscribable;
}