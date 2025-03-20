import type {Entity} from "@/Entity";
import type {Parameter} from "@/Parameter";

export class ParameterizedActionA {
    parameters : Array<Parameter> = [];
    constructor(public entity : Entity) {
    }

    async runWithArgs(args: Entity) : Promise<any> {
        let resolvedArgs = [];
        for (let parameter of this.entity.parameterizedActionA.parameters) {
            if (parameter.type === 'stringValue') {
                resolvedArgs.push((await args.get(parameter.name)).text);
            } else if (parameter.type === 'entity') {
                resolvedArgs.push(await args.get(parameter.name));
            }
        }
        return await this.entity.codeG_jsFunction.call(null, ...resolvedArgs);
    }
}