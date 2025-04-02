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
    linkFontColor: string;
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
        theme.linkFontColor = 'default';
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
        theme.linkFontColor = Color.DARK_BLUE;
        theme.containerColor = Color.LIGHT_GREY;
        return theme;
    }

    static simple() : Theme {
        let theme = new Theme();
        theme.fontColor = Color.MORE_MORE_GREYER;
        theme.backgroundColor = Color.LIGHT_GREY;
        theme.secondBackgroundColor = Color.LIGHT_GREY;
        theme.buttonFontColor = 'hsl(0,0%,54%)';
        theme.markColor = Color.LIGHT_GREY;
        theme.secondMarkColor = 'green';
        theme.focusBorderColor_viewMode = 'hsl(200, 20%, 77%)';
        theme.focusBorderColor_editMode = 'green';
        theme.highlight = Color.LIGHT_BEIGE;
        theme.success = 'green';
        theme.failure = 'red';
        theme.meta = Color.GREYER;
        theme.font = Font.MINIMALISTIC;
        theme.fontSize = '1rem';
        theme.linkFontColor = Color.DARK_GREY;
        theme.containerColor = Color.LIGHT_GREY;
        return theme;
    }

    static dark() : Theme {
        let theme = new Theme();
        theme.fontColor = 'red';
        theme.backgroundColor = 'hsl(0, 0%, 5%)';
        theme.secondBackgroundColor = 'hsl(0, 0%, 25%)';
        theme.buttonFontColor = Color.BEIGE_ORANGE;
        theme.markColor = Color.BEIGE_ORANGE;
        theme.secondMarkColor = 'green';
        theme.focusBorderColor_viewMode = Color.BEIGE_ORANGE;
        theme.focusBorderColor_editMode = Color.SKIN;
        theme.highlight = Color.LIGHT_BEIGE;
        theme.success = 'green';
        theme.failure = 'red';
        theme.meta = 'red';
        theme.font = Font.STRONG;
        theme.fontSize = '1rem';
        theme.linkFontColor = Color.DARK_VIOLETTE;
        theme.containerColor = Color.LIGHT_GOLD;
        return theme;
    }

    static darkColorful() : Theme {
        let theme : Theme = new Theme();
        theme.secondBackgroundColor = Color.GREY_2;
        theme.secondMarkColor = 'green';
        theme.highlight = Color.LIGHT_BEIGE;
        theme.success = 'green';
        theme.failure = 'red';
        theme.meta = 'blue';
        theme.font = 'unset';
        theme.fontSize = '1rem';
        theme.linkFontColor = 'default';
        theme.containerColor = Color.LIGHT_GREY;
        //
        theme.backgroundColor = Color.BLACK;
        theme.fontColor = Color.ORANGE;
        theme.buttonFontColor = Color.DARK_BEIGE;
        theme.markColor = Color.BLUE;
        theme.focusBorderColor_viewMode = Color.RED;
        theme.focusBorderColor_editMode = Color.GREEN;
        return theme;
    }
}