export class Address {

    private house: string;
    private name: string;

    getHouse() {
        return this.house;
    }

    getName() {
        return this.name;
    }

    static parse(addressString: string) {
        let address = new Address();
        let splitted = addressString.split('-');
        address.name = splitted[splitted.length - 1];
        if (splitted.length > 1) {
            address.house = splitted[splitted.length - 2];
        }
        return address;
    }
}