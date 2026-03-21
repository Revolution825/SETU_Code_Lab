const BASE_URL = import.meta.env.VITE_API_URL ?? "";

export function jsonToParamValues(json: string): string {
    if (!json) return "{}";
    if (json === "null") return "{}";
    const obj = JSON.parse(json);
    return Object.values(obj).map(v => JSON.stringify(v)).join(", ");
}

async function fetchWithRefresh(url: string, options: RequestInit = {}) {
    let response = await fetch(BASE_URL + url, { ...options, credentials: "include" });

    if (response.status === 401) {
        const refresh = await fetch(BASE_URL + "/api/auth/refresh", {
            method: "POST",
            credentials: "include"
        });

        if (refresh.ok) {
            response = await fetch(BASE_URL + url, { ...options, credentials: "include" });
        }
    }

    return response;
}

export const api = {
    get: (url: string) =>
        fetchWithRefresh(url, { method: "GET" }),
    post: (url: string, body: object) =>
        fetchWithRefresh(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        }),
    delete: (url: string) =>
        fetchWithRefresh(url, { method: "DELETE" }),
};