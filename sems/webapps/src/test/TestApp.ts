import { CONTEXT, DEFAULT_EXPANDED, DETAILS, LOAD_DEPENDENCIES, PROPERTIES, SEMS_ADDRESS, TEXT } from "../Consts";
import { General } from "../general/General";
import { SemsServer } from "../SemsServer";
import { View } from "../view/View";
import { array, empty, hasProperty, is, not } from "./hamjest/hamjest";
import { MiscellaneousTests } from "./MiscellaneousTests";
import { TestCase } from "./TestCase";

export class TestApp {
    
    // configuration
    static CURRENT = false;
    static BASIS = true;
    static MISCELLANEOUS = false;
    
    ///////////////////////////////////////////////////////////////////////

    static MIDDLE_DELAY : number = 300;
    static BIG_DELAY : number = 700;
    private uiElement = null;

    public static currentTests: Array<TestCase> = [];
    public static basisTests: Array<TestCase> = [];
    public static miscellaneousTests: Array<TestCase> = [];

    private template() {
        // // - - -  Vorlage - - - - - - - - - -
        // if (true) {
        //     let test = new TestCase();
        //     testsList.push(test);
        //     test.processTest = function () {
                
        //     };
        // }
        // // - - - - - - - - - - - - - - - - - - 
    }
    
