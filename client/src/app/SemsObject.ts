
export class SemsObject {


  private details : Array<SemsObject> = [];

  addDetail(detail: SemsObject) : Promise<void> {
    this.details.push(detail);
    return new Promise<void>(resolve => { resolve(); });
  }

  getDetails() : Array<SemsObject> {
    return this.details;
  }

}