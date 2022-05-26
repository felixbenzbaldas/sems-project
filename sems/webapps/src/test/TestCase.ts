import { App } from "../App";
import { StaticHeadBody } from "../view/StaticHeadBody";
import { assertThat, Matcher } from "./hamjest/hamjest";
import { TestApp } from "./TestApp";
import { View } from "../view/View";

export class TestCase {

    private bodyDiv: HTMLElement;
    private staticHeadBody: StaticHeadBody;
    private testField : HTMLDivElement;
    
    public processTest: Function;

    constructor() {
        this.staticHeadBody = new StaticHeadBody("");
        this.bodyDiv = this.staticHeadBody.getBodyDiv();
        this.testField = document.createElement("div");
    }

    public addToCurrent() {
        TestApp.currentTests.push(this);
    }

    public createTestFieldAndAddHtmlElement(htmlElement) {
        let testFieldHB = new StaticHeadBody("[test field]");
        testFieldHB.getBodyDiv().appendChild(this.testField);
        if (this.bodyDiv.hasChildNodes()) {
            this.bodyDiv.insertBefore(testFieldHB.getDiv(), this.bodyDiv.children[0]);
        } else {
            this.bodyDiv.appendChild(testFieldHB.getDiv());
        }
        this.addToTestField(htmlElement);
    }

    public createTestFieldAndAddSemsObject(semsAddress: string) {
        let self = this;
        App.getHtmlElementForSemsAddress(semsAddress, function(htmlElement) {
            self.createTestFieldAndAddHtmlElement(htmlElement)
        });
    }

    public addToTestField(htmlElement) {
        this.testField.appendChild(htmlElement);
    }

    public createUiElement() {
        return this.staticHeadBody.getDiv();
    }

    public execute() {
        this.processCatchException();
    }

    private processCatchException() {
        try {
            this.processTest();
        } catch (err) {
            if (!(err instanceof TypeError)) {
                this.note(err);
            }
            throw err;
        }
    }

    public autoTestCase(name: string) {
        this.heading("AUTO-TEST-CASE: " + name);
    }
    public heading(heading: string) {
        this.staticHeadBody.getHeadDiv().innerHTML = heading;
    }

    public assertThat(actual, matcher: Matcher) {
        try {
            assertThat(actual, matcher);
        } catch (err) {
            this.tested(err, false);
            return;
        }
        this.tested(actual, true);
    }
    public assertThat_withDescription(text: string, actual, matcher) {
        try {
            assertThat(text + ":", actual, matcher);
        } catch (err) {
            this.tested(err, false);
            return;
        }
        this.tested(text, true);
    }

    public aktion(aktion: string) {
        this.note("[AKTION] " + aktion);
    }
    public test(test: string) {
        this.note("[TEST] " + test);
    }
    public note(note: string) {
        this.bodyDiv.appendChild(View.createDivWithDefaultMargin_innerHtml(note));
    }

    public addHtmlElement(htmlElement : HTMLElement) {
        this.bodyDiv.appendChild(htmlElement);
    }

    private tested(text: string, testedPositive: boolean) {
        if (testedPositive) {
            this.note("<font color=\"green\">[OK]</font> " + text);
        } else {
            this.note("<font color=\"red\">[ERROR BEI DIESEM TEST]</font> " + text);
        }
    }
}