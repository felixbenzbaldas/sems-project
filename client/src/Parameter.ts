type type = 'stringValue' | 'entity';

export class Parameter {
    name : string;
    type : type;
    defaultValue : any;
    constructor(name : string, type : type, defaultValue? : any) {
        this.name = name;
        this.type = type;
        this.defaultValue = defaultValue;
    }
}