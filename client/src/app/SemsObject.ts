import { Observable, firstValueFrom, of } from "rxjs";

export class SemsObject {


  private details : Array<SemsObject> = [];

  addDetail(detail: SemsObject) : Promise<String> {
    return firstValueFrom(of("1-fj46jrfirt"));
  }

  getDetails() : Array<SemsObject> {
    return [];
  }

}