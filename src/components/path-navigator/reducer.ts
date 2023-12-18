export interface State {
    historyIndex: number; // Where we are in the history.
    history: string[]; // history of the paths navgiated. Last entry is current path.
}

export enum ActionType {
    SetPath,
    Back,
    Forward
}

interface SetPathAction {
    type: ActionType.SetPath;
    payload: string;
}

interface BackAction {
    type: ActionType.Back;
}

interface ForwardAction {
    type: ActionType.Forward;
}

type Action =
    | SetPathAction
    | BackAction
    | ForwardAction;

export function canGoBack(historyIndex: number): boolean {
    return historyIndex > 0;
}

export function canGoForward(history: string[], historyIndex: number): boolean {
    return historyIndex < history.length - 1;
}

export function getInitialState(initialPath: string): State {
    return {
        history: [initialPath],
        historyIndex: 0,
    };
}

export function reducer(state: State, action: Action): State {
    switch (action.type) {
        case ActionType.SetPath: {

            // If we change paths when we went "back", the current position will be the starting point
            // of the new history
            // action.payload = "/Users/byte"
            // ["/", "/Users", "/Users/nibble"]
            //          ^- we are here
            // ["/", "/Users", "/Users/byte"] <- new history. "/Users/nibble" is discarded
            const newHistory = state.history.slice(0, state.historyIndex + 1).concat(action.payload);

            return {
                ...state,
                history: newHistory,
                historyIndex: newHistory.length - 1,
            };
        }
        case ActionType.Back: {
            if (state.historyIndex === - 1) {
                throw new Error("Unable to go back, already at the start");
            }

            return {
                ...state,
                historyIndex: state.historyIndex - 1,
            };
        }
        case ActionType.Forward: {
            if (state.historyIndex === (state.history.length - 1)) {
                throw new Error("Unable to go forward, already at the end");
            }

            return {
                ...state,
                historyIndex: state.historyIndex + 1,
            };
        }
    }
}