import {Color} from "./Color";

export class Theme {
    public backgroundColor : string;
    public fontColor : string;
    public buttonFontColor : string;
    public buttonFontColor_selected : string;
    public selectionColor : string;
    public focusBorderColor: string;
    public focusBorderColor_editView: string;

    public static goldOnVioletTheme : Theme = new Theme();
    public static yellowOnGreyTheme : Theme = new Theme();

    static {
        let goldOnVioletTheme : Theme = new Theme();
        goldOnVioletTheme.backgroundColor = Color.DARK_DARK_VIOLET;
        goldOnVioletTheme.fontColor = Color.DARK_GOLD;
        goldOnVioletTheme.buttonFontColor = Color.DULL_BLUE;
        goldOnVioletTheme.buttonFontColor_selected = Color.TURQUOISE;
        goldOnVioletTheme.selectionColor = Color.TURQUOISE;
        goldOnVioletTheme.focusBorderColor = "orange";
        goldOnVioletTheme.focusBorderColor_editView = "green";
        Theme.goldOnVioletTheme = goldOnVioletTheme;

        let yellowOnGreyTheme : Theme = new Theme();
        yellowOnGreyTheme.backgroundColor = "grey";
        yellowOnGreyTheme.fontColor = "yellow";
        yellowOnGreyTheme.buttonFontColor = Color.LIGHT_GREY;
        yellowOnGreyTheme.buttonFontColor_selected = Color.TURQUOISE;
        yellowOnGreyTheme.selectionColor = "orange";
        yellowOnGreyTheme.focusBorderColor = "orange";
        yellowOnGreyTheme.focusBorderColor_editView = "green";
        Theme.yellowOnGreyTheme = yellowOnGreyTheme;
    }
}