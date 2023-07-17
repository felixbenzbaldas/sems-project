import { App } from "../App";
import { KeyEvent } from "../general/KeyEvent";
import { MapWithPrimitiveStringsAsKey } from "../general/MapWithPrimitiveStringsAsKey";
import { getPrivateCode } from "../privateCode/privateCode";
import { SemsServer } from "../SemsServer";
import { Textgeneration } from "../semsWeb/Textgeneration";
import { ColumnManager } from "./ColumnManager";
import { TextObjectViewController } from "./TextObjectViewController";
import { UserInterfaceObject } from "./UserInterfaceObject";


// Diese Klasse wird benutzt, um Mappings von KeyEvents auf Functions zu erstellen.
// Hier wird also einem KeyEvent direkt ein Codestück zugeordnet.
export class KeyActionDefinition {
    
    public static createKeyActions_TextObject(textObjectViewController : TextObjectViewController) : MapWithPrimitiveStringsAsKey {
        let map = new MapWithPrimitiveStringsAsKey();
        let uio : UserInterfaceObject = textObjectViewController.getUserInterfaceObject();
        getPrivateCode().addKeyEvents(map, textObjectViewController);
        KeyActionDefinition.addKeyEvent(map, function(keyEvent : KeyEvent) {
            keyEvent.ctrl = true;
            keyEvent.key = "2";
            }, function() {
                textObjectViewController.moveToCurrentHouse();
        });
        // KeyActionDefinition.addKeyEvent(map, function(keyEvent : KeyEvent) {
        //     keyEvent.sk = true;
        //     keyEvent.key = "b";
        //     }, function() {
        //         uio.uiElement.scrollIntoView();
        // });
        KeyActionDefinition.addKeyEvent(map, function(keyEvent : KeyEvent) {
            keyEvent.ctrl = true;
            keyEvent.key = "f";
            }, function() {
                textObjectViewController.toggleDefaultExpandedEvent();
        });
        KeyActionDefinition.addKeyEvent(map, function(keyEvent : KeyEvent) {
            keyEvent.ctrl = true;
            keyEvent.key = "+";
            }, function() {
                textObjectViewController.togglePrivateEvent();
        });
        KeyActionDefinition.addKeyEvent(map, function(keyEvent : KeyEvent) {
            keyEvent.ctrl = true;
            keyEvent.key = "g";
            }, function() {
                textObjectViewController.toggleLogicalContextEvent();
        });
        KeyActionDefinition.addKeyEvent(map, function(keyEvent : KeyEvent) {
            keyEvent.key = "Enter";
            }, function() {
                uio.onEnterEvent();
        });
        KeyActionDefinition.addKeyEvent(map, function(keyEvent : KeyEvent) {
            keyEvent.ctrl = true;
            keyEvent.key = "0";
            }, function() {
                Textgeneration.generateEmail(uio);
        });
        KeyActionDefinition.addKeyEvent(map, function(keyEvent : KeyEvent) {
            keyEvent.ctrl = true;
            keyEvent.shift = true;
            keyEvent.key = "O";
            }, function() {
                textObjectViewController.moveTopLevelObject_backward();
        });
        KeyActionDefinition.addKeyEvent(map, function(keyEvent : KeyEvent) {
            keyEvent.ctrl = true;
            keyEvent.shift = true;
            keyEvent.key = "L";
            }, function() {
                textObjectViewController.moveTopLevelObject_forward();
        });
        KeyActionDefinition.addKeyEvent(map, function(keyEvent : KeyEvent) {
            keyEvent.ctrl = true;
            keyEvent.shift = true;
            keyEvent.key = ")";
            }, function() {
                textObjectViewController.openObject();
        });
        // SCROLL_BACKWARDS
        KeyActionDefinition.addKeyEvent(map, function(keyEvent : KeyEvent) {
            keyEvent.sk = true;
            keyEvent.key = "t";
            }, function() {
                let column = textObjectViewController.getColumn();
                column.smoothScroll_additive(-280);
        });
        // SCROLL_FORWARDS
        KeyActionDefinition.addKeyEvent(map, function(keyEvent : KeyEvent) {
            keyEvent.sk = true;
            keyEvent.key = "b";
            }, function() {
                let column = textObjectViewController.getColumn();
                column.smoothScroll_additive(280);
        });
        KeyActionDefinition.addKeyEvent(map, function(keyEvent : KeyEvent) {
            keyEvent.sk = true;
            keyEvent.key = "1";
            }, function() {
                textObjectViewController.exportRawText();
        });
        KeyActionDefinition.addKeyEvent(map, function(keyEvent : KeyEvent) {
            keyEvent.sk = true;
            keyEvent.key = "2";
            }, function() {
                textObjectViewController.export_fourDays_safe_html();
        });
        KeyActionDefinition.addKeyEvent(map, function(keyEvent : KeyEvent) {
            keyEvent.sk = true;
            keyEvent.key = "y";
            }, function() {
                uio.onPasteNextEvent();
        });
        KeyActionDefinition.addKeyEvent(map, function(keyEvent : KeyEvent) {
            keyEvent.ctrl = true;
            keyEvent.key = "Enter";
            }, function() {
                textObjectViewController.headText.toReadView();
        });
        return map;
    }

