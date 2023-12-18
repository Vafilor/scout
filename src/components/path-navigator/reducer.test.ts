import { canGoBack, canGoForward, State, reducer, ActionType } from "./reducer";

// describe("getPathUp", () => {
//     test("throws error when path is empty", () => {
//         expect(() => getPathUp("")).toThrow();
//     });

//     test("throws error when path is root", () => {
//         expect(() => getPathUp("/")).toThrow();
//     });

//     test("goes to root from a single path", () => {
//         expect(getPathUp("/Users")).toBe("/");
//     });

//     test("handles multiple directories", () => {
//         expect(getPathUp("/Users/a/b/c")).toBe("/Users/a/b");
//     });

//     test("handles going up from a file", () => {
//         expect(getPathUp("/Users/a/b/cat.png")).toBe("/Users/a/b");
//     });
// });

// describe("canGoUp", () => {
//     test("root fails", () => {
//         expect(canGoUp("/")).toBe(false);
//     });

//     test("single path succeeds", () => {
//         expect(canGoUp("/Users")).toBe(true);
//     });

//     test("multiple directories succeeds", () => {
//         expect(canGoUp("/Users/a/b")).toBe(true);
//     });
// });

describe("canGoBack", () => {
    test("Can't go back at root", () => {
        expect(canGoBack(0)).toBe(false);
    })

    test("Can go back anywhere else", () => {
        expect(canGoBack(5)).toBe(true);
    })
});

describe("canGoForward", () => {
    test("Can't go past the end", () => {
        expect(
            canGoForward(["/Users", "/Users/a", "/Users/a/b"], 2)
        ).toBe(false);
    });

    test("Can go if anywhere before end", () => {
        expect(
            canGoForward(["/Users", "/Users/a", "/Users/a/b"], 1)
        ).toBe(true);
    });
});

describe("reducer", () => {
    test("Changing path after history navigation does not preserve entire history", () => {
        const state: State = {
            history: ["/", "/User", "/User/a", "/User/a/b"],
            historyIndex: 2
        };

        const nextState = reducer(state, {
            type: ActionType.SetPath,
            payload: "/User/test"
        });

        expect(nextState.history).toEqual(["/", "/User", "/User/a", "/User/test"]);
        expect(nextState.historyIndex).toBe(3);
    });
})