import type {Object} from "./Object";

export class Text {

    private value: string;

    constructor(private object: Object, value: string) {
        this.value = value;
    }

    getValue(): string {
        return this.value;
    }

    setValue(value: string): Promise<void> {
        return this.object.setStringPropertyValue('text', value).then(() => {
            this.value = value;
        });
    }
}