    public static createKeyActions_TextObject_readView(textObjectViewController : TextObjectViewController) : MapWithPrimitiveStringsAsKey {
        let map = new MapWithPrimitiveStringsAsKey();
        let uio : UserInterfaceObject = textObjectViewController.getUserInterfaceObject();
        KeyActionDefinition.addKeyEvent(map, function(keyEvent : KeyEvent) {
            keyEvent.key = "y";
            }, function() {
                uio.onPasteNextEvent();
        });
        KeyActionDefinition.addKeyEvent(map, function(keyEvent : KeyEvent) {
            keyEvent.ctrl = true;
            keyEvent.key = "i";
            }, function() {
                textObjectViewController.headText.toEditView();
        });
        KeyActionDefinition.addKeyEvent(map, function(keyEvent : KeyEvent) {
            keyEvent.sk = true;
            keyEvent.key = "s";
            }, function() {
                textObjectViewController.search();
        });
        KeyActionDefinition.addKeyEvent(map, function(keyEvent : KeyEvent) {
            keyEvent.sk = true;
            keyEvent.key = "u";
            }, function() {
                textObjectViewController.searchUsages();
        });
        return map;
    }

    public static createKeyActions_Global() : MapWithPrimitiveStringsAsKey {
        let map = new MapWithPrimitiveStringsAsKey();
        if (App.LOCAL_MODE) {
            KeyActionDefinition.addKeyEvent(map, function(keyEvent : KeyEvent) {
                keyEvent.ctrl = true;
                keyEvent.key = "s";
                }, function() {
                    if (App.focusedUIO.tovcOpt != null) {
                        let tovc : TextObjectViewController = App.focusedUIO.tovcOpt;
                        tovc.headText.updateTextProperty();
                    }
                    SemsServer.save();
            });

            KeyActionDefinition.addKeyEvent(map, function(keyEvent : KeyEvent) {
                keyEvent.ctrl = true;
                keyEvent.key = "l";
                }, function() {
                    if (App.focusedUIO.tovcOpt != null) {
                        let tovc : TextObjectViewController = App.focusedUIO.tovcOpt;
                        tovc.headText.updateTextProperty();
                    }
                    console.log("saveChanges");
                    SemsServer.saveChanges();
            });

            KeyActionDefinition.addKeyEvent(map, function(keyEvent : KeyEvent) {
                keyEvent.ctrl = true;
                keyEvent.key = "6";
              }, function() {
                if (App.currentWritingLocation == "0") {
                    App.currentWritingLocation = "1";
                } else {
                    App.currentWritingLocation = "0";
                }
                alert("changed writing location to " + App.currentWritingLocation);
            });
            KeyActionDefinition.addKeyEvent(map, function(keyEvent : KeyEvent) {
                keyEvent.ctrl = true;
                keyEvent.key = "4";
                }, function() {
                    ColumnManager.adaptWidthOfColumns();
            });
            KeyActionDefinition.addKeyEvent(map, function(keyEvent : KeyEvent) {
                keyEvent.ctrl = true;
                keyEvent.key = "9";
                }, function() {
                    SemsServer.clean();
            });
            KeyActionDefinition.addKeyEvent(map, function(keyEvent : KeyEvent) {
                keyEvent.ctrl = true;
                keyEvent.key = "7";
                }, function() {
                    SemsServer.update();
            });
        }
        return map;
    }
    
    static addKeyEvent(map : MapWithPrimitiveStringsAsKey, defineKeyEvent : Function, action : Function) {
        let keyEvent : KeyEvent = new KeyEvent();
        defineKeyEvent(keyEvent);
        map.set(keyEvent.createCompareString(), action);
    }
}