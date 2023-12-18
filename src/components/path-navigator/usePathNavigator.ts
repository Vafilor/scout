import { useCallback, useReducer } from "react";
import { ActionType, getInitialState, reducer } from "./reducer";
import PathClient from "app/services/path";

export default function usePathNavigator(initialPath: string) {
    const [state, dispatch] = useReducer(reducer, initialPath, getInitialState);

    const setPath = useCallback((newPath: string) => {
        dispatch({
            type: ActionType.SetPath,
            payload: newPath
        });
    }, [dispatch]);

    const goUp = useCallback(() => {
        dispatch({
            type: ActionType.SetPath,
            payload: PathClient.instance.getPathUp(state.history[state.historyIndex])
        });
    }, [state.history, state.historyIndex, dispatch]);

    const goBack = useCallback(() => {
        dispatch({
            type: ActionType.Back
        });
    }, [dispatch]);

    const goForward = useCallback(() => {
        dispatch({
            type: ActionType.Forward
        });
    }, [dispatch]);

    return {
        state,
        path: state.history[state.historyIndex],
        setPath,
        goUp,
        goBack,
        goForward
    };
}