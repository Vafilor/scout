export function replaceArrayItem<T>(items: T[], index: number, newItem: T): T[] {
    return items.map((value, i) => {
        if (i === index) {
            return newItem;
        }

        return value;
    });
}

export function canGoBack(historyIndex: number): boolean {
    return historyIndex > 0;
}

export function canGoForward<T>(history: T[], historyIndex: number): boolean {
    return historyIndex < history.length - 1;
}