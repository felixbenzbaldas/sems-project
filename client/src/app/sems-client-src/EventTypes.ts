export enum EventTypes {
    LOADED,
    DELETED,
    CHANGED,
    PROPERTY_CHANGE,
    DETAILS_CHANGE,
    FOCUS,
    CUT,
    COPY,
    PASTE,
    TOGGLE_EXPAND,
    FOCUS_PREV,
    FOCUS_NEXT,
    JUMP_FORWARD,
    JUMP_BACKWARD,
    FOCUS_PREV_TOP_LEVEL_OBJECT,
    FOCUS_NEXT_TOP_LEVEL_OBJECT,
    FOCUS_PREV_COLUMN,
    FOCUS_NEXT_COLUMN,
    NEW_SUBITEM,
    SCALE_DOWN,
    SCALE_UP,
    OPEN_OVERVIEW,
    DELETE,
    NEW_COLUMN_PREV,
    NEW_COLUMN_NEXT,
    MOVE_COLUMN_PREV,
    MOVE_COLUMN_NEXT,
    GO_TO_END_OF_LIST,
    GO_TO_END_OF_LIST_vc, // "vc" = for view context
    SCROLL_BACKWARDS,
    SCROLL_FORWARDS,
    DO_NOTHING,
    FOCUS_LAST_FOCUSED,
    FOCUSED,
    TAKE_CURSOR_FROM_BOTTOM,
    FOCUS_PREV_WORD,
    FOCUS_LAST_WORD,
    FOCUS_NEXT_WORD,
    FOCUS_NEXT_WORD_vc,
    FOCUS_FIRST_WORD,
    SCALE_TO_LEVEL_ONE,
    FOCUS_VIEW_CONTEXT,
    REPLACE_TOP_LEVEL_OBJECT,
    OPEN,
    CURSOR_HINT
}