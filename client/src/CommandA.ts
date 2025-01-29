import type {Entity} from "@/Entity";
import type {InputPattern} from "@/ui/InputPattern";

export class CommandA {

    inputPatterns : Array<InputPattern> = [];

    constructor(public entity : Entity) {
    }


}