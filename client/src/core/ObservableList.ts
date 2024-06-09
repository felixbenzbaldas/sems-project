import {Subject} from "rxjs";

export class ObservableList<T> {

    subject : Subject<any> = new Subject<any>();
    private list : Array<T> = [];

    constructor() {
    }

    /// It is guaranteed that always a fresh copy is returned. This can be important for change detection in UI-Frameworks.
    createCopyOfList() : Array<T> {
        return [...this.list];
    }

    add(item: any) {
        this.list.push(item);
        this.subject.next('addedItem');
    }

    clear() {
        this.list = [];
        this.subject.next('cleared');
    }

    isEmpty() {
        return this.list.length == 0;
    }
}