import type {Location} from "@/core/Location";
import {ObservableList} from "@/core/ObservableList";
import {Path} from "@/core/Path";
import {ListProperty} from "@/core/ListProperty";

export class SemsObject {

    private container: any;
    private listProperties : Map<string, ListProperty>;

    constructor(private location : Location, private name : string, private data : any) {
        this.listProperties = new Map();
        Object.keys(data).forEach(propertyName => {
            if (data[propertyName] instanceof Array) {
                let list = data[propertyName].map((pathList : Array<string>) => new Path(pathList));
                let listProperty = new ListProperty(this.location, this, propertyName, list);
                this.listProperties.set(propertyName, listProperty);
            }
        });
    }

    getName() : string {
        return this.name;
    }

    getText() : string {
        return this.data.text;
    }

    async setText(text: string) : Promise<void> {
        let path = this.location.getPath(this);
        await this.location.request('setText', [path.toList(), text]);
        this.data.text = text;
    }

    setContainer(container : any) {
        this.container = container;
    }

    getContainer() : any {
        return this.container;
    }

    getListProperty(propertyName: string) : ListProperty {
        if (!this.listProperties.has(propertyName)) {
            this.listProperties.set(propertyName, new ListProperty(this.location, this, propertyName, []));
        }
        return this.listProperties.get(propertyName);
    }
}