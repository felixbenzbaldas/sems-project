import {ObjectType} from "./ObjectType";
import {Text} from "./Text";
import type {Observer, Subscribable, Unsubscribable} from "rxjs";
import type {Address} from "@/core/Address";

export interface Object extends Subscribable<any> {
    setStringPropertyValue(propertyName: string, value: string): Promise<void>;

    addDetail(detail: Address): Promise<void>;

    getDetails(): Array<Address>;

    subscribe(observer: Partial<Observer<any>>): Unsubscribable;

    getAddress(): Address;

    getName() : string;

    getType(): ObjectType;

    getText(): Text;
}