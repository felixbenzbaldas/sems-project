import { App } from "../App";
import { SEMS_ADDRESS } from "../Consts";
import { ObjectLoader } from "../data/ObjectLoader";
import { AnimatedExpandAndCollapse } from "../general/AnimatedExpandAndCollapse";
import { AnimatedHeadBody } from "../general/AnimatedHeadBody";
import { EventController } from "../general/EventController";
import { General } from "../general/General";
import { SemsServer } from "../SemsServer";
import { StaticHeadBody } from "../view/StaticHeadBody";
import { View } from "../view/View";
import { is } from "./hamjest/hamjest";
import { TestApp } from "./TestApp";
import { TestCase } from "./TestCase";

export class MiscellaneousTests {


    public static getTests() {
        let testsList: Array<TestCase> = TestApp.miscellaneousTests;
        //
        if (true) {
            let test = new TestCase();
            testsList.push(test);
            test.processTest = function () {
                test.heading("AnimatedHeadBody");
                let button = document.createElement("button");
                button.innerHTML = "Klick mich";
                test.createTestFieldAndAddHtmlElement(button);
                View.setDefaultMargin(button);
                let hb : AnimatedHeadBody = View.createStyledAnimatedHeadBody();
                hb.getHead().innerText = "HEAD";
                hb.getBody().innerHTML = "BODY<br/>BODY<br/>BODY<br/>BODY"
                test.addToTestField(hb.getUiElement());
                button.onclick = function() {
                    if (hb.isCollapsed()) {
                        hb.expand(function() {
                            test.note("expand finished");
                        });
                    } else {
                        hb.collapse(function() {
                            test.note("collapse finished");
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
                test.heading("AnimatedExpandAndCollapse");
                let button = document.createElement("button");
                button.innerHTML = "Klick mich";
                test.createTestFieldAndAddHtmlElement(button);
                View.setDefaultMargin(button);
                let animatedExpandAndCollapse : AnimatedExpandAndCollapse = new AnimatedExpandAndCollapse();
                animatedExpandAndCollapse.basisHeight = 20;
                animatedExpandAndCollapse.basisAnimationTime = 0.06;
                test.addToTestField(animatedExpandAndCollapse.getOuterDiv());
                let div = document.createElement("div");
                div.innerHTML = "TEST<br/>TEST<br/>TEST";
                div.contentEditable = "true";
                div.style.backgroundColor = "green";
                div.style.width = "100px";
                animatedExpandAndCollapse.getInnerDiv().appendChild(div);
                button.onclick = function() {
                    if (animatedExpandAndCollapse.isCollapsed()) {
                        animatedExpandAndCollapse.expand(function() {
                            test.note("animateToContentHeight finished");
                        });
                    } else {
                        animatedExpandAndCollapse.collapse(function() {
                            test.note("animateCollapse finished");
                        });
                    }
                }
                test.aktion("Klick auf den Button");
                test.test("ein grüner Kasten wird aufgeklappt. Der grüne Kasten enthält 3 Zeilen mit jeweils einem Wort");
                test.aktion("Klick auf den Button");
                test.test("der grüne Kasten wird wieder eingeklappt.");
                test.test("Wenn der grüne Kasten vollständig verschwunden ist, erscheint die Meldung: animateToContentHeight finished");
                test.test("(Die Meldung erscheint erst, wenn die Animation fertig ist)");
                test.aktion("Weitere Wörter im grünen Kasten hinzufügen, so dass sich die Höhe des Textes verändert");
                test.test("Die Höhe des äußeren Divs passt sich an. Wenn man Zeilen entfernt wird das äußere Div kleiner und wenn man Zeilen hinzufügt, wird das äußere Div größer.")
                test.test("Die Dauer der Animation berechnet sich folgendermaßen: "
                    + "animationTime(höhe) = Basis-Zeit * 3.-Wurzel(höhe / Basis-Höhe)");
            };
        }
        //
        if (true) {
            let test = new TestCase();
            testsList.push(test);
            test.processTest = function () {
                test.heading("TextObjectController -> ensureExpandedIfContentIsAvailable")
                test.aktion("Startseite von Sems aufrufen");
                test.test("Das Sems-Objekt ist anfangs ausgeklappt.");
            };
        }
        if (true) {
            let test = new TestCase();
            testsList.push(test);
            test.processTest = function () {
                test.heading("Mobile Geräten");
                //
                SemsServer.requestRootObject(function(address) {
                    test.createTestFieldAndAddSemsObject(address);
                });
                test.aktion("http://localhost:8080/?mode=test");
                test.note("Dummy-Text Dummy-Text Dummy-Text Dummy-Text Dummy-Text Dummy-Text Dummy-Text Dummy-Text "
                        + "Dummy-Text Dummy-Text Dummy-Text Dummy-Text Dummy-Text Dummy-Text Dummy-Text // Absatzende //");
                test.test("Nach dem Laden der App ist der Dummy-Text vollständig sichtbar.");
                test.test("Die Schriftgröße passt.");
                test.test("Die Schriftgröße ist immer gleich."
                    + "Auch beim Aufklappen eines Objektes ist die Schriftgröße gleich (oder ähnlich).");
                test.test("Auch beim Desktop-Browser passt die Schriftgröße. Beim Desktop-Browser kann man zoomen (mit dem Scrollrad)");
                test.test("Auf dem Smartphone passt die Schriftgröße auch im Querformat.");
                test.test("Die Margins und Paddings passen auch auf dem Smartphone.");
            };
        }
        if (true) {
            let test = new TestCase();
            testsList.push(test);
            test.processTest = function () {
                test.heading("STR + Click");
                test.test("Mit STR + Click kann man ein Objekt in einem neuen Tab öffnen. In der Adresszeile steht dann die Adresse.");
                test.test("auch mit anderen Browsern testen (auch mobile Browser)");
            };
        }
        if (true) {
            let test = new TestCase();
            testsList.push(test);
            test.processTest = function () {
                test.heading("Sems-Hypertext");
                SemsServer.createTextObject("#htext", function(hTextObject) {
                    SemsServer.createContextDetailAtPosition("Eine ", 0, hTextObject, function(preText) {
                        SemsServer.createContextDetailAtPosition("Tabuliga", 1, hTextObject, function(vabuliga) {
                            SemsServer.createContextDetailAtPosition(" kaufe sich einen großen Hut.", 2, hTextObject, function(postText) {
                                SemsServer.createContextDetailAtPosition("Eine Tabuliga ist ein hübsches Wesen mit großem Kopf.", 0, vabuliga, function(obj) {
                                    App.getUserInterfaceObjectForSemsAddress(hTextObject, function(userInterfaceObject) {
                                        test.createTestFieldAndAddHtmlElement(userInterfaceObject.getUiElement());
                                        test.test("Der Text wird geschlossen als Hypertext angezeigt.");
                                        test.test("Wenn man auf Tabuliga klickt, wird eine entsprechende Erklärung angezeigt.");
                                        test.test("Für 'Tabuliga' wird kein Kontext angezeigt. Es wird ja im Kontext angezeigt.");
                                        test.test("Mit Kontextklick (rechte Maustaste) wird die editierbare Variante angezeigt.");
                                    });                           
                                }); 
                            });
                        });
                    });

                });
            };
        }
        //
        // if (true) {
        //     let test = new TestCase();
        //     testsList.push(test);
        //     test.processTest = function () {
        //         test.heading("Image");
        //         let imageTest;
        //         const addressString = "landscape.jpg";
        //         SemsServer.createTextObject("Bild-Test", function(imageTest_local) {
        //             imageTest = imageTest_local;
        //             SemsServer.createContextDetailAtPosition("#img", 0, imageTest, function (imageObject_local) {
        //                 SemsServer.createContextDetailAtPosition(addressString, 0, imageObject_local, function() {});
        //                 SemsServer.setDefaultExpanded(imageTest_local, false);
        //             });
        //         });
        //         TestApp.middleDelay( function() {
        //             App.getUserInterfaceObjectForSemsAddress(imageTest, function(userInterfaceObject) {
        //                 test.createTestFieldAndAddHtmlElement(userInterfaceObject.getUiElement());
        //                 test.test("Unterhalb von Bild-Test erscheint ein Bild");
        //                 test.test("Das Bild hat zunächst eine Standardhöhe, so dass das Bild nicht zu hoch wird.");
        //                 test.aktion("Klick auf das Bild");
        //                 test.test("Das Bild passt sich nun an die Breite an");
        //                 test.aktion("erneut auf das Bild klicken");
        //                 test.test("Das Bild hat nun wieder die Standardhöhe");
        //             });
        //         });
        //     };
        // }
        //
        if (true) {
            let test = new TestCase();
            testsList.push(test);
            test.processTest = function () {
                test.heading("Link");
                let linkTest;
                const text = "Test";
                const addressString = "https://www.test.de/blub";
                SemsServer.createTextObject("Link-Test", function(linkTest_local) {
                    linkTest = linkTest_local;
                    SemsServer.createContextDetailAtPosition("#link", 0, linkTest, function (linkObject_local) {
                        SemsServer.createContextDetailAtPosition(addressString, 0, linkObject_local, function() {
                            SemsServer.createContextDetailAtPosition(text, 1, linkObject_local, function() {});
                        });
                    });
                });
                TestApp.middleDelay(function () {
                    App.getUserInterfaceObjectForSemsAddress(linkTest, function(userInterfaceObject) {
                        test.createTestFieldAndAddHtmlElement(userInterfaceObject.getUiElement());
                        test.test("Unterhalb von Link-Test erscheint ein Link");
                        test.test("Die Adresse des Linkes ist " + addressString);
                        test.test("Der angezeigte Text ist " + text);
                        test.test("Es werden keine Kind-Objekte für den Link angezeigt");
                        test.aktion("Unterhalb von Link-Test ein neues Objekt anlegen mit Text: #link");
                        test.aktion("Darunter zwei TextObjekte anlegen");
                        test.aktion("Test-Link ein- und ausklappen");
                        test.test("#link wird als korrekter Link angezeigt");
                        test.test("Die Links können gelöscht werden.");
                        test.test("Mit Enter kann unter dem Link ein Objekt eingefügt werden.");
                    });
                });
            };
        }
        //
        if (true) {
            let test = new TestCase();
            testsList.push(test);
            test.processTest = function () {
                test.autoTestCase("EventController");
                let eventController : EventController = new EventController("test");
                let counter = 0;
                let observer = function(eventObject) {
                    counter++;
                    test.note("eventObject = " + eventObject)
                };
                eventController.addObserver("testEvent", observer);
                eventController.triggerEvent("testEvent", "testObject correct");
                eventController.removeObserver(new String("testEvent"), observer);
                eventController.triggerEvent("testEvent", "testObject false");
                test.assertThat(counter, is(1));
            };
        }
        if (true) {
            let test = new TestCase();
            testsList.push(test);
            test.processTest = function () {
                test.heading("JSON - welche Propertys sind vorhanden?");
                let testJson : any = {
                    "testA" : "testValueA"
                }
                Object.keys(testJson).forEach(function(key) {
                    test.note("key: " + key);
                });
            };
        }
        if (true) {
            let test = new TestCase();
            testsList.push(test);
            test.processTest = function () {
                test.heading("Compare Strings in TypeScript");
                let str1 = new String("test");
                let str2 = "test";
                let str3 = "te" + "st";
                test.note("=== " + (str1 === str2) + " " + (str2 === str3));
                test.note("== " + (str1 == str2) + " " + (str2 == str3));
                test.note("convertStringsToPrimitiveTypeAndCheckEquality " 
                    + General.primEquals(str1, str2) + " " 
                    + General.primEquals(str2, str3));
            };
        }
        if (true) {
            let test = new TestCase();
            testsList.push(test);
            test.processTest = function () {
                test.heading("TypeScript Map with strings as key");
                let map : Map<string, string> = new Map();
                let myAny : any = new String("test");
                map.set(myAny, "value");
                let myAny2 : any = new String("test");
                map.set(myAny2, "value");
                test.note("number of keys = " + map.size);
            };
        }
        if (true) {
            let test = new TestCase();
            testsList.push(test);
            test.processTest = function () {
                test.heading("Focus leaves span / blur");
                let span = document.createElement("span");
                span.contentEditable = "true";
                test.createTestFieldAndAddHtmlElement(span);
                span.innerText = "testText";
                span.onblur = function () {
                    test.note(" > focus left span ; text = " + span.innerText);
                };
            };
        }
        //
        if (true) {
            let test = new TestCase();
            testsList.push(test);
            test.processTest = function () {
                test.heading("HTML-Element: Slider");
                let input = document.createElement("input");
                input.type = "range";
                input.min = "1";
                input.max = "100";
                input.value = "50";
                let span = document.createElement("span");
                test.createTestFieldAndAddHtmlElement(input);
                span.innerText = input.value;
                test.addToTestField(span);
                input.oninput = function () {
                    span.innerText = input.value;
                };
            };
        }
        //
        if (true) {
            let test = new TestCase();
            testsList.push(test);
            test.processTest = function () {
                test.heading("StaticHeadBody");
                let hB1 = new StaticHeadBody("headTextTest");
                test.createTestFieldAndAddHtmlElement(hB1.getDiv());
                let hB2 = new StaticHeadBody("headTextTest2");
                let hB3 = new StaticHeadBody("headTextTest3");
                hB1.getBodyDiv().appendChild(hB2.getDiv());
                hB1.getBodyDiv().appendChild(hB3.getDiv());
                hB2.getBodyDiv().appendChild(View.createDivWithDefaultMargin_innerHtml("SemsText1"));
                hB2.getBodyDiv().appendChild(View.createDivWithDefaultMargin_innerHtml("SemsText2"));
                hB3.getBodyDiv().appendChild(View.createDivWithDefaultMargin_innerHtml("SemsText3"));
            };
        }
        //
        if (true) {
            let test = new TestCase();
            testsList.push(test);
            test.processTest = function () {
                test.heading("Demonstration eines Closure");
                function outerFunction() {
                    var variableInOuterFunction = 1;
                    function innerFunction(){
                        variableInOuterFunction++;
                        return variableInOuterFunction;
                    }
                    return innerFunction;
                }
                var innerFunction_1 = outerFunction();
                test.note(innerFunction_1().toString());
                test.note(innerFunction_1().toString());
                test.note(innerFunction_1().toString());
                var innerFunction_2 = outerFunction();
                test.note(innerFunction_2().toString());
                test.note(innerFunction_2().toString());
                test.note(innerFunction_2().toString());
                test.note("A closure is a function having access to the parent scope, even after the parent function has closed. (https://www.w3schools.com/js/js_function_closures.asp)");
            };
        }
    }
}