import {ListAspect} from "@/core/ListAspect";
import {Subject} from "rxjs";
import type {AppA_AbstractUi} from "@/abstract-ui/AppA_AbstractUi";
import {Path} from "@/core/Path";

/// An identity is an object without members. It only consists of its memory address.
/// The members of this class should be interpreted as aspects which can be assigned to the identity.
/// On the logical level they do not belong to this class.
export class Identity {

    name: string;
    container: Identity;
    text : string;
    link : string;
    list : ListAspect;
    action: Function;
    readonly subject: Subject<any> = new Subject<any>();
    hidden: boolean = false;
    pathA: Path;

    json() : any {
        return {
            'text': this.text,
            'list': this.list?.json(),
            'content': this.appA_abstractUi?.content.json(), // hoping that there will not be an endless recursion
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

    appA_abstractUi: AppA_AbstractUi;
    appA_server: string;

    appA_createIdentity() {
        return new Identity();
    }

    // 'simple' means that the created object has no container and no name. It is simply an object in the memory.
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

    async appA_createText(text: string) : Promise<Identity> {
        return this.appA_getCurrentContainer().containerA_createText(text);
    }

    async appA_createList() : Promise<Identity> {
        return this.appA_getCurrentContainer().containerA_createList();
    }

    appA_getCurrentContainer() : Identity {
        return this;
    }
    /////////////////////////////////////////////////////////////////

    private containerA_nameCounter : number = 0;
    containerA_mapNameIdentity: Map<string, Identity>;

    containerA_getUniqueRandomName() : string {
        return '' + this.containerA_nameCounter++;
    }

    async containerAspect_getByName(name: string) : Promise<Identity> {
        let identity = this.appA_createIdentity();
        identity.text = '42'; // TODO http-request
        return Promise.resolve(identity);
    }

    async containerA_createText(text: string) : Promise<Identity> {
        let textObject = this.appA_simple_createText(text);
        this.containerA_take(textObject);
        return Promise.resolve(textObject);
    }

    async containerA_createList() : Promise<Identity> {
        let list = this.appA_simple_createList();
        this.containerA_take(list);
        return Promise.resolve(list);
    }

    private containerA_take(identity: Identity) {
        identity.name = this.containerA_getUniqueRandomName();
        identity.container = this;
        this.containerA_mapNameIdentity.set(identity.name, identity);
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

    getPath(object: Identity) : Identity {
        let path = this.appA_createIdentity();
        if (this.containerA_mapNameIdentity) {
            if (object.container === this) {
                path.pathA = new Path([object.name]);
            }
        } else {
            if (this.container) {
                path.pathA = new Path(['..', ...this.container.getPath(object).pathA.listOfNames]);
            } else {
                throw 'not implemented yet';
            }
        }
        return path;
    }
}