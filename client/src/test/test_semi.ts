import type {TestG_NestedTestsA} from "@/tester/TestG_NestedTestsA";
import {assert, assert_sameAs, assertFalse, downloadText, setWidth, textFileInput, wait} from "@/utils";
import {Environment} from "@/Environment";
import {testData} from "@/testData";
import {Color} from "@/ui/Color";
import {Font} from "@/ui/Font";
import {AnimatedExpandAndCollapse} from "@/ui/AnimatedExpandAndCollapse";

export function test_semi_add(tests : TestG_NestedTestsA) {
    tests.addNestedTests('semi', semi => {
        semi.addUiTest('keyboardEvent',  async run => {
            run.appUi.content.listA.addDirect(
                run.app.unboundG.createButton('activate test-app', () => {
                }),
                run.app.unboundG.createButton('switch off testMode', () => {
                    run.app.testMode = false;
                })
            );
            run.app.logG.toListOfStrings = true;
            run.app.logG.toConsole = true;
            run.app.entity.log('human-action: click \'activate test-app\'');
            run.app.entity.log('human-test: when pressing keys, the according key events are logged.');
            run.app.entity.log('human-action: click \'switch off testMode\'');
            run.app.entity.log('human-test: now the keys are not logged.');
        });
        semi.addUiTest('contextIcon',  async run => {
            let parent = await run.app.createText('parent');
            parent.installListA();
            let inContext = await run.app.createText('inContext');
            let withoutContext = await run.app.createText('withoutContext');
            let outOfContext = await run.app.createText('outOfContext');
            let longText = await run.app.createText('longText-'.repeat(25));
            inContext.context = inContext.getPath(parent);
            longText.context = longText.getPath(parent);
            outOfContext.context = outOfContext.getPath(await run.app.createText('aDummyContext'));
            await parent.listA.add(inContext);
            await parent.listA.add(outOfContext);
            await parent.listA.add(withoutContext);
            await parent.listA.add(longText);
            await run.appUi.content.listA.add(parent);
            await run.appUi.update();
            let parentUi = run.appUi.content.uiA.listG.uisOfListItems[0];
            assert_sameAs(parentUi.uiA.listG.uisOfListItems[0].uiA.headerG.contextIcon.innerText, '-');
            assert_sameAs(parentUi.uiA.listG.uisOfListItems[1].uiA.headerG.contextIcon.innerText, '/');
            assert_sameAs(parentUi.uiA.listG.uisOfListItems[2].uiA.headerG.contextIcon.innerText, '');
            run.app.entity.log('human-test: The item withContext should show the appropriate contextIcon -');
            run.app.entity.log('human-test: The contextIcon always appears left of the content - also for the long text.');
        });
        semi.addUiTest('contextAsSubitem',  async run => {
            run.app.entity.uiA.editable = true;
            let parent = await run.app.createText('parent');
            parent.installListA();
            let inContext = await run.app.createText('inContext');
            let withoutContext = await run.app.createText('withoutContext');
            let outOfContext = await run.app.createText('outOfContext');
            inContext.context = inContext.getPath(parent);
            outOfContext.context = outOfContext.getPath(await run.app.createText('aDummyContext'));
            outOfContext.installListA();
            await outOfContext.listA.add(await run.app.createText('aDummySubitem'));
            await parent.listA.add(inContext);
            await parent.listA.add(outOfContext);
            await parent.listA.add(withoutContext);
            await run.appUi.content.listA.add(parent);
            await run.appUi.update();
            let parentUi = run.appUi.content.uiA.listG.uisOfListItems[0];
            assertFalse(await parentUi.uiA.listG.uisOfListItems[0].uiA.hasContextAsSubitem());
            assert(await parentUi.uiA.listG.uisOfListItems[1].uiA.hasContextAsSubitem());
            assertFalse(await parentUi.uiA.listG.uisOfListItems[2].uiA.hasContextAsSubitem());
            //
            assert(await parentUi.uiA.listG.uisOfListItems[1].uiA.headerBodyG.hasBodyContent());
            run.app.entity.log('human-test: outOfContext shows "contextAsSubitem"');
        });
        semi.addUiTest('upload',  async run => {
            let html = run.app.createEntityWithApp();
            run.appUi.content.listA.addDirect(html);
            html.codeG_html = textFileInput((contents : any) => {
                run.appUi.content.listA.addDirect(run.app.unboundG.createText(contents));
                run.appUi.update();
            });
            run.app.entity.log('human-action: Click on upload -> choose a text file');
            run.app.entity.log('human-test: The text of the file appears.');
        });
        semi.addUiTest('download',  async run => {
            let html = run.app.createEntityWithApp();
            run.appUi.content.listA.addDirect(html);
            const fileContent = 'foo123';
            const fileName = 'testfile.txt';
            html.codeG_html = downloadText(fileContent, fileName, 'download');
            run.app.entity.log('human-action: Click on download');
            run.app.entity.log('human-test: A text file is downloaded.');
            run.app.entity.log('human-test: The content of the downloaded file is ' + fileContent);
        });
        semi.addUiTest('setWidth',  async run => {
            let appA = run.appUi.getApp();
            let html = appA.createEntityWithApp();
            appA.uiA.content.listA.addDirect(html);
            html.codeG_html = document.createElement('div');
            let left = document.createElement('div');
            html.codeG_html.appendChild(left);
            let right = document.createElement('div');
            html.codeG_html.appendChild(right);
            html.codeG_html.style.display = 'flex';
            html.codeG_html.style.width = '30rem';
            html.codeG_html.style.height = '10rem';
            html.codeG_html.style.border = 'solid';
            left.style.width = '5rem'; // this is not 'strong' enough. You will need the setWidth function
            right.contentEditable = 'true';
            right.style.minWidth = '5rem';
            right.style.border = 'solid';
            right.innerText = 'Write some text here (multiple lines)!';

            setWidth(left, '5rem');

            appA.entity.log('human-action: write multiple lines in the text field');
            appA.entity.log('human-test: The text does not move.');
        });
        semi.addUiTestWithNestedTests('animatedExpand', async run => {
            let html = run.app.createEntityWithApp();
            html.codeG_html = document.createElement('div');
            html.codeG_html.style.backgroundColor = 'gold';
            html.codeG_html.style.transitionProperty = 'height';
            html.codeG_html.style.transitionDuration = '2s';
            html.codeG_html.style.height = '50px';
            html.codeG_html.style.width = '5rem';
            run.appUi.content.listA.addDirect(
                run.app.unboundG.createButton('expand', () => {
                    html.codeG_html.style.height = '300px';
                }),
                run.app.unboundG.createButton('collapse', () => {
                    html.codeG_html.style.height = '50px';
                }),
                html
            );
        }, animatedExpand => {
            animatedExpand.addUiTestWithNestedTests('toContentHeight', async run => {
                let animatedExpandAndCollapse = new AnimatedExpandAndCollapse();
                let html = run.app.createEntityWithApp();
                html.codeG_html = animatedExpandAndCollapse.outerDiv;
                animatedExpandAndCollapse.innerDiv.innerText = 'foo bar bar foo bar '.repeat(40);
                animatedExpandAndCollapse.innerDiv.contentEditable = 'true';
                run.appUi.content.listA.addDirect(
                    run.app.unboundG.createButton('expand', async () => {
                        await animatedExpandAndCollapse.expand();
                    }),
                    run.app.unboundG.createButton('collapse', async () => {
                        await animatedExpandAndCollapse.collapse();
                    }),
                    run.app.unboundG.createButton('expand without animation', async () => {
                        animatedExpandAndCollapse.expandWithoutAnimation();
                    }),
                    run.app.unboundG.createButton('collapse without animation', async () => {
                        animatedExpandAndCollapse.collapseWithoutAnimation();
                    }),
                    html
                );
            }, toContentHeight => {
                toContentHeight.addUiTest('slowly', async run => {
                    let animatedExpandAndCollapse = new AnimatedExpandAndCollapse();
                    animatedExpandAndCollapse.basisAnimationTime_inSeconds = 1;
                    animatedExpandAndCollapse.maxAnimationTime_inSeconds = 5;
                    let html = run.app.createEntityWithApp();
                    html.codeG_html = animatedExpandAndCollapse.outerDiv;
                    animatedExpandAndCollapse.innerDiv.innerText = 'foo bar bar foo bar '.repeat(40);
                    animatedExpandAndCollapse.innerDiv.contentEditable = 'true';
                    run.appUi.content.listA.addDirect(
                        run.app.unboundG.createButton('expand', async () => {
                            await animatedExpandAndCollapse.expand();
                        }),
                        run.app.unboundG.createButton('collapse', async () => {
                            await animatedExpandAndCollapse.collapse();
                        }),
                        run.app.unboundG.createButton('expand without animation', async () => {
                            animatedExpandAndCollapse.expandWithoutAnimation();
                        }),
                        run.app.unboundG.createButton('collapse without animation', async () => {
                            animatedExpandAndCollapse.collapseWithoutAnimation();
                        }),
                        html
                    );
                });
            });
        });
    });
}