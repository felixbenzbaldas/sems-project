import type {Entity} from "@/Entity";
import type {AppA_UiA} from "@/ui/AppA_UiA";

export class TestRunA {

    test : Entity;
    resultG_success : boolean;
    resultG_error : Error;
    nestedRuns : Entity;
    appUi: AppA_UiA;

    constructor(public entity : Entity) {
    }
}