import {Observer, Subject, Subscribable, Unsubscribable} from "rxjs";

export class SemsObject implements Subscribable<any> {


  private details : Array<SemsObject> = [];
  private subject : Subject<any> = new Subject<any>();

  addDetail(detail: SemsObject) : Promise<void> {
    return new Promise<void>(resolve => {
      this.details.push(detail);
      this.subject.next("addedDetail");
      resolve();
    });
  }

  getDetails() : Array<SemsObject> {
    return this.details;
  }

  subscribe(observer: Partial<Observer<any>>): Unsubscribable {
    return this.subject.subscribe(observer);
  }

}