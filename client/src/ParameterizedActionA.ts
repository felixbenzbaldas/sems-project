import type {Entity} from "@/Entity";

export class ParameterizedActionA {
    parameters : Array<string> = [];
    constructor(public entity : Entity) {
    }
}