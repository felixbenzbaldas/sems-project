import { Observable } from "rxjs";

export class SemsObject {

  private details : Array<SemsObject> = [];

  addDetail(detail: SemsObject) : Observable<String> {
    return new Observable(subscriber => {
      subscriber.next("success");
    });
  }

  getDetails() : Array<SemsObject> {
    return [];
  }

}