import type {Location} from "@/deprecated/core/Location";
import {Path} from "@/deprecated/core/Path";
import {ListProperty} from "@/deprecated/core/ListProperty";
import {ContainerAspect} from "@/deprecated/core/ContainerAspect";
import {Http} from "@/deprecated/core/Http";

export class SemsObject {

    private location : Location;
    private container : SemsObject;
    private name : string;
    private listProperties : Map<string, ListProperty> = new Map();
    private stringProperties : Map<string, string> = new Map();

    containerAspect : ContainerAspect;

    private constructor() {}

    static remote(location : Location, container : SemsObject, name : string, data : any) : SemsObject {
        let object = new SemsObject();
        object.location = location;
        object.container = container;
        object.name = name;
        Object.keys(data).forEach(propertyName => {
            if (data[propertyName] instanceof Array) {
                let list = data[propertyName].map((pathList : Array<string>) => new Path(pathList));
                let listProperty = new ListProperty(object.location, object, propertyName, list);
                object.listProperties.set(propertyName, listProperty);
            } else {
                object.stringProperties.set(propertyName, data[propertyName]);
            }
        });
        object.containerAspect = new ContainerAspect(new Http(), location, object); // TODO http object
        return object;
    }

    getName() : string {
        return this.name;
    }

    getListProperty(propertyName: string) : ListProperty {
        if (!this.listProperties.has(propertyName)) {
            this.listProperties.set(propertyName, new ListProperty(this.location, this, propertyName, []));
        }
        return this.listProperties.get(propertyName);
    }

    getText() : string {
        return this.stringProperties.get('text');
    }

    async setText(text: string) : Promise<void> {
        let path = this.location.getPath(this);
        await this.location.request('set', [path.toList(), 'text', text]);
        this.stringProperties.set('text', text);
    }

    getContainer() : SemsObject {
        return this.container;
    }

    async resolve(path : Path) : Promise<SemsObject> {
        if (path.getLength() === 0) {
            return this;
        } else {
            return this.containerAspect.resolve(path);
        }
    }
}