import { NavigationPath } from "../../navigation-paths/types";

export enum CurrentAction {
    None,
    AddingPath,
    RemovingPath
}

interface State {
    paths: NavigationPath[];
    currentAction: CurrentAction;
}

export enum ActionType {
    AddPath,
    RequestAddPath,
    RemovePath,
    RequestRemovePath,
    CancelCurrentAction
}

export interface AddPathAction {
    type: ActionType.AddPath;
    payload: NavigationPath;
}

export interface RequestAddPathAction {
    type: ActionType.RequestAddPath;
}

export interface RemovePathAction {
    type: ActionType.RemovePath;
    payload: {
        path: string;
        type: string;
    }
}

export interface RequestRemovePathAction {
    type: ActionType.RequestRemovePath;
}

export interface CancelCurrentAction {
    type: ActionType.CancelCurrentAction;
}

type Action =
    | AddPathAction
    | RequestAddPathAction
    | RemovePathAction
    | RequestRemovePathAction
    | CancelCurrentAction;

interface InitialStateConfig {
    paths: NavigationPath[];
}

export function getInitialState(config: InitialStateConfig): State {
    return {
        currentAction: CurrentAction.None,
        ...config
    };
}

export function reducer(state: State, action: Action): State {
    switch (action.type) {
        case ActionType.AddPath: {
            return {
                currentAction: CurrentAction.None,
                paths: state.paths.concat(action.payload)
            };
        }
        case ActionType.RequestAddPath: {
            return {
                ...state,
                currentAction: CurrentAction.AddingPath
            };
        }
        case ActionType.RequestRemovePath: {
            return {
                ...state,
                currentAction: CurrentAction.RemovingPath
            };
        }
        case ActionType.RemovePath: {
            const { path, type } = action.payload;

            return {
                currentAction: CurrentAction.None,
                paths: state.paths.filter(p => p.path !== path && p.type !== type)
            };
        }
        case ActionType.CancelCurrentAction: {
            return {
                ...state,
                currentAction: CurrentAction.None
            };
        }
    }
}