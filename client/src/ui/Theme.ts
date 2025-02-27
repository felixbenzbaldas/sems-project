import {Color} from "@/ui/Color";
import {Font} from "@/ui/Font";

export class Theme {

    fontColor : string;
    backgroundColor : string;
    secondBackgroundColor: string;
    buttonFontColor: string;
    markColor: string;
    secondMarkColor : string;
    focusBorderColor_viewMode: string;
    focusBorderColor_editMode: string;
    highlight: string;
    success : string;
    failure : string;
    meta: string;
    font: string;
    fontSize: string;
    containerColor: string;


    static blackWhite() : Theme {
        let theme = new Theme();
        theme.fontColor = 'unset';
        theme.backgroundColor = 'white';
        theme.secondBackgroundColor = Color.LIGHT_GREY;
        theme.buttonFontColor = 'grey';
        theme.markColor = Color.LIGHT_GREY;
        theme.secondMarkColor = 'green';
        theme.focusBorderColor_viewMode = 'orange';
        theme.focusBorderColor_editMode = 'green';
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
        theme.focusBorderColor_viewMode = 'orange';
        theme.focusBorderColor_editMode = 'green';
        theme.highlight = 'green';
        theme.success = 'green';
        theme.failure = 'red';
        theme.meta = 'blue';
        theme.font = Font.ELEGANT;
        theme.fontSize = '1rem';
        theme.containerColor = Color.LIGHT_GREY;
        return theme;
    }

    static simple() : Theme {
        let theme = new Theme();
        theme.fontColor = Color.DARK_GREY;
        theme.backgroundColor = Color.LIGHT_GREY;
        theme.secondBackgroundColor = Color.LIGHT_GREY;
        theme.buttonFontColor = Color.GREYER;
        theme.markColor = Color.LIGHT_GREY;
        theme.secondMarkColor = 'green';
        theme.focusBorderColor_viewMode = Color.GREY;
        theme.focusBorderColor_editMode = 'green';
        theme.highlight = Color.LIGHT_BEIGE;
        theme.success = 'green';
        theme.failure = 'red';
        theme.meta = Color.GREYER;
        theme.font = Font.SIMPLE;
        theme.fontSize = '1rem';
        theme.containerColor = Color.LIGHT_GREY;
        return theme;
    }
}