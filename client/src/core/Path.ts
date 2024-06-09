export class Path {
    constructor(private listOfNames : Array<string>) {
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
}