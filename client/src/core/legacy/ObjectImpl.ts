import type {Address} from "@/core/legacy/Address";
import {ObjectType} from "@/core/legacy/ObjectType";
import {type Observer, Subject, type Unsubscribable} from "rxjs";
import type {House} from "@/core/legacy/House";
import {Text} from '@/core/legacy/Text';

export class ObjectImpl implements Object {

    private details: Array<Address> = [];
    private subject: Subject<any> = new Subject<any>();
    private text: Text;

    constructor(private house : House, private name : string) {
    }

    setText(text : Text) {
        this.text = text;
    }

    getAddress(): Address {
        return this.house.getAddress().append(this.name);
    }

    getType(): ObjectType {
        if (this.text) {
            return ObjectType.TEXT_WITH_DETAILS;
        } else {
            return undefined;
        }
    }

    getText() : Text {
        if (!this.text) {
            this.text = new Text(this,undefined);
        }
        return this.text;
    }

    addDetail(detail: Address): Promise<void> {
        return new Promise<void>(resolve => {
            this.details.push(detail);
            this.subject.next("addedDetail");
            resolve();
        });
    }

    getDetails(): Array<Address> {
        return this.details;
    }

    subscribe(observer: Partial<Observer<any>>): Unsubscribable {
        return this.subject.subscribe(observer);
    }

    setStringPropertyValue(propertyName: string, value: string): Promise<void> {
        return this.house.setStringProperty(this.getName(), propertyName, value);
    }

    getName() : string {
        return this.name;
    }

}