// Automatically converts keys to primitive type.
// This means: new String("abc") is equal to "abc"

import { General } from "./General";


export class MapWithPrimitiveStringsAsKey {
    private map = new Map();
    public get(key) {
        return this.map.get(General.ensurePrimitiveTypeIfString(key));
    }
    public has(key) : boolean {
        return this.map.has(General.ensurePrimitiveTypeIfString(key));
    }
    public set(key, value) {
        this.map.set(General.ensurePrimitiveTypeIfString(key), value);
    }
    public delete(key) {
        this.map.delete(General.ensurePrimitiveTypeIfString(key));
    }
    public keys() : IterableIterator<any> {
        return this.map.keys();
    }
}