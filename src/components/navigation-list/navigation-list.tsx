import { useCallback, useEffect, useReducer } from "react";
import { NavigationPath } from "../../navigation-paths/types";
import { ActionType, CurrentAction, getInitialState, reducer } from "./reducer";
import { PlusIcon } from "@radix-ui/react-icons";
import NavigationPathDialog from "./navigation-path-dialog";
import NavigationPaths from "app/services/navigation-paths";


interface Props {
    currentPath?: string;
    paths: NavigationPath[];
    selectPath: (path: string) => void;
}

export default function NavigationList({ currentPath, paths, selectPath }: Props) {
    const [state, dispatch] = useReducer(reducer, { paths }, getInitialState);
    const addPath = useCallback(async (name: string, path: string) => {
        dispatch({
            type: ActionType.AddPath,
            payload: {
                name,
                path,
                type: "favorite"
            }
        });
    }, [dispatch]);

    useEffect(() => {
        NavigationPaths.instance.update(state.paths);
    }, [state.paths]);

    return (
        <>
            <div className="p-2">
                <div className="flex pb-1 mb-1 justify-between items-center border-b text-base select-none">
                    <span>Favorites</span>
                    <button type="button" onClick={() => dispatch({
                        type: ActionType.RequestAddPath
                    })}>
                        <PlusIcon />
                    </button>
                </div>
                <div className="flex flex-col gap-2">
                    {state.paths.map(p => (
                        <button
                            key={p.path + p.type}
                            onClick={() => selectPath(p.path)}
                            data-active={currentPath === p.path}
                            className="hover:bg-slate-100 text-left w-full px-2 py-1 rounded text-ellipses overflow-hidden select-none data-[active=true]:bg-slate-200">
                            {p.name}
                        </button>
                    ))}
                </div>
            </div>
            {state.currentAction === CurrentAction.AddingPath && (
                <NavigationPathDialog
                    title="Add Favorite"
                    onClose={() => dispatch({
                        type: ActionType.CancelCurrentAction
                    })}
                    onSubmit={({ name, path }) => addPath(name, path)}
                />
            )}
        </>
    );
}