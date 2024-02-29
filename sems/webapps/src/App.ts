import { DEFAULT_EXPANDED, OVERVIEW_ADDR } from "./Consts";
import { DetailsData } from "./data/DetailsData";
import { ObjectLoader } from "./data/ObjectLoader";
import { RemoteProperties } from "./data/RemoteProperties";
import { EventTypeInfo } from "./EventTypeInfo";
import { Events } from "./general/Events";
import { General } from "./general/General";
import { KeyEvent } from "./general/KeyEvent";
import { MapWithPrimitiveStringsAsKey } from "./general/MapWithPrimitiveStringsAsKey";
import { getPrivateCode } from "./privateCode/privateCode";
import { SemsServer } from "./SemsServer";
import { TestApp } from "./test/TestApp";
import { TMP_VERSION } from "./Version";
import { Column } from "./view/Column";
import { ColumnManager } from "./view/ColumnManager";
import { KeyActionDefinition } from "./view/KeyActionDefinition";
import { KeyEventDefinition } from "./view/KeyEventDefinition";
import { UserInterfaceObject } from "./view/UserInterfaceObject";
import { View } from "./view/View";
import {Theme} from "./Theme";
import {Color} from "./Color";

export class App {

    static LOCAL_MODE : boolean = true;
    static EN_VERSION : boolean = false;
    static TEST_MODE : boolean = false;
    static log : boolean;
    static ABOUT_OBJ : string;
    static CONTENT_OBJ : string;

    // assert: an object in clipboad is loaded
    static clipboard : string;
    static obj_in_clipboard_lost_context : boolean = false;

    static focusedVisualObject;
    
    static user : string = null;
    static pw : string = null;
    static currentWritingLocation = "1";

    static objProperties = new RemoteProperties();
    static objEvents = new Events();

    static LIST_OF_DELETED_OBJECTS = "1-60449731";

    // Mapping von KeyEvents auf EventTypes. (Wird von KeyEventDefinition erzeugt.)
    static keyMap = new MapWithPrimitiveStringsAsKey();
    static keyMap_readView = new MapWithPrimitiveStringsAsKey();

    static header : HTMLDivElement;

    static widthCalculationSpan;

    // Wird für Komponenten verwendet, welche keinen JavaScript-Fokus nehmen können.
    // Das sind insbesondere StringRelationshipView und Column.
    static manualFocus;

    static focusedUIO : UserInterfaceObject;

    static theme : Theme;

    private static globalKeyActions : MapWithPrimitiveStringsAsKey;

    static fontFamily = "Times New Roman";
    static fontSize = "16px";

    static draggedUIO : UserInterfaceObject;
    static hrefEnding : string;

    static fcDomain = "demoDomain.de";

    static onlyOneColumn : boolean;

    static whitespaceIsDown : boolean = false;

    static runApp() {
        console.log("App-v" + TMP_VERSION);
        App.extractHrefEnding();
        EventTypeInfo.init();
        App.dynamicConfiguration();
        App.keyMap = new KeyEventDefinition().createKeyMap();
        App.keyMap_readView = new KeyEventDefinition().createKeyMap_normalMode();
        App.createGlobalKeyBindings();
        if (App.TEST_MODE) {
            document.body.appendChild(new TestApp().getUiElement());
            document.body.appendChild(App.createPlaceholderDiv());
        } else {
            if (App.LOCAL_MODE) {
                App.createLocal();
            } else {
                App.createWebsite();
            }
        }
    }

    static getUrlParams() : URLSearchParams {
        let urlParams = new URLSearchParams(window.location.search);
        return urlParams;
    }

    static extractHrefEnding() {
        let href = window.location.href;
        let index = window.location.protocol.length + 2 + window.location.hostname.length; // protocoll is http: or https: , hostname is the (sub)domain
        App.hrefEnding = href.substring(index);
        if (General.primEquals(window.location.hostname, "localhost")) {
            App.hrefEnding = App.hrefEnding.substring(5); // remove port
        }
    }

    static isLocal() : boolean {
        return General.primEquals(window.location.hostname, "localhost");
    }
    
    static dynamicConfiguration() {
        App.setIsEnglishVersion();
        App.setIsTestVersion();
        App.setLOCAL_MODE();
        App.setLog();
    }
    
    static setIsEnglishVersion() {
        App.EN_VERSION = App.hrefEnding.startsWith("/en");
    }

    static setIsTestVersion() {
        App.TEST_MODE = App.hrefEnding.startsWith("/?mode=test");
    }

    static setLog() {
        App.log = App.hrefEnding.startsWith("/?log");
    }

    static setLOCAL_MODE() {
        if (App.isLocal()) {
            if (App.hrefEnding.startsWith("/?fc")) {
                App.LOCAL_MODE = false;
            } else {
                App.LOCAL_MODE = true;
            }
        } else {
            App.LOCAL_MODE = false;
        }
    }

    static createGlobalKeyBindings() {
        App.globalKeyActions = KeyActionDefinition.createKeyActions_Global();
        window.onkeydown = function(ev: KeyboardEvent) {
            App.globalKeyDown(ev);
        };
        window.onkeyup = function(ev: KeyboardEvent) {
            App.globalKeyUp(ev);
        };
    }

