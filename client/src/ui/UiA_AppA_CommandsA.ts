import type {Entity} from "@/Entity";
import {notNullUndefined} from "@/utils";
import type {CommandA} from "@/CommandA";
import {InputPattern} from "@/ui/InputPattern";

export class UiA_AppA_CommandsA {

    mapInputPatternToCommand : Map<string, CommandA> = new Map();

    listOfStaticCommands : Array<CommandA> = [];

    enter : CommandA;

    constructor(public entity: Entity) {
    }

    installCommands() {
        this.enter = this.createAndRegisterCommand();
        this.enter.inputPatterns.push(this.pattern('Enter'));
        this.enter.entity.codeG_jsFunction = async () => {
            await this.getGlobalEventG().defaultAction();
        };
        this.enter.entity.text = 'default action';

        // this.mapInputPatternToCommand.set('alt+Enter', async keyboardEvent => {
        //     await this.getGlobalEventG().newSubitem();
        // });
        // this.mapInputPatternToCommand.set('ctrl+f', async keyboardEvent => {
        //     await this.getGlobalEventG().toggleCollapsible();
        // });
        // this.mapInputPatternToCommand.set('ctrl+f', async keyboardEvent => {
        //     await this.getGlobalEventG().toggleCollapsible();
        // });
        // this.mapInputPatternToCommand.set('ctrl+e', async keyboardEvent => {
        //     await this.getGlobalEventG().scaleDown();
        // });
        // this.mapInputPatternToCommand.set('ctrl+d', async keyboardEvent => {
        //     await this.getGlobalEventG().scaleUp();
        // });
        // this.mapInputPatternToCommand.set('ctrl+g', async keyboardEvent => {
        //     await this.getGlobalEventG().toggleContext();
        // });
        // this.mapInputPatternToCommand.set('F1', async keyboardEvent => {
        //     await this.getGlobalEventG().mark();
        // });
        // this.mapInputPatternToCommand.set('F2', async keyboardEvent => {
        //     await this.getGlobalEventG().cut();
        // });
        // this.mapInputPatternToCommand.set('F3', async keyboardEvent => {
        //     await this.getGlobalEventG().pasteNext();
        // });
        // this.mapInputPatternToCommand.set('F4', async keyboardEvent => {
        //     await this.getGlobalEventG().paste();
        // });
        // this.mapInputPatternToCommand.set('F11', async keyboardEvent => {
        //     await this.getGlobalEventG().load();
        // });
        // this.mapInputPatternToCommand.set('ctrl+o', async keyboardEvent => {
        //     await this.getGlobalEventG().focusUiContext();
        // });
    }

    private getGlobalEventG() {
        return this.entity.uiA.appA.globalEventG;
    }

    async keyboardEvent(keyboardEvent: KeyboardEvent) {
        let compareString = InputPattern.createFromKeyboardEvent(keyboardEvent).createCompareString();
        if (this.entity.getApp_typed().testMode) {
            this.entity.logInfo(compareString);
        }
        if (this.mapInputPatternToCommand.has(compareString)) {
            await this.mapInputPatternToCommand.get(compareString).entity.codeG_jsFunction();
            keyboardEvent.preventDefault();
        }
        let compareString_withoutType = InputPattern.createFromKeyboardEvent_withoutType(keyboardEvent).createCompareString();
        if (this.mapInputPatternToCommand.has(compareString_withoutType)) {
            if (keyboardEvent.type === 'keyup') {
                await this.mapInputPatternToCommand.get(compareString_withoutType).entity.codeG_jsFunction();
            }
            keyboardEvent.preventDefault();
        }
    }

    private createAndRegisterCommand() : CommandA {
        let command = this.entity.getApp_typed().createEntityWithApp();
        command.installCommandA();
        this.listOfStaticCommands.push(command.commandA);
        return command.commandA;
    }

    private pattern(...keys: Array<string | MetaKey>) : InputPattern{
        let inputPattern = new InputPattern();
        for (let key of keys) {
            if (key === MetaKey.CTRL) {
                inputPattern.ctrl = true;
            } else if (key === MetaKey.SHIFT) {
                inputPattern.shift = true;
            } else if (key === MetaKey.ALT) {
                inputPattern.alt = true;
            } else {
                inputPattern.key = key;
            }
        }
        return inputPattern;
    }

    installMapForInputPatterns() {
        for (let command of this.listOfStaticCommands) {
            for (let inputPattern of command.inputPatterns) {
                this.mapInputPatternToCommand.set(inputPattern.createCompareString(), command);
            }
        }
    }
}

enum MetaKey {
    CTRL,
    SHIFT,
    ALT
}