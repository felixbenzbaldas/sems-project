import {ListAspect} from "@/restart-with-aspects/aspects/ListAspect";

/// An identity is an object without members. It only consists of its object address.
/// The members of this class should be interpreted as aspects which can be assigned to the identity.
/// On the logical level they do not belong to this class.
export class Identity {

    text: string;
    list: ListAspect;

    createIdentity() {
        return new Identity();
    }

    createList() : Identity {
        let list = this.createIdentity();
        list.list = new ListAspect();
        return list;
    }
}