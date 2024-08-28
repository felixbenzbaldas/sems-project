import type {Identity} from "@/Identity";

export class AppA_Ui_JS_UserPerspectiveG {

    constructor(private identity : Identity) {
    }

    getRawText() : string {
        return this.identity.ui_js.getRawText();
    }

    countEditableTexts() : number {
        return this.identity.ui_js.countEditableTexts();
    }

    async click(text: string) {
        await this.identity.ui_js.click(text);
    }
}