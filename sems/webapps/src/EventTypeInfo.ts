import { EventTypes } from "./EventTypes";

export class EventTypeInfo {
    static nameOfEventType : Map<EventTypes, string> = new Map();

    static init() {
        this.nameOfEventType.set(EventTypes.LOADED, "LOADED");
        this.nameOfEventType.set(EventTypes.DELETED, "DELETED");
        this.nameOfEventType.set(EventTypes.CHANGED, "CHANGED");
        this.nameOfEventType.set(EventTypes.PROPERTY_CHANGE, "PROPERTY_CHANGE");
        this.nameOfEventType.set(EventTypes.DETAILS_CHANGE, "DETAILS_CHANGE");
        this.nameOfEventType.set(EventTypes.FOCUS, "FOCUS");
        this.nameOfEventType.set(EventTypes.CUT, "CUT");
        this.nameOfEventType.set(EventTypes.COPY, "COPY");
        this.nameOfEventType.set(EventTypes.PASTE, "PASTE");
        this.nameOfEventType.set(EventTypes.TOGGLE_EXPAND, "TOGGLE_EXPAND");
        this.nameOfEventType.set(EventTypes.FOCUS_NEXT_ON_SAME_LEVEL, "FOCUS_NEXT_ON_SAME_LEVEL");
        this.nameOfEventType.set(EventTypes.FOCUS_PREV, "FOCUS_PREV");
        this.nameOfEventType.set(EventTypes.FOCUS_NEXT, "FOCUS_NEXT");
        this.nameOfEventType.set(EventTypes.FOCUS_PREV_TOP_LEVEL_OBJECT, "FOCUS_PREV_TOP_LEVEL_OBJECT");
        this.nameOfEventType.set(EventTypes.FOCUS_NEXT_TOP_LEVEL_OBJECT, "FOCUS_NEXT_TOP_LEVEL_OBJECT");
        this.nameOfEventType.set(EventTypes.FOCUS_PREV_COLUMN, "FOCUS_PREV_COLUMN");
        this.nameOfEventType.set(EventTypes.FOCUS_NEXT_COLUMN, "FOCUS_NEXT_COLUMN");
        this.nameOfEventType.set(EventTypes.NEW_SUBITEM, "NEW_SUBITEM");
        this.nameOfEventType.set(EventTypes.SCALE_DOWN, "SCALE_DOWN");
        this.nameOfEventType.set(EventTypes.SCALE_UP, "SCALE_UP");
        this.nameOfEventType.set(EventTypes.OPEN_OVERVIEW, "OPEN_OVERVIEW");
        this.nameOfEventType.set(EventTypes.DELETE, "DELETE");
        this.nameOfEventType.set(EventTypes.NEW_COLUMN_PREV, "NEW_COLUMN_PREV");
        this.nameOfEventType.set(EventTypes.NEW_COLUMN_NEXT, "NEW_COLUMN_NEXT");
        this.nameOfEventType.set(EventTypes.MOVE_COLUMN_PREV, "MOVE_COLUMN_PREV");
        this.nameOfEventType.set(EventTypes.MOVE_COLUMN_NEXT, "MOVE_COLUMN_NEXT");
        this.nameOfEventType.set(EventTypes.GO_TO_END_OF_LIST, "GO_TO_END_OF_LIST");
        this.nameOfEventType.set(EventTypes.GO_TO_END_OF_LIST_vc, "GO_TO_END_OF_LIST_vc");
        this.nameOfEventType.set(EventTypes.SCROLL_BACKWARDS, "SCROLL_BACKWARDS");
        this.nameOfEventType.set(EventTypes.SCROLL_FORWARDS, "SCROLL_FORWARDS");
        this.nameOfEventType.set(EventTypes.DO_NOTHING, "DO_NOTHING");
        this.nameOfEventType.set(EventTypes.FOCUS_LAST_FOCUSED, "FOCUS_LAST_FOCUSED");
        this.nameOfEventType.set(EventTypes.FOCUSED, "FOCUSED");
        this.nameOfEventType.set(EventTypes.TAKE_CURSOR_FROM_BOTTOM, "TAKE_CURSOR_FROM_BOTTOM");
        this.nameOfEventType.set(EventTypes.FOCUS_PREV_WORD, "FOCUS_PREV_WORD");
        this.nameOfEventType.set(EventTypes.FOCUS_LAST_WORD, "FOCUS_LAST_WORD");
        this.nameOfEventType.set(EventTypes.FOCUS_NEXT_WORD, "FOCUS_NEXT_WORD");
        this.nameOfEventType.set(EventTypes.FOCUS_NEXT_WORD_vc, "FOCUS_NEXT_WORD_vc");
        this.nameOfEventType.set(EventTypes.FOCUS_FIRST_WORD, "FOCUS_FIRST_WORD");
        this.nameOfEventType.set(EventTypes.SCALE_TO_LEVEL_ONE, "SCALE_TO_LEVEL_ONE");
        this.nameOfEventType.set(EventTypes.FOCUS_VIEW_CONTEXT, "FOCUS_VIEW_CONTEXT");
        this.nameOfEventType.set(EventTypes.REPLACE_TOP_LEVEL_OBJECT, "REPLACE_TOP_LEVEL_OBJECT");
        this.nameOfEventType.set(EventTypes.OPEN, "OPEN");
    }
}