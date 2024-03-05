import { AppFile, FileListMode, FileType } from "app/types/filesystem";
import { ActionType, State, getInitialState, reducer } from "./reducer";

function createDefaultInitialState(): State {
    return getInitialState({
        fileListMode: FileListMode.List,
        showHiddenFiles: false
    });
}

// Adapted from https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function createRandomCharacters(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

function createRandomFile({ hidden }: { hidden: boolean }): AppFile {
    let name = hidden ? "." : "";
    name += createRandomCharacters(5);

    let path = "/";
    for (let i = 0; i < 5; i++) {
        path += createRandomCharacters(10) + "/";
    }

    path += name;

    return {
        name,
        path,
        type: FileType.File
    };
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

    test("Changing visible files does not change the currently viewed file", () => {
        const allFiles = [
            createRandomFile({ hidden: true }),
            createRandomFile({ hidden: false }),
            createRandomFile({ hidden: false }),
        ];

        const state: State = {
            ...createDefaultInitialState(),
            allFiles,
            files: [
                allFiles[1],
                allFiles[2]
            ],
            currentFileIndex: 0
        };

        const finalState = reducer(state, {
            type: ActionType.SetShowHiddenFiles,
            payload: true
        });

        const currentFile = finalState.files[finalState.currentFileIndex];
        expect(currentFile.path).toBe(allFiles[1].path);
    });
});