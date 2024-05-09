import {Observer, Subject, Unsubscribable} from "rxjs";
import {Address} from "./Address";
import {Object} from "./Object";
import {ObjectType} from "./ObjectType";
import {Text} from "./Text";

export class ObjectImpl implements Object {

    private address : Address;
    private details: Array<Address> = [];
    private subject: Subject<any> = new Subject<any>();
    private text: Text;


    static create(address : Address) : ObjectImpl {
        let objectImpl = new ObjectImpl();
        objectImpl.address = address;
        return objectImpl;
    }

    setText(text : Text) {
        this.text = text;
    }

    // implementations of SemsObject interface

    getAddress(): Address {
        return this.address;
    }

    getType(): ObjectType {
        if (this.text) {
            return ObjectType.TEXT_WITH_DETAILS;
        } else {
            return undefined;
        }
    }

    getText() : Text {
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

}