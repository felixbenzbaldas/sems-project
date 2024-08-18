import {ListAspect} from "@/core/ListAspect";
import {Subject} from "rxjs";
import type {AbstractUi} from "@/abstract-ui/AbstractUi";

/// An identity is an object without members. It only consists of its memory address.
/// The members of this class should be interpreted as aspects which can be assigned to the identity.
/// On the logical level they do not belong to this class.
export class Identity {

    name: string;
    text : string;
    link : string;
    list : ListAspect;
    action: Function;
    readonly subject: Subject<any> = new Subject<any>();
    hidden: boolean = false;

    json() : any {
        return {
            'text': this.text,
            'list': this.list?.json(),
            'content': this.abstractUi?.content.json(),
        }
    }

    /////////////////////////////////////////////////////////////////
    // app aspect

    abstractUi: AbstractUi;
    server: string;

    createIdentity() {
        return new Identity();
    }

    createList(...jsList : Array<Identity>) : Identity {
        let list = this.createIdentity();
        list.list = new ListAspect(list, ...jsList);
        return list;
    }

    createText(text: string) : Identity {
        let identity = this.createIdentity();
        identity.text = text;
        return identity;
    }

    createLink(href: string, text?: string) {
        let identity = this.createIdentity();
        identity.link = href;
        identity.text = text;
        return identity;
    }

    createTextWithList(text : string, ...jsList : Array<Identity>) : Identity {
        let identity = this.createIdentity();
        identity.text = text;
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
        // TODO httpRequest
        return Promise.resolve(this.createText(text));
    }
    /////////////////////////////////////////////////////////////////

    async containerAspect_getByName(name: string) : Promise<Identity> {
        let identity = this.createIdentity();
        identity.text = '42'; // TODO http-request
        return Promise.resolve(identity);
    }

    async httpRequest(url : string, method : string, args : Array<any>) : Promise<any> {
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                'method': method,
                'args' : args
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'charset' : 'UTF-8'
            },
        }).then(response => response.json());
    }
}