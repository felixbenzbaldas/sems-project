export class Location {

    constructor(private httpAddress : string) {
    }

    getHttpAddress() : string {
        return this.httpAddress;
    }
}