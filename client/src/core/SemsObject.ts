import type {Location} from "@/core/Location";
import {ObservableList} from "@/core/ObservableList";
import {Path} from "@/core/Path";

export class SemsObject {

    private container: any;
    private details: ObservableList<Path>;

    constructor(private location : Location, private name : string, private data : any) {
        this.details = new ObservableList<Path>();
        if (data.details) {
            (data.details as Array<Array<string>>).forEach(listPath => {
                this.details.add(new Path(listPath));
            });
        }
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

    async addDetail(path : Path) : Promise<void> {
        let newDetailsList : Array<Path> = this.details.createCopyOfList();
        newDetailsList.push(path);
        let detailsListForRequest : Array<Array<string>> = newDetailsList.map(detailsPath => detailsPath.toList());
        let pathOfThis = this.location.getPath(this);
        await this.location.request('set', [pathOfThis.toList(), 'details', detailsListForRequest]);
        this.details.add(path);
    }

    getDetails() : ObservableList<Path> {
        return this.details;
    }

    setContainer(container : any) {
        this.container = container;
    }

    getContainer() : any {
        return this.container;
    }
}