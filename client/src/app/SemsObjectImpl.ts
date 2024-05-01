import {Observer, Subject, Unsubscribable} from "rxjs";
import {SemsAddress} from "./SemsAddress";
import {SemsObject} from "./SemsObject";

export class SemsObjectImpl implements SemsObject {


    private details: Array<SemsAddress> = [];
    private subject: Subject<any> = new Subject<any>();

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