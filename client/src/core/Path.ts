export class Path extends Array<string> {
    get(index: number) : string {
        return this[index];
    }
}