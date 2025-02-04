import type {Entity} from "@/Entity";
import type {CommandA} from "@/CommandA";
import {InputPattern} from "@/ui/InputPattern";
import type {AccessMode} from "@/ui/AccessMode";
import {notNullUndefined, nullUndefined} from "@/utils";

export class UiA_AppA_CommandsA {

    mapInputPatternToCommand : Map<string, CommandA> = new Map(); // TODO maybe map to Array<CommandA> ?

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
    focusUiContext : CommandA;
    deepCopy: CommandA;
    shakeTree: CommandA;
    editMode: CommandA;
    focusNext: CommandA;
    focusPrevious: CommandA;
    exportProfileWithClear: CommandA;
    importProfile: CommandA;

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
        this.newSubitem.inputPatterns.push(this.pattern(MetaKey.ALT, 'Enter'), this.pattern('Tab'));
        this.newSubitem.entity.action = async () => {
            await this.getGlobalEventG().newSubitem();
        };
        this.newSubitem.entity.text = 'new subitem';

        this.toggleCollapsible = this.createAndRegisterCommand();
        this.toggleCollapsible.inputPatterns.push(this.pattern(MetaKey.CTRL, 'f'), this.pattern_viewMode('c'), this.pattern('F11'));
        this.toggleCollapsible.entity.action = async () => {
            await this.getGlobalEventG().toggleCollapsible();
        };
        this.toggleCollapsible.entity.text = 'toggle collapsible';

        this.scaleDown = this.createAndRegisterCommand();
        this.scaleDown.inputPatterns.push(this.pattern(MetaKey.CTRL, 'e'), this.pattern_viewMode('e'));
        this.scaleDown.entity.action = async () => {
            await this.getGlobalEventG().scaleDown();
        };
        this.scaleDown.entity.text = 'scale down';

        this.scaleUp = this.createAndRegisterCommand();
        this.scaleUp.inputPatterns.push(this.pattern(MetaKey.CTRL, 'd'), this.pattern_viewMode('d'));
        this.scaleUp.entity.action = async () => {
            await this.getGlobalEventG().scaleUp();
        };
        this.scaleUp.entity.text = 'scale up';

        this.toggleContext = this.createAndRegisterCommand();
        this.toggleContext.inputPatterns.push(this.pattern(MetaKey.CTRL, 'g'), this.pattern_viewMode('g'));
        this.toggleContext.entity.action = async () => {
            await this.getGlobalEventG().toggleContext();
        };
        this.toggleContext.entity.text = 'toggle context';

        this.mark = this.createAndRegisterCommand();
        this.mark.inputPatterns.push(this.pattern('F1'), this.pattern_viewMode('m'));
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

        this.focusUiContext = this.createAndRegisterCommand();
        this.focusUiContext.inputPatterns.push(this.pattern(MetaKey.CTRL, 'o'), this.pattern_viewMode('o'));
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

        this.editMode = this.createAndRegisterCommand();
        this.editMode.inputPatterns.push(this.pattern(MetaKey.CTRL, 'i'), this.pattern('F12'));
        this.editMode.entity.action = async () => {
            await this.getGlobalEventG().editMode();
        };
        this.editMode.entity.text = 'enter edit mode';

        this.focusPrevious = this.createAndRegisterCommand();
        this.focusPrevious.inputPatterns.push(this.pattern_viewMode('i'), this.pattern(MetaKey.ALT, 'i'));
        this.focusPrevious.entity.action = async () => {
            await this.getGlobalEventG().focusPrevious();
        };
        this.focusPrevious.entity.text = 'focus previous';

        this.addCommand(
            'focus next',
            async () => {
                await this.getGlobalEventG().focusNext();
            },
            command => { this.focusNext = command; },
            this.pattern_viewMode('k'),
            this.pattern(MetaKey.ALT, 'k')
        );

        this.addCommand(
            'to end of list',
            async () => {
                await this.getGlobalEventG().toEndOfList();
            },
            command => {},
            this.pattern_viewMode('l'),
            this.pattern(MetaKey.ALT, 'l')
        );

