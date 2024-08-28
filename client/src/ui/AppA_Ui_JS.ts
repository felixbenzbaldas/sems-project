import type {Identity} from "@/Identity";
import {AppA_Ui_JS_UserPerspectiveG} from "@/ui/AppA_Ui_JS_UserPerspectiveG";

export class AppA_Ui_JS {

    readonly userPerspectiveG: AppA_Ui_JS_UserPerspectiveG;

    constructor(private identity : Identity) {
        this.userPerspectiveG = new AppA_Ui_JS_UserPerspectiveG(identity);
    }
}