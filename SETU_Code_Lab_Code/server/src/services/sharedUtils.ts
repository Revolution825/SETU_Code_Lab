export function extractParamNames(paramsList: string): string[] {
    const params = splitParams(paramsList);
    return params.map(p => {
        const tokens = p.trim().split(/\s+/);
        return tokens[tokens.length - 1]
    });
}

export function splitParams(paramsList: string): string[] {
    const params: string[] = [];
    let current = "";
    let depth = 0;

    for (let i = 0; i < paramsList.length; i++) {
        const c = paramsList[i];
        if (c === '<' || c === '[' || c === '{') depth++;
        if (c === '>' || c === ']' || c === '}') depth--;
        if (c === ',' && depth === 0) {
            params.push(current.trim());
            current = "";
        } else {
            current += c;
        }
    }
    if (current.trim() !== "") {
        params.push(current.trim());
    }
    return params;
}