        this.addCommand(
            'leave edit mode',
            () => {
                this.getGlobalEventG().leaveEditMode();
            },
            undefined,
            this.pattern('Escape')
        );

        this.addCommand(
            'import profile',
            () => {
                this.getGlobalEventG().importProfile();
            },
            command => {
                this.importProfile = command;
            }
        );

        this.addCommand(
            'export profile with clear',
            () => {
                this.getGlobalEventG().exportProfileWithClear();
            },
            command => {
                this.exportProfileWithClear = command;
            }
        );
    }

    addCommand(text : string, action : Function, setField : (command : CommandA) => void, ...patterns : Array<InputPattern>) {
        let command = this.createAndRegisterCommand();
        if (setField) {
            setField(command);
        }
        command.inputPatterns.push(...patterns);
        command.entity.action = action;
        command.entity.text = text;
    }

    private getGlobalEventG() {
        return this.entity.uiA.appA.globalEventG;
    }

    async keyboardEvent(keyboardEvent: KeyboardEvent) {
        if (this.shouldPreventDefault(keyboardEvent)) {
            keyboardEvent.preventDefault();
        }
        await this.trigger(keyboardEvent);
    }

    shouldPreventDefault(keyboardEvent : KeyboardEvent) : boolean {
        if (this.mapInputPatternToCommand.has(InputPattern.createFromKeyboardEvent(keyboardEvent).createCompareString()) ||
            this.mapInputPatternToCommand.has(InputPattern.createFromKeyboardEvent_withoutType(keyboardEvent).createCompareString())) {
            return true;
        } else {
            let mode = this.getMode();
            if (notNullUndefined(mode)) {
                return this.mapInputPatternToCommand.has(InputPattern.createFromKeyboardEvent(keyboardEvent, mode).createCompareString()) ||
                    this.mapInputPatternToCommand.has(InputPattern.createFromKeyboardEvent_withoutType(keyboardEvent, mode).createCompareString());
            }
        }
    }

    async trigger(keyboardEvent: KeyboardEvent) {
        let triggers : Array<InputPattern> = [];
        let mode = this.getMode();
        triggers.push(InputPattern.createFromKeyboardEvent(keyboardEvent));
        if (notNullUndefined(mode)) {
            triggers.push(InputPattern.createFromKeyboardEvent(keyboardEvent, mode));
        }
        if (keyboardEvent.type === 'keydown') {
            triggers.push(InputPattern.createFromKeyboardEvent_withoutType(keyboardEvent));
            if (notNullUndefined(mode)) {
                triggers.push(InputPattern.createFromKeyboardEvent_withoutType(keyboardEvent, mode));
            }
        }
        for (let trigger of triggers) {
            let compareString = trigger.createCompareString();
            if (this.mapInputPatternToCommand.has(compareString)) {
                await this.mapInputPatternToCommand.get(compareString).entity.action();
            }
        }
    }

    private createAndRegisterCommand() : CommandA {
        let command = this.entity.getApp_typed().createEntityWithApp();
        command.installCommandA();
        this.listOfStaticCommands.push(command.commandA);
        return command.commandA;
    }

    pattern(...keys: Array<string | MetaKey>) : InputPattern{
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

    pattern_editMode(...keys: Array<string | MetaKey>) : InputPattern {
        let inputPattern = this.pattern(...keys);
        inputPattern.mode = 'edit';
        return inputPattern;
    }

    pattern_viewMode(...keys: Array<string | MetaKey>) : InputPattern {
        let inputPattern = this.pattern(...keys);
        inputPattern.mode = 'view';
        return inputPattern;
    }

    getMode() : AccessMode {
        if (nullUndefined(this.entity.uiA.appA.focused)) {
            return undefined;
        } else {
            if (this.entity.uiA.appA.focused.editMode) {
                return 'edit';
            } else {
                return 'view';
            }
        }
    }
}

enum MetaKey {
    CTRL,
    SHIFT,
    ALT
}