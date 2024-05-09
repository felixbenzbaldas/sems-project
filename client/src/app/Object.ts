import {Address} from "./Address";
import {Observer, Subscribable, Unsubscribable} from "rxjs";
import {ObjectType} from "./ObjectType";
import {Text} from "./Text";

export interface Object extends Subscribable<any> {
    addDetail(detail: Address): Promise<void>;

    getDetails(): Array<Address>;

    subscribe(observer: Partial<Observer<any>>): Unsubscribable;

    getAddress(): Address;

    getType(): ObjectType;

    getText(): Text;
}