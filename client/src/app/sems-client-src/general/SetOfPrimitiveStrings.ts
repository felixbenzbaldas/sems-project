import { General } from "./General";

// Automatically converts to primitive type.
// This means: new String("abc") is equal to "abc"
export class SetOfStrings {
    private set = new Set();

    public has(string) : boolean {
        return this.set.has(General.ensurePrimitiveTypeIfString(string));
    }

    public add(string) {
        this.set.add(General.ensurePrimitiveTypeIfString(string));
    }

    public delete(string) {
        this.set.delete(string);
    }

    public forEach(callback: (value: any, value2: any, set: Set<any>) => void, thisArg?: any): void {
        this.set.forEach(callback);
    }
}