export function partitionList<T>(items: T[], size: number): T[][] {
    if (size <= 0) {
        throw new Error("Partition size must be greater than 0");
    }

    const result = new Array<T[]>();
    let partition = new Array<T>();

    for (let i = 0; i < items.length; i++) {
        if (partition.length === size) {
            result.push(partition);
            partition = new Array<T>();
        }

        partition.push(items[i]);
    }

    if (partition.length !== 0) {
        result.push(partition);
    }

    return result;
}