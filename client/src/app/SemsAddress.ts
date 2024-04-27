export class SemsAddress {

    private house : string;
    private name : string;

    getHouse() {
        return this.house;
    }

    getName() {
        return this.name;
    }

    static parse(addressString: string) {
        let semsAddress = new SemsAddress();
        let splitted = addressString.split('-');
        semsAddress.name = splitted[splitted.length - 1];
        if (splitted.length > 1) {
            semsAddress.house = splitted[splitted.length - 2];
        }
        return semsAddress;
    }
}