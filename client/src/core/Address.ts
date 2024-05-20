export interface Address {
    getLastPart() : string;
    withoutLastPart() : Address;
    append(addressPart : string) : Address;
    getListOfAddressParts() : Array<string>;
}

export class AddressImpl implements Address {

    constructor(private listOfAddressParts : Array<string>) {
    }
    getLastPart(): string {
        return this.listOfAddressParts.at(this.listOfAddressParts.length - 1);
    }
    withoutLastPart(): Address {
        return new AddressImpl(this.listOfAddressParts.slice(0, this.listOfAddressParts.length - 1));
    }
    append(addressPart: string): Address {
        let newListOfAddressParts = this.listOfAddressParts.slice();
        newListOfAddressParts.push(addressPart);
        return new AddressImpl(newListOfAddressParts);
    }
    getListOfAddressParts(): Array<string> {
        return this.listOfAddressParts;
    }
}