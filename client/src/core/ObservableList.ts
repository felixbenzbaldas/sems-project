import {Subject} from "rxjs";

export class ObservableList<T> {

    subject : Subject<any> = new Subject<any>();
    private list : Array<T> = [];

    constructor() {
    }

    createCopyOfList() : Array<T> {
        return [...this.list];
    }

    add(item: T) {
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