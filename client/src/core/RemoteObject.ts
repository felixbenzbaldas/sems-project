import type {Location} from "@/core/Location";
import {ObservableList} from "@/core/ObservableList";

export class RemoteObject {

    private container: any;
    private details : ObservableList<RemoteObject> = new ObservableList<RemoteObject>();

    constructor(private location : Location, private name : string, private text : string) {
    }

    getName() : string {
        return this.name;
    }

    getText() : string {
        return this.text;
    }

    async setText(text: string) : Promise<void> {
        let path = this.location.getPath(this);
        return this.location.request('setText', [path.toList(), text]).then(() => {
            this.text = text;
        });
    }

    async addDetail(object : RemoteObject) : Promise<void> {
        this.details.add(object);
    }

    getDetails() : ObservableList<RemoteObject> {
        return this.details;
    }

    setContainer(container : any) {
        this.container = container;
    }

    getContainer() : any {
        return this.container;
    }
}