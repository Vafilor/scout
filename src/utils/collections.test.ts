import { partitionList } from "./collections";

describe("partitionList", () => {
    it("handles empty case", () => {
        expect(partitionList([], 10)).toEqual([]);
    });

    it("handles partition size bigger than list size", () => {
        expect(partitionList([1, 2, 3], 10)).toEqual([[1, 2, 3]]);
    });

    it("handles partition size smaller than list size", () => {
        expect(partitionList([], 10)).toEqual([]);
    });

    it("errors on <= 0", () => {
        expect(() => partitionList([1], -1)).toThrow();
        expect(() => partitionList([1], 0)).toThrow();
    })
});