    private static globalKeyDown(ev: KeyboardEvent) {
        if (ev.key == " ") {
            App.whitespaceIsDown = true;
        }
        let keyEvent = KeyEvent.createFromKeyboardEvent(ev);
        let compareString = keyEvent.createCompareString();
        if (App.globalKeyActions.has(compareString)) {
            ev.preventDefault();
            App.globalKeyActions.get(compareString)();
        }
        if (ev.target == document.body) {
            App.manualFocus.triggerKeyDown(ev);
            // avoid surprising scrolling
            if (ev.key == " ") {
                ev.preventDefault();
            }
        }
    }

    private static globalKeyUp(ev: KeyboardEvent) {
        if (ev.key == " ") {
            App.whitespaceIsDown = false;
        }
        let keyEvent = KeyEvent.createFromKeyboardEvent(ev);
        let compareString = keyEvent.createCompareString();
        if (App.globalKeyActions.has(compareString)) {
            ev.preventDefault();
        }
    }

    static getObject() : string {
        const url : string = window.location.href;
        if (url.split("?").length > 1) {
            return url.split("?")[1];
        }
        return null;
    }

    static createWebsite() {
        App.setOnlyOneColumn_pres_mode();
        App.theme.backgroundColor = "rgb(204, 255, 204)"; // hellgrün
        App.theme.fontColor = "rgb(255, 102, 153)"; // hell-violett
        App.fontFamily = "Calibri";
        App.fontSize = "20px";
        document.body.style.backgroundColor = App.theme.backgroundColor;
        document.body.style.margin = "0rem";
        document.body.style.overflow = "hidden";
        ColumnManager.init();
        document.body.appendChild(ColumnManager.uiElement);
        if (App.LOCAL_MODE) {
            setTimeout(function() {
                ColumnManager.columns[0].focusColumnOrFirstObject();
            }, 50);
        }
    }

    static createLocal() {
        App.theme = getPrivateCode().getTheme();
        App.header = document.createElement("div");
        document.body.appendChild(App.header);

        document.body.style.backgroundColor = App.theme.backgroundColor;
        document.body.style.margin = "0rem";
        //
        document.body.style.overflow = "hidden";
        ColumnManager.init();
        document.body.appendChild(ColumnManager.uiElement);
        //
        setTimeout(function() {
            ColumnManager.columns[0].focusColumnOrFirstObject();
        }, 50);
        ObjectLoader.ensureLoaded(OVERVIEW_ADDR, General.emptyFunction);
        // getPrivateCode().addHeader();
    }

    static createPlaceholderDiv() {
        let placeholderDiv = document.createElement("div");
        placeholderDiv.style.height = (window.innerHeight * View.placeholderDiv_Factor) + "px";
        return placeholderDiv;
    }

    public static getUserInterfaceObjectForSemsAddress(semsAddress : string, callback : ((uio : UserInterfaceObject) => void)) {
        ObjectLoader.ensureLoaded(semsAddress, function() {
            callback(View.createFromSemsAddress(semsAddress, null));
        });
    }

    public static getHtmlElementForSemsAddress(semsAddress : string, callback : Function) {
        App.getUserInterfaceObjectForSemsAddress(semsAddress, function(userInterfaceObject : UserInterfaceObject) {
            callback(userInterfaceObject.getUiElement());
        });
    }

    static getResourcesPath() : string {
        let path = "resources/";
        if (App.EN_VERSION) {
            path = "../" + path;
        }
        return path;
    }

    static addToDeletedList(semsAddress : string) {
        ObjectLoader.ensureLoaded(App.LIST_OF_DELETED_OBJECTS, function() {
            let list : DetailsData = DetailsData.map.get(App.LIST_OF_DELETED_OBJECTS);
            list.ensureDetailsAreLoaded(function() {
                let maxLength = 100;
                if (list.getDetails().length > maxLength - 1) {
                    list.deleteDetail(list.getDetails()[maxLength - 1], maxLength - 1);
                }
                list.createLinkDetailAtPostion(semsAddress, 0);
            })
        });
    }

    static deleteManualFocusAndFocusedUIO() {
        if (App.manualFocus != null) {
            App.manualFocus.blur();
        }
        App.focusedUIO = null;
    }

    static deleteFocus() {
        let activeElement : any = document.activeElement;
        activeElement.blur();
        App.deleteManualFocusAndFocusedUIO();
    }

    static openObject(address : string) {
        let columWithFewestContet : Column = ColumnManager.getColumnWithFewestContent();
        ObjectLoader.ensureLoaded(address, function() {
            columWithFewestContet.insertObjectAtBottom(address);
        });
    }

    static setOnlyOneColumn_pres_mode() {
        App.onlyOneColumn = ColumnManager.getNumberOfColumnsByWindowWidth_presMode() == 1;
    }

    static createLabeledText_ensureLoaded(label : string, text : string, callback : Function) {
        SemsServer.createTextObject(label, addressOfLabelObject => {
            SemsServer.createTextObject(text, addressOfDetail => {
                SemsServer.createDetail(addressOfLabelObject, addressOfDetail, () => {
                    ObjectLoader.ensureLoaded(addressOfLabelObject, () => {
                        App.objProperties.setProperty(addressOfLabelObject, DEFAULT_EXPANDED, false);
                        callback(addressOfLabelObject);
                    });
                });
            });
        });
    }

}