import type {Entity} from "@/Entity";
import {notNullUndefined} from "@/utils";
import type {CommandA} from "@/CommandA";
import {InputPattern} from "@/ui/InputPattern";

export class UiA_AppA_CommandsA {

    mapInputPatternToCommand : Map<string, CommandA> = new Map();

    listOfStaticCommands : Array<CommandA> = [];

    defaultAction : CommandA;
    newSubitem : CommandA;
    toggleCollapsible : CommandA;
    scaleDown : CommandA;
    scaleUp : CommandA;
    toggleContext : CommandA;
    mark : CommandA;
    cut : CommandA;
    pasteNext : CommandA;
    paste : CommandA;
    load : CommandA;
    focusUiContext : CommandA;
    deepCopy: CommandA;
    shakeTree: CommandA;

    constructor(public entity: Entity) {
    }

    installCommands() {
        this.defaultAction = this.createAndRegisterCommand();
        this.defaultAction.inputPatterns.push(this.pattern('Enter'));
        this.defaultAction.entity.action = async () => {
            await this.getGlobalEventG().defaultAction();
        };
        this.defaultAction.entity.text = 'default action';

        this.newSubitem = this.createAndRegisterCommand();
        this.newSubitem.inputPatterns.push(this.pattern(MetaKey.ALT, 'Enter'));
        this.newSubitem.entity.action = async () => {
            await this.getGlobalEventG().newSubitem();
        };
        this.newSubitem.entity.text = 'new subitem';

        this.toggleCollapsible = this.createAndRegisterCommand();
        this.toggleCollapsible.inputPatterns.push(this.pattern(MetaKey.CTRL, 'f'));
        this.toggleCollapsible.entity.action = async () => {
            await this.getGlobalEventG().toggleCollapsible();
        };
        this.toggleCollapsible.entity.text = 'toggle collapsible';

        this.scaleDown = this.createAndRegisterCommand();
        this.scaleDown.inputPatterns.push(this.pattern(MetaKey.CTRL, 'e'));
        this.scaleDown.entity.action = async () => {
            await this.getGlobalEventG().scaleDown();
        };
        this.scaleDown.entity.text = 'scale down';

        this.scaleUp = this.createAndRegisterCommand();
        this.scaleUp.inputPatterns.push(this.pattern(MetaKey.CTRL, 'd'));
        this.scaleUp.entity.action = async () => {
            await this.getGlobalEventG().scaleUp();
        };
        this.scaleUp.entity.text = 'scale up';

        this.toggleContext = this.createAndRegisterCommand();
        this.toggleContext.inputPatterns.push(this.pattern(MetaKey.CTRL, 'g'));
        this.toggleContext.entity.action = async () => {
            await this.getGlobalEventG().toggleContext();
        };
        this.toggleContext.entity.text = 'toggle context';

        this.mark = this.createAndRegisterCommand();
        this.mark.inputPatterns.push(this.pattern('F1'));
        this.mark.entity.action = async () => {
            await this.getGlobalEventG().mark();
        };
        this.mark.entity.text = 'mark';

        this.cut = this.createAndRegisterCommand();
        this.cut.inputPatterns.push(this.pattern('F2'));
        this.cut.entity.action = async () => {
            await this.getGlobalEventG().cut();
        };
        this.cut.entity.text = 'cut';

        this.pasteNext = this.createAndRegisterCommand();
        this.pasteNext.inputPatterns.push(this.pattern('F3'));
        this.pasteNext.entity.action = async () => {
            await this.getGlobalEventG().pasteNext();
        };
        this.pasteNext.entity.text = 'paste next';

        this.paste = this.createAndRegisterCommand();
        this.paste.inputPatterns.push(this.pattern('F4'));
        this.paste.entity.action = async () => {
            await this.getGlobalEventG().paste();
        };
        this.paste.entity.text = 'paste';

        this.load = this.createAndRegisterCommand();
        this.load.inputPatterns.push(this.pattern('F11'));
        this.load.entity.action = async () => {
            await this.getGlobalEventG().scaleDown();
        };
        this.load.entity.text = 'load';

        this.focusUiContext = this.createAndRegisterCommand();
        this.focusUiContext.inputPatterns.push(this.pattern(MetaKey.CTRL, 'o'));
        this.focusUiContext.entity.action = async () => {
            await this.getGlobalEventG().focusUiContext();
        };
        this.focusUiContext.entity.text = 'focus ui context';

        this.deepCopy = this.createAndRegisterCommand();
        this.deepCopy.inputPatterns.push(this.pattern(MetaKey.CTRL, MetaKey.SHIFT, MetaKey.ALT, 'c'));
        this.deepCopy.entity.action = async () => {
            await this.getGlobalEventG().deepCopy();
        };
        this.deepCopy.entity.text = 'deep copy (marked object will be copied into focused container)';

        this.shakeTree = this.createAndRegisterCommand();
        this.shakeTree.inputPatterns.push(this.pattern(MetaKey.CTRL, MetaKey.SHIFT, MetaKey.ALT, 'q'));
        this.shakeTree.entity.action = async () => {
            await this.getGlobalEventG().shakeTree();
        };
        this.shakeTree.entity.text = 'shake tree';
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
            await this.runCommand(compareString);
            keyboardEvent.preventDefault();
        }
        let compareString_withoutType = InputPattern.createFromKeyboardEvent_withoutType(keyboardEvent).createCompareString();
        if (this.mapInputPatternToCommand.has(compareString_withoutType)) {
            if (keyboardEvent.type === 'keyup') {
                await this.runCommand(compareString_withoutType);
            }
            keyboardEvent.preventDefault();
        }
    }

    private async runCommand(compareString : string) {
        await this.mapInputPatternToCommand.get(compareString).entity.action();
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
                inputPattern.key = InputPattern.normalize(key);
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