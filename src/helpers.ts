
export function assign(obj: any, keyPath: any[], value: any): void {
    let lastKeyIndex = keyPath.length - 1;

    for (let i = 0; i < lastKeyIndex; ++ i) {
        let key = keyPath[i];
        if (!(key in obj)){
            obj[key] = {}
        }
        obj = obj[key];
    }

    obj[keyPath[lastKeyIndex]] = value;
}

export function removeDuplicates<T>(array: T[]): T[] {
    return Array.from(new Set(array))
}
