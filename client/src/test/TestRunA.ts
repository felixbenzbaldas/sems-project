import type {Entity} from "@/Entity";

export class TestRunA {

    test : Entity;
    resultG_success : boolean;
    resultG_error : Error;

    constructor(private entity : Entity) {
    }

}