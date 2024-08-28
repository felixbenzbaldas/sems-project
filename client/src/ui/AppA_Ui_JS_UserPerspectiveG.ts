import type {Identity} from "@/Identity";

export class AppA_Ui_JS_UserPerspectiveG {

    constructor(private identity : Identity) {
    }

    getRawText() : string {
        return this.identity.ui_js.getRawText();
    }
}