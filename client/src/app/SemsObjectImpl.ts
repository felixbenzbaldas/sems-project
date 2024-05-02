import {Observer, Subject, Unsubscribable} from "rxjs";
import {SemsAddress} from "./SemsAddress";
import {SemsObject} from "./SemsObject";
import {SemsObjectType} from "./SemsObjectType";
import {SemsText} from "./SemsText";

export class SemsObjectImpl implements SemsObject {

    private semsAddress : SemsAddress;
    private details: Array<SemsAddress> = [];
    private subject: Subject<any> = new Subject<any>();
    private semsText: SemsText;


    static create(semsAddress : SemsAddress) : SemsObjectImpl {
        let semsObjectImpl = new SemsObjectImpl();
        semsObjectImpl.semsAddress = semsAddress;
        return semsObjectImpl;
    }

    setText(semsText : SemsText) {
        this.semsText = semsText;
    }

    // implementations of SemsObject interface

    getSemsAddress(): SemsAddress {
        return this.semsAddress;
    }

    getType(): SemsObjectType {
        if (this.semsText) {
            return SemsObjectType.TEXT_WITH_DETAILS;
        } else {
            return undefined;
        }
    }

    getText() : SemsText {
        return this.semsText;
    }
    addDetail(detail: SemsAddress): Promise<void> {
        return new Promise<void>(resolve => {
            this.details.push(detail);
            this.subject.next("addedDetail");
            resolve();
        });
    }

    getDetails(): Array<SemsAddress> {
        return this.details;
    }

    subscribe(observer: Partial<Observer<any>>): Unsubscribable {
        return this.subject.subscribe(observer);
    }

}