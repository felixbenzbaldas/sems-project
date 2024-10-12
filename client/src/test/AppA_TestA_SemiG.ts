import {StarterA} from "@/StarterA";
import {getSelectedText, selectAllTextOfDiv, setCaret} from "@/utils";
import type {Entity} from "@/Entity";

export class AppA_TestA_SemiG {

    constructor(private entity: Entity) {
    }

    createTests() {
        return [
            this.createTest('semiAutomatedTest_saveOnBlur', async test => {
                test.test_app = await StarterA.createAppWithUIWithCommands_editable_updateUi();
                let appA = test.test_app.appA;
                await appA.uiA.globalEventG.defaultAction();
                appA.logG.toListOfStrings = true;
                test.test_app.log('human-test: When removing the focus, the text is saved. (check with \'export app\')');
                return true;
            }),
            this.createTest('semiAutomatedTest_emptyMarker', async test => {
                test.test_app = await StarterA.createAppWithUIWithCommands_editable_updateUi();
                let appA = test.test_app.appA;
                await appA.uiA.globalEventG.defaultAction();
                await appA.uiA.globalEventG.defaultAction();
                appA.logG.toListOfStrings = true;
                test.test_app.log('human-test: An empty, editable, unfocused text is marked with a vertical black line');
                test.test_app.log('human-test: The empty marker disappears, when the text gets the caret or is not empty anymore.');
                return true;
            }),
            this.createTest('semiAutomatedTest_html', async test => {
                test.test_app = StarterA.createAppWithUI();
                let html = test.test_app.appA.createEntityWithApp();
                html.dangerous_html = document.createElement('div');
                html.dangerous_html.innerText = 'show me';
                await test.test_app.appA.uiA.content.list.add(html);
                await test.test_app.updateUi();
                test.test_app.appA.logG.toListOfStrings = true;
                test.test_app.log('human-test: the text "show me" appears');
                return true;
            }),
            this.createTest('semiAutomatedTest_setCaret', async test => {
                test.test_app = StarterA.createAppWithUI();
                let html = test.test_app.appA.createEntityWithApp();
                html.dangerous_html = document.createElement('div');
                html.dangerous_html.innerText = 'test';
                html.dangerous_html.contentEditable = 'true';
                html.dangerous_html.style.margin = '1rem';
                await test.test_app.appA.uiA.content.list.add(html, test.test_app.appA.unboundG.createButton('setCaret', () => {

                    setCaret(html.dangerous_html, 2);

                }));
                await test.test_app.updateUi();
                test.test_app.appA.logG.toListOfStrings = true;
                test.test_app.log('human-test: when clicking the button, the caret is set to the middle of the word "test"');
                return true;
            }),
            this.createTest('semiAutomatedTest_cursorStyle', async test => {
                test.test_app = await StarterA.createAppWithUIWithCommands_editable_updateUi();
                let appA = test.test_app.appA;
                await appA.uiA.globalEventG.defaultAction();
                await appA.uiA.globalEventG.toggleCollapsible();
                await appA.uiA.globalEventG.newSubitem();
                appA.logG.toListOfStrings = true;
                test.test_app.log('human-test: cursor style on collapsible object (outside text): pointer');
                test.test_app.log('human-test: cursor style on non-collapsible object (outside text): default');
                test.test_app.log('human-test: cursor style on editable text: text');
                test.test_app.log('human-test: cursor style on non-editable, non-collapsible text: default');
                test.test_app.log('human-test: cursor style on non-editable, collapsible text: pointer');
                return true;
            }),
            this.createTest('semiAutomatedTest_expand/collapse', async test => {
                test.test_app = await StarterA.createAppWithUIWithCommands_editable_updateUi();
                let appA = test.test_app.appA;
                await appA.uiA.globalEventG.defaultAction();
                await appA.uiA.globalEventG.toggleCollapsible();
                await appA.uiA.globalEventG.newSubitem();
                appA.logG.toListOfStrings = true;
                test.test_app.log('human-test: expanded collapsible has the icon: _');
                test.test_app.log('human-test: collapsed collapsible has the icon: [...]');
                test.test_app.log('human-test: non-collapsible has no icon');
                return true;
            }),
            this.createTest('semiAutomatedTest_placeholderArea', async test => {
                test.test_app = await StarterA.createAppWithUIWithCommands_editable_updateUi();
                let appA = test.test_app.appA;
                let html = appA.createEntityWithApp();
                html.dangerous_html = document.createElement('div');
                html.dangerous_html.style.height = '15rem';
                html.dangerous_html.style.backgroundColor = 'gold';
                html.dangerous_html.style.width = '15rem';
                let collapsible = appA.unboundG.createCollapsible('scroll down and then collapse me', html);
                collapsible.collapsed = false;
                collapsible.editable = false;
                appA.uiA.content.list.jsList.push(collapsible);
                appA.logG.toListOfStrings = true;
                test.test_app.log('info: The placeholder-area is an area which is inserted at the bottom of the site. ' +
                    'It is necessary to avoid unwanted movements when collapsing a big item.');

                test.test_app.log('human-test: The content above the item never moves, when collapsing it.');
                test.test_app.log('human-test: When scrolling to the bottom, you still see a rest of the application-content');
                test.test_app.log('human-test: The placeholder-area adapts its size when resizing the window.');
                return true;
            }),
            this.createTest('semiAutomatedTest_focusStyle', async test => {
                test.test_app = await StarterA.createAppWithUIWithCommands_editable_updateUi();
                let appA = test.test_app.appA;
                appA.logG.toListOfStrings = true;
                test.test_app.log('human-test: When clicking \'focus root\' a vertical orange line indicates the focus of the root element.' +
                    ' The line appears at the top of the (empty) content area.');
                test.test_app.log('human-test: The line disappears when creating a new object (the root has not the focus anymore).');
                test.test_app.log('human-test: The created object is surrounded with an orange box (because it has the focus).');
                test.test_app.log('human-test: The orange box disappears when removing the focus.');
                return true;
            }),
            this.createTest('semiAutomatedTest_focus_caret', async test => {
                test.test_app = await StarterA.createAppWithUIWithCommands_editable_updateUi();
                await test.test_app.appA.uiA.globalEventG.defaultAction();
                test.test_app.appA.uiA.focused.uiA.object.text = 'foo%/ )"ü,% bar';
                await test.test_app.appA.uiA.globalEventG.defaultAction();
                await test.test_app.appA.uiA.globalEventG.defaultAction();
                test.test_app.appA.uiA.focused.uiA.object.text = 'I have \n a new line';
                let appA = test.test_app.appA;
                appA.logG.toListOfStrings = true;
                test.test_app.log('human-test: When focusing a text, it gets the caret.');
                test.test_app.log('human-test: The caret is set to the end of the text.');
                test.test_app.log('info: does not work properly when there is a newline.');
                return true;
            }),
            this.createTest('semiAutomatedTest_currentContainerStyle', async test => {
                test.test_app = await StarterA.createAppWithUIWithCommands_editable_updateUi();
                let appA = test.test_app.appA;
                await appA.uiA.globalEventG.defaultAction();
                await appA.uiA.globalEventG.defaultAction();
                (await appA.uiA.content.list.getObject(0)).text = 'first container';
                (await appA.uiA.content.list.getObject(1)).text = 'second container';
                appA.logG.toListOfStrings = true;
                test.test_app.log('human-test: When switching the current container, it is marked with a grey background.');
                test.test_app.log('human-test: The background color updates, when changing the current container');
                return true;
            }),
            this.createTest('semiAutomatedTest_activeApp', async test => {
                test.test_app = await StarterA.createAppWithUIWithCommands_editable_updateUi();
                let appA = test.test_app.appA;
                appA.logG.toListOfStrings = true;
                test.test_app.log('human-test: Only the focus of the active app is visible.');
                return true;
            }),
            this.createTest('semiAutomatedTest_editableContent', async test => {
                test.test_app = StarterA.createAppWithUI();
                test.test_app.uiA.editable = true;
                let appA = test.test_app.appA;
                await appA.uiA.globalEventG.defaultAction();
                appA.uiA.focused.uiA.object.text = 'edit me!';
                appA.logG.toListOfStrings = true;
                appA.logG.toConsole = true;
                await test.test_app.updateUi();
                test.test_app.log('human-test: The object is editable.');
                return true;
            }),
            this.createTest('semiAutomatedTest_selectAllTextOfDiv', async test => {
                test.test_app = StarterA.createAppWithUI();
                let appA = test.test_app.appA;
                test.test_app.uiA.editable = true;
                let html = appA.createEntityWithApp();
                html.dangerous_html = document.createElement('div');
                html.dangerous_html.innerText = 'hello\nworld';
                await appA.uiA.content.list.add(
                    appA.unboundG.createButton('select text', () => {selectAllTextOfDiv(html.dangerous_html);}),
                    html,
                    appA.unboundG.createText('')
                );
                appA.logG.toListOfStrings = true;
                test.test_app.log('human-test: The text is selected (and can be copied with CTRL+C)');
                return true;
            }),
            this.createTest('semiAutomatedTest_getSelectedText', async test => {
                test.test_app = StarterA.createAppWithUI();
                let appA = test.test_app.appA;
                test.test_app.uiA.editable = true;
                let text = appA.unboundG.createText('');
                await appA.uiA.content.list.add(
                    appA.unboundG.createButton('get selected text', async () => {
                        text.text = getSelectedText();
                        await text.uis_update();
                    }),
                    text
                );
                appA.logG.toListOfStrings = true;
                test.test_app.log('human-action: select some text');
                test.test_app.log('human-action: click \'get selected text\'');
                test.test_app.log('human-test: The selected text is inserted in the text element.');
                return true;
            }),
        ];
    }

    private createTest(name: string, testAction: (test: Entity) => Promise<any>) {
        return this.entity.appA.testA.createTest(name, testAction);
    }
}