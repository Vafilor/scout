import { getExtension } from "./files";

describe("getExtension", () => {
    it("handles no . character", () => {
        expect(getExtension("hello")).toBeNull();
    });

    it("Handles single dot", () => {
        expect(getExtension(".")).toBe("");
    });

    it("Handles an extension", () => {
        expect(getExtension("hello.txt")).toBe("txt");
    })
});