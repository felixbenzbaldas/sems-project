import type {Address} from "@/core/legacy/Address";
import {AddressImpl} from "@/core/legacy/Address";

export class AddressUtil {
    static parse(addressString: string): Address {
        return new AddressImpl(addressString.split('-'));
    }

    static createString(address: Address) {
        return address.getListOfAddressParts().join('-');
    }

    static fromName(name: string): Address {
        return new AddressImpl([name]);
    }
}