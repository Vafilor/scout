import { FileListMode, FileType } from "app/types/filesystem";
import { ActionType, State, getInitialState, reducer } from "./reducer";

function createDefaultInitialState(): State {
    return getInitialState({
        fileListMode: FileListMode.List,
        showHiddenFiles: false
    });
}

describe("reducer", () => {
    describe("SetPath", () => {
        test("Changing path after history navigation does not preserve entire history", () => {
            const state: State = {
                ...createDefaultInitialState(),
                history: [{ path: "/" }, { path: "/User" }, { path: "/User/a" }, { path: "/User/a/b" }],
                historyIndex: 2
            };

            const nextState = reducer(state, {
                type: ActionType.SetPath,
                payload: { path: "/User/test" }
            });

            expect(nextState.history).toEqual([{ path: "/" }, { path: "/User" }, { path: "/User/a" }, { path: "/User/test" }]);
            expect(nextState.historyIndex).toBe(3);
        });
    });

    test("Going back when there is no history throws an error", () => {
        expect(() => {
            reducer(createDefaultInitialState(), { type: ActionType.Back })
        }).toThrow();
    });

    test("Going forward when there is no more throws an error", () => {
        const state = getInitialState({
            fileListMode: FileListMode.List,
            showHiddenFiles: false
        });

        expect(() => {
            reducer(state, { type: ActionType.Forward })
        }).toThrow();
    });

    describe("SetCurrentPathInfo", () => {
        test("Only modifies the current path item", () => {
            const state: State = {
                ...createDefaultInitialState(),
                history: [{
                    path: "/", type: FileType.Directory
                }, {
                    path: "/User", type: FileType.Directory
                }, {
                    path: "/User/a.png"
                }, {
                    path: "/User/a/b"
                }],
                historyIndex: 2
            };

            const nextState = reducer(state, {
                type: ActionType.SetCurrentPathInfo,
                payload: { type: FileType.File }
            });

            expect(nextState.history[2]).toEqual({
                path: "/User/a.png",
                type: FileType.File
            });
        });
    });
});