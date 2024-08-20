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
            'content': this.appA_abstractUi?.content.json(),
        }
    }

    setText(string: string) {
        this.text = string;
        this.notify();
    }

    setHidden(value : boolean) {
        this.hidden = value;
        this.notify();
    }

    public notify() {
        this.subject.next(null);
    }

    /////////////////////////////////////////////////////////////////
    // app aspect

    appA_abstractUi: AbstractUi;
    appA_server: string;

    appA_createIdentity() {
        return new Identity();
    }

    appA_simple_createList(...jsList : Array<Identity>) : Identity {
        let list = this.appA_createIdentity();
        list.list = new ListAspect(list, ...jsList);
        return list;
    }

    appA_simple_createText(text: string) : Identity {
        let identity = this.appA_createIdentity();
        identity.text = text;
        return identity;
    }

    appA_simple_createLink(href: string, text?: string) {
        let identity = this.appA_createIdentity();
        identity.link = href;
        identity.text = text;
        return identity;
    }

    appA_simple_createTextWithList(text : string, ...jsList : Array<Identity>) : Identity {
        let identity = this.appA_createIdentity();
        identity.text = text;
        identity.list = new ListAspect(identity, ...jsList);
        return identity;
    }

    appA_simple_createButton(label : string, func : Function) : Identity {
        let button = this.appA_createIdentity();
        button.text = label;
        button.action = func;
        return button;
    }

    async appA_remote_createText(text: string) : Promise<Identity> {
        // TODO httpRequest
        return Promise.resolve(this.appA_simple_createText(text));
    }
    /////////////////////////////////////////////////////////////////

    async containerAspect_getByName(name: string) : Promise<Identity> {
        let identity = this.appA_createIdentity();
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

    async defaultAction() {
        if (this.appA_abstractUi) {
            await this.appA_abstractUi.defaultAction();
        } else {
            throw 'not implemented yet';
        }
    }
}