    private basisTests() {
        let testsList: Array<TestCase> = TestApp.basisTests;
        //
        if (true) {
            let test = new TestCase();
            testsList.push(test);
            test.processTest = function () {
                test.autoTestCase("TextObject erzeugen, RequestObjectFromServer");
                if (true) {
                    let name = "demoObject" + Math.random();
                    SemsServer.createTextObject(name, function (semsAddress) {
                        TestApp.getJsonObject(semsAddress, function(json) {
                            let propsJson = json[PROPERTIES];
                            test.assertThat(propsJson[TEXT], is(name));
                            test.assertThat(json[DETAILS], is(array()));
                            test.assertThat_withDescription("default expanded", propsJson[DEFAULT_EXPANDED], is(true));
                        });
                    });
                    if (true) {
                        let text = "sonderzeichen-%?<>#~\"" + Math.random();
                        SemsServer.createTextObject(text, function (semsAddress) {
                            TestApp.getJsonObject(semsAddress, function(json) {
                                let propsJson = json[PROPERTIES];
                                test.assertThat(propsJson[TEXT], is(text));
                            });
                        });
                    }
                }
            };
        }
        //
        if (true) {
            let test = new TestCase();
            testsList.push(test);
            test.processTest = function () {
                test.heading("Context UI-Test");
                let detail;
                SemsServer.createTextObject("context", function (context_local) {
                    SemsServer.createTextObject("detail", function (detail_local) {
                        detail = detail_local;
                        SemsServer.createDetail(context_local, detail_local, function () {
                        });
                    });
                });
                TestApp.middleDelay(function () {
                    test.createTestFieldAndAddSemsObject(detail);
                });
                test.test("Der Kontext wird unterhalb des Details zum Aufklappen angeboten");
                test.test("Unterhalb von context wird kein ContextController angezeigt");
                test.test("Unterhalb des Details im Kontext wird kein Kontext angezeigt");
                test.aktion("STR + g auf detail");
                test.test("Der Context wird gelöscht");
                test.note("...");
                test.test("Wenn ein Objekt keine Relationships aber ein visuellen Sub-Kontext hat, wird das Objekt trotzdem einklappbar-machbar sein.")
                test.test("Der Kontext wird ggf. auch beim Aufklappen angezeigt.");
                test.test("Ein neues Detail wird immer erst nach dem Kontext eingefügt");
                test.test("Der Body verschwindet nicht, wenn man das letzte Detail löscht, aber noch der Context zu sehen ist.");
                test.test("Wenn ein Objekt im Kontext angezeigt wird, dann wird dies durch '-' dargestellt.");
                test.test("STR + g: Wechsel zwischen ContextDetail und LinkDetail");
            };
        }
        //
        if (true) {
            let test = new TestCase();
            testsList.push(test);
            test.processTest = function () {
                test.autoTestCase("createDetailAtPosition");
                let textOfInsertedDetail = "insertedDetail-<>ü/%";
                let fromObject;
                let insertedDetail = "";
                SemsServer.createTextObject("fromObject", function (fromObject_local) {
                    fromObject = fromObject_local;
                    SemsServer.createTextObject("toObject1", function (toObject1) {
                        SemsServer.createDetail(fromObject_local, toObject1, function () {
                            SemsServer.createTextObject("toObject2", function (toObject2) {
                                SemsServer.createDetail(fromObject_local, toObject2, function () {
                                    SemsServer.createContextDetailAtPosition(textOfInsertedDetail, 1, fromObject_local, function(insertedDetail_local) {
                                        insertedDetail = insertedDetail_local;
                                    });
                                });
                            });
                        });
                    });
                });
                setTimeout(() => {
                    TestApp.getJsonObject(fromObject, function(jsonObject) {
                        test.assertThat(jsonObject.details.length, is(3));
                        test.assertThat(jsonObject.details[1], is(insertedDetail));
                    });
                }, TestApp.BIG_DELAY);
            };
        }
        //
        if (true) {
            let test = new TestCase();
            testsList.push(test);
            test.processTest = function () {
                test.heading("Detail per UI erzeugen");
                let testObject;
                SemsServer.createTextObject("testObject1", function (testObject_local) {
                    testObject = testObject_local;
                    SemsServer.createTextObject("testObject2", function (testObject2) {
                        SemsServer.createDetail(testObject_local, testObject2, function () {
                        });
                    });
                });
                TestApp.middleDelay(function () {
                    test.createTestFieldAndAddSemsObject(testObject);
                });
                test.aktion("Fokus auf testObject1");
                test.aktion("STR + d (Tastenkürzel, um Detail zu erzeugen)");
                test.test("neues Detail wird unterhalb von testObject1 erzeugt");
                test.test("das neue Objekt ist ganz am Anfang der Liste, also vor testObject2");
                test.test("das neue Objekt erhält den Fokus");
                test.note("Wenn ein Objekt eingeklappt ist und Relationships hat, soll es nicht möglich sein, ein Detail zu erzeugen.")
                test.aktion("testObject1 einklappbar machen und einklappen. Dann STR + d");
                test.test("Es wird kein neues Detail erzeugt, sondern lediglich testObject1 ausgeklappt");
            };
        }
        //
        if (true) {
            let test = new TestCase();
            testsList.push(test);
            test.processTest = function () {
                test.autoTestCase("Detail erzeugen");
                SemsServer.createTextObject("context", function (context) {
                    SemsServer.createTextObject("detail", function (detail) {
                        SemsServer.createDetail(context, detail, function () {
                            TestApp.getJsonObject(context, function(jsonObject) {
                                test.assertThat_withDescription("JSON-Validierung", jsonObject, hasProperty("details"));
                                test.assertThat(jsonObject.details, is(not(empty)));
                                test.assertThat(jsonObject.details[0], is(detail));
                            });
                            TestApp.getJsonObject(detail, function(jsonObject) {
                                test.assertThat_withDescription("JSON-Validierung", jsonObject[PROPERTIES], hasProperty("context"));
                                test.assertThat(jsonObject[PROPERTIES][CONTEXT], is(context));
                            });
                            setTimeout(() => {
                                SemsServer.setProperty(detail, CONTEXT, null);
                                setTimeout(() => {
                                    TestApp.getJsonObject(detail, function(jsonObject) {
                                        test.assertThat(jsonObject[PROPERTIES][CONTEXT], is(null));
                                    });
                                    
                                }, TestApp.BIG_DELAY);
                            }, TestApp.BIG_DELAY);
                        });
                    });
                });
            };
        }
        //
        if (true) {
            let test = new TestCase();
            testsList.push(test);
            test.processTest = function () {
                test.autoTestCase("Text von TextObject verändern");
                if (true) {
                    let name = "originalText";
                    SemsServer.createTextObject(name, function (semsAddress) {
                        let newName = "newText" + Math.random();
                        SemsServer.setProperty(semsAddress, TEXT, newName);
                        TestApp.middleDelay(function () {
                            TestApp.getJsonObject(semsAddress, function(jsonObject) {
                                test.assertThat(jsonObject[PROPERTIES][TEXT], is(newName));
                            });
                        });
                    });
                }
                if (true) {
                    let name = "originalText";
                    SemsServer.createTextObject(name, function (semsAddress) {
                        let newName = "<>%!ü" + Math.random();
                        SemsServer.setProperty(semsAddress, TEXT, newName);
                        TestApp.middleDelay(function () {
                            TestApp.getJsonObject(semsAddress, function(jsonObject) {
                                test.assertThat(jsonObject[PROPERTIES][TEXT], is(newName));
                            });
                        });
                    });
                }
            };
        }
        //
        if (true) {
            let test = new TestCase();
            testsList.push(test);
            test.processTest = function () {
                test.heading("Text von TextObject per UI ändern");
                let testObject;
                SemsServer.createTextObject("testText", function (testObject_local) {
                    testObject = testObject_local;
                    SemsServer.createTextObject("testText2", function (testObject2) {
                        SemsServer.createDetail(testObject_local, testObject2, function () {
                        });
                    });
                });
                TestApp.middleDelay(function () {
                    test.createTestFieldAndAddSemsObject(testObject);
                });
                test.test("Text lässt sich ändern (contentEditable)");
                test.aktion("Text von Objekt ändern");
                test.aktion("Fokus von TextObject weg nehmen");
                test.test("Text wird im Server geändert");
            };
        }
        //
        if (true) {
            let test = new TestCase();
            testsList.push(test);
            test.processTest = function () {
                test.heading("Detail per UI löschen");
                let testObject;
                SemsServer.createTextObject("testObject1", function (testObject_local) {
                    testObject = testObject_local;
                    SemsServer.createTextObject("testObject2", function (testObject2) {
                        SemsServer.createDetail(testObject_local, testObject2, function () {
                        });
                    });
                    SemsServer.createTextObject("testObject3", function (testObject3) {
                        SemsServer.createDetail(testObject_local, testObject3, function () {
                        });
                    });
                });
                TestApp.middleDelay(function () {
                    test.createTestFieldAndAddSemsObject(testObject);
                });
                test.aktion("Fokus auf testObject2");
                test.aktion("STR + Shift + Backspace (Tastenkürzel, um Detail zu löschen)");
                test.test("testObject2 verschwindet");
                test.test("falls testObject2 das letzte Body-Element ist, dann wird der Body ausgeblendet");
                test.test("Es wird der korrekte Delete-Request an den Server gesendet (siehe Netzwerkanalyse)");
            };
        }
        //
        if (true) {
            let test = new TestCase();
            testsList.push(test);
            test.processTest = function () {
                test.autoTestCase("getDetails - alle Details mit einem HTTP-Request erhalten");
                let context;
                SemsServer.createTextObject("context", function (context_local) {
                    context = context_local;
                    SemsServer.createTextObject("detail 1", function (detail1) {
                        SemsServer.createDetail(context_local, detail1, function () {
                        });
                        SemsServer.createTextObject("detail 1.1", function (detail11) {
                            SemsServer.createDetail(detail1, detail11, function () {
                            });
                        });
                        SemsServer.createTextObject("detail 2", function (detail2) {
                            SemsServer.createDetail(context_local, detail2, function () {
                            });
                            SemsServer.setProperty(detail2, DEFAULT_EXPANDED, false);
                            SemsServer.createTextObject("detail 2.1", function (detail21) {
                                SemsServer.createDetail(detail2, detail21, function () {
                                });
                            });
                        });
                    });
                });
                setTimeout(() => {
                    SemsServer.getDetails(context, function(json) {
                        test.assertThat(json[DETAILS].length, is(2));
                    });
                }, TestApp.BIG_DELAY);
            };
        }
        //
        if (true) {
            let test = new TestCase();
            testsList.push(test);
            test.addToCurrent();
            test.processTest = function () {
                test.heading("TextObject mit mehreren Detail-Beziehungen");
                let context;
                SemsServer.createTextObject("context", function (context_local) {
                    context = context_local;
                    SemsServer.createTextObject("detail 1", function (detail1) {
                        SemsServer.createDetail(context_local, detail1, function () {
                        });
                        SemsServer.createTextObject("detail 1.1", function (detail11) {
                            SemsServer.createDetail(detail1, detail11, function () {
                            });
                        });
                    });
                    SemsServer.createTextObject("detail 2", function (detail2) {
                        SemsServer.createDetail(context_local, detail2, function () {
                        });
                        SemsServer.setProperty(detail2, DEFAULT_EXPANDED, false);
                        SemsServer.createTextObject("detail 2.1", function (detail21) {
                            SemsServer.createDetail(detail2, detail21, function () {
                            });
                        });
                    });
                });
                setTimeout(function () {
                    test.createTestFieldAndAddSemsObject(context);
                }, TestApp.BIG_DELAY);
                test.test("Es erscheinen insgesamt vier Objekte");
                test.test("Alle Objekte außer 'detail 2' sind ausgeklappt (wegen isDefaultExpanded)");
                test.test("Alle Objekte außer 'detail 2' sind nicht anklickbar (wegen isDefaultExpanded)");
                test.test("Alle Details werden mit einem einzigen Request geliefert");
                test.test("Bei einem Detail mit defaultExpanded werden auch die Details des Details geliefert");
                test.test("Bei einem Detail mit !defaultExpanded wird lediglich hasDetails geliefert (keine IDs der Details)");
            };
        }
        //
        if (true) {
            let test = new TestCase();
            testsList.push(test);
            test.processTest = function () {
                test.autoTestCase("Objekt an Position einfügen");
                let context;
                let detail;
                SemsServer.createTextObject("context", function (context_local) {
                    context = context_local;
                    SemsServer.createTextObject("detail", function (detail_local) {
                        detail = detail_local;
                        SemsServer.insertLinkDetailAtPosition(context, detail_local, 0);
                    });
                });
                TestApp.middleDelay(function() {
                    TestApp.getJsonObject(context, function(jsonContext) {
                        test.assertThat(jsonContext.details[0], is(detail));
                    });
                });
            };
        }
        if (true) {
            let test = new TestCase();
            testsList.push(test);
            test.processTest = function () {
                test.heading("Objekt kopieren");
                let context;
                SemsServer.createTextObject("context", function (context_local) {
                    context = context_local;
                    SemsServer.createTextObject("detail 1", function (detail1) {
                        SemsServer.createDetail(context_local, detail1, function () {
                        });
                        SemsServer.createTextObject("detail 1.1", function (detail11) {
                            SemsServer.createDetail(detail1, detail11, function () {
                            });
                        });
                    });
                    SemsServer.createTextObject("detail 2", function (detail2) {
                        SemsServer.createDetail(context_local, detail2, function () {
                        });
                    });
                });
                setTimeout(function () {
                    test.createTestFieldAndAddSemsObject(context);
                }, TestApp.BIG_DELAY);
                //
                test.aktion("Fokus auf ein Objekt");
                test.aktion("STR + c");
                test.aktion("Fokus auf anderes Objekt");
                test.aktion("STR + v");
                test.test("Das Objekt wurde kopiert. Es erscheint unterhalb von dem Objekt auf dem STR + v gedrückt wurde");
                test.test("Das neu eingefügte Element erhält den Fokus");
            };
        }
        //
        if (true) {
            let test = new TestCase();
            testsList.push(test);
            test.processTest = function () {
                test.heading("Detail an Position per UI einfügen");
                SemsServer.createTextObject("fromObject", function (fromObject_local) {
                    SemsServer.createTextObject("toObject1", function (toObject1) {
                        SemsServer.createDetail(fromObject_local, toObject1, function () {
                            SemsServer.createTextObject("toObject2", function (toObject2) {
                                SemsServer.createDetail(fromObject_local, toObject2, function () {
                                    test.createTestFieldAndAddSemsObject(fromObject_local);
                                });
                            });
                        });
                    });
                });
                test.aktion("toObject2 anklicken");
                test.aktion("Enter drücken");
                test.test("unter toObject2 erscheint ein neues TextObject");
                test.test("das neue TextObject wird markiert");
                test.aktion("fromObject ein- und ausklappen");
                test.test("das neue TextObject ist weiterhin vorhanden");
            }
        }
        //
        if (true) {
            let test = new TestCase();
            testsList.push(test);
            test.processTest = function () {
                test.autoTestCase("Detail löschen");
                SemsServer.createTextObject("fromObject", function (fromObject) {
                    SemsServer.createTextObject("toObject", function (toObject) {
                        SemsServer.createDetail(fromObject, toObject, function () {
                            SemsServer.deleteDetail(fromObject, toObject);
                            setTimeout(function() {
                                TestApp.getJsonObject(fromObject, function(jsonObject) {
                                    test.assertThat_withDescription("fromObject has not detail", jsonObject.details, is(empty()));
                                });
                            }, TestApp.BIG_DELAY);
                        });
                    });
                });
            };
        }
        //
        if (true) {
            let test = new TestCase();
            testsList.push(test);
            test.processTest = function () {
                test.heading("Einklappbares TextObject");
                SemsServer.createTextObject("testObject1", function (testObject1) {
                    SemsServer.setProperty(testObject1, DEFAULT_EXPANDED, false);
                    SemsServer.createTextObject("testObject2", function (testObject2) {
                        SemsServer.createDetail(testObject1, testObject2, function () {
                            test.createTestFieldAndAddSemsObject(testObject1);
                        });
                    });
                });
                test.test("testObject1 ist anklickbar (underline, pointer)");
                test.test("bei Klick auf testObject1 erscheint testObject2 (testObject2 ist anfangs nicht sichtbar)");
                test.test("bei erneutem Klick verschwindet testObject2 wieder");
                test.aktion("neues Detail für testObject2");
                test.test("STR + f -> testObject2 ist anklickbar");
                test.aktion("testObject1 ein- und ausklappen")
                test.test("testObject2 ist anfangs eingeklappt");
                test.aktion("alle Details von testObject2 löschen");
                test.test("testObject2 ist nicht mehr anklickbar");
                test.aktion("erneut ein Detail für testObject2 erzeugen");
                test.test("testObject2 ist anklickbar");
            }
        }
        //
        if (true) {
            let test = new TestCase();
            testsList.push(test);
            test.processTest = function () {
                test.heading("Persistenz");
                SemsServer.requestRootObject(function(address) {
                    test.createTestFieldAndAddSemsObject(address);
                });
                test.test("Beim Server-Start werden die Daten aus einer Datei geladen");
                test.test("Mit STR + s wird der aktuelle Stand gespeichert");
                test.test("Es gibt ein Root-Element und dieses wird oben angezeigt");
            };
        }
        
        if (true) {
            let test = new TestCase();
            testsList.push(test);
            test.processTest = function () {
                test.heading("Endlos-Rekursion vermeiden");
                let objA;
                SemsServer.createTextObject("A", function(objA_local) {
                    objA = objA_local;
                    SemsServer.createContextDetailAtPosition("B", 0, objA_local, function(objB_local) {
                        SemsServer.insertLinkDetailAtPosition(objB_local, objA_local, 0);
                    });
                });
                TestApp.middleDelay(function() {
                    test.createTestFieldAndAddSemsObject(objA);
                });
                test.test("unterhalb von B wird [DUPLICATE] angezeigt. Es findet keine Endlos-Rekursion statt");
            };
        }
        
        return testsList;
    }

