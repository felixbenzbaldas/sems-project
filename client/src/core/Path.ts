export class Path {
    constructor(private listOfNames : Array<string>) {
    }

    static empty() : Path {
        return new Path([]);
    }

    toList() : Array<string> {
        return this.listOfNames;
    }

    getLength() : number {
        return this.listOfNames.length;
    }

    getFirst() : string {
        return this.listOfNames.at(0);
    }

    append(name: string) : Path {
        return new Path([...this.listOfNames, name]);
    }

    getLast() {
        return this.listOfNames.at(this.listOfNames.length - 1);
    }

    withoutLast() : Path {
        return new Path(this.listOfNames.slice(0, this.listOfNames.length - 1));
    }

    withoutFirst() {
        return new Path(this.listOfNames.slice(1, this.listOfNames.length));
    }
}