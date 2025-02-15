import {Color} from "@/ui/Color";
import {Font} from "@/ui/Font";

export class Theme {
    fontColor : string;
    backgroundColor : string;
    secondBackgroundColor: string;
    buttonFontColor: string;
    markColor: string;
    secondMarkColor : string;
    focusBorderColor: string;
    highlight: string;
    success : string;
    failure : string;
    meta: string;
    font: string;
    fontSize: string;
    containerColor: string;

    static default() : Theme {
        let theme = new Theme();
        theme.fontColor = 'unset';
        theme.backgroundColor = 'white';
        theme.secondBackgroundColor = Color.LIGHT_GREY;
        theme.buttonFontColor = 'grey';
        theme.markColor = '#efefef';
        theme.secondMarkColor = 'green';
        theme.focusBorderColor = 'orange';
        theme.highlight = Color.LIGHT_BEIGE;
        theme.success = 'green';
        theme.failure = 'red';
        theme.meta = 'blue';
        theme.font = 'unset';
        theme.fontSize = '1rem';
        theme.containerColor = Color.LIGHT_GREY;
        return theme;
    }

    static elegant() : Theme {
        let theme = new Theme();
        theme.fontColor = Color.NEW_DARK_VIOLETTE;
        theme.backgroundColor = Color.LIGHT_BEIGE;
        theme.secondBackgroundColor = Color.LIGHT_GREY;
        theme.buttonFontColor = 'grey';
        theme.markColor = Color.LIGHT_GREY;
        theme.secondMarkColor = 'green';
        theme.focusBorderColor = 'orange';
        theme.highlight = 'green';
        theme.success = 'green';
        theme.failure = 'red';
        theme.meta = 'blue';
        theme.font = Font.ELEGANT;
        theme.fontSize = '1rem';
        theme.containerColor = Color.LIGHT_GREY;
        return theme;
    }
}