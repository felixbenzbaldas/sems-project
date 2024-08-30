import type {Identity} from "@/Identity";

export class AppA_Ui_JS_UserPerspectiveG {

    constructor(private identity : Identity) {
    }

    getRawText() : string {
        return this.identity.guiG.getRawText();
    }

    countEditableTexts() : number {
        return this.identity.guiG.countEditableTexts();
    }

    async click(text: string) {
        await this.identity.guiG.click(text);
    }
}