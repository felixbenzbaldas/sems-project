import type {Entity} from "@/Entity";
import type {AppA_UiA} from "@/ui/AppA_UiA";
import type {AppA} from "@/AppA";

export class TestRunA {

    test : Entity;
    resultG_success : boolean;
    resultG_error : Error;
    nestedRuns : Entity;
    appUi: AppA_UiA;
    app: AppA;

    constructor(public entity : Entity) {
    }
}