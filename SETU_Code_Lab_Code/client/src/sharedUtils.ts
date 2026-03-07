export function jsonToParamValues(json: string): string {
    const obj = JSON.parse(json);
    return Object.values(obj).map(v =>
        typeof v === "object" ? JSON.stringify(v) : v
    ).join(", ");
}