    public static middleDelay(callback : Function) {
        setTimeout(callback, TestApp.MIDDLE_DELAY);
    }

    public getUiElement() {
        if (this.uiElement == null) {
            this.createUiElement();
        }
        return this.uiElement;
    }

    private createUiElement() {
        this.createTests();
        //
        let testsList : Array<TestCase> = [];
        if (TestApp.CURRENT) {
            testsList = testsList.concat(TestApp.currentTests);
        } else {
            if (TestApp.BASIS) {
                testsList = testsList.concat(TestApp.basisTests);
            }
            if (TestApp.MISCELLANEOUS) {
                testsList = testsList.concat(TestApp.miscellaneousTests);
            }
        }
        //
        this.uiElement = View.createDivWithDefaultMargin();
        testsList.forEach(test => {
            test.execute();
            this.uiElement.appendChild(test.createUiElement());
        });
    }

    private createTests() {
        this.basisTests();
        MiscellaneousTests.getTests();
    }

    public static getJsonObject(semsAddress : string, callback : Function) {
        SemsServer.requestSemsObject(semsAddress, function(listOfJsonObjects) {
            for (let jsonObject of listOfJsonObjects) {
                if (General.primEquals(jsonObject[SEMS_ADDRESS], semsAddress)) {
                    callback(jsonObject);
                }
            }
        });
    };
}