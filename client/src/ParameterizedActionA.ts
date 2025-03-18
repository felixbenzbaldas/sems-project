import type {Entity} from "@/Entity";
import type {Parameter} from "@/Parameter";

export class ParameterizedActionA {
    parameters : Array<Parameter> = [];
    constructor(public entity : Entity) {
    }
}