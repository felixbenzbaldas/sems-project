import {ListAspect} from "@/core/ListAspect";
import {Subject} from "rxjs";
import type {AbstractUi} from "@/abstract-ui/AbstractUi";

/// An identity is an object without members. It only consists of its memory address.
/// The members of this class should be interpreted as aspects which can be assigned to the identity.
/// On the logical level they do not belong to this class.
export class Identity {

    text : string;
    list : ListAspect;
    action: Function;
    subject: Subject<any>;

    /////////////////////////////////////////////////////////////////
    // app aspect

    abstractUi: AbstractUi;
    server: string;
    
    createIdentity() {
        return new Identity();
    }

    createList(...jsList : Array<Identity>) : Identity {
        let list = this.createIdentity();
        list.subject = new Subject<any>();
        list.list = new ListAspect(list, ...jsList);
        return list;
    }

    createText(text: string) : Identity {
        let identity = this.createIdentity();
        identity.text = text;
        return identity;
    }

    createTextWithList(text : string, ...jsList : Array<Identity>) : Identity {
        let identity = this.createIdentity();
        identity.text = text;
        identity.subject = new Subject<any>();
        identity.list = new ListAspect(identity, ...jsList);
        return identity;
    }

    createButton(label : string, func : Function) : Identity {
        let button = this.createIdentity();
        button.text = label;
        button.action = func;
        return button;
    }

    async remote_createText(text: string) : Promise<Identity> {
        return Promise.resolve(this.createText(text));
    }
    /////////////////////////////////////////////////////////////////
}