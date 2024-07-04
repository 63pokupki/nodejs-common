export function tryParseJson(str: any) {
    try {
        return JSON.parse(str);
    } catch {
        return null;
    }
}

export function tryJsonToString(str: any) :string {
    try {
        return JSON.stringify(str);
    } catch {
        return '';
    }
}
