import type {Identity} from "@/Identity";

export class AppA_Ui_JS_UserPerspectiveG {

    constructor(private identity : Identity) {
    }

    getRawText() : string {
        return this.identity.ui_js.getRawText();
    }

    numberOfEditableTexts() : number {
        return this.identity.ui_js.numberOfEditableTexts();
    }

    async click(text: string) {
        await this.identity.ui_js.click(text);
    }
}