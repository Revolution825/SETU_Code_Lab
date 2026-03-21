import type { ProblemLanguage } from "./types/ProblemLanguage";

const BASE_URL = import.meta.env.VITE_API_URL ?? "";

export function jsonToParamValues(json: string, paramNames: string[]): string {
  if (!json) return "{}";
  if (json === "null") return "{}";
  const obj = JSON.parse(json);
  return paramNames.map((name) => JSON.stringify(obj[name])).join(", ");
}

async function fetchWithRefresh(url: string, options: RequestInit = {}) {
  let response = await fetch(BASE_URL + url, {
    ...options,
    credentials: "include",
  });

  if (response.status === 401) {
    const refresh = await fetch(BASE_URL + "/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (refresh.ok) {
      response = await fetch(BASE_URL + url, {
        ...options,
        credentials: "include",
      });
    }
  }

  return response;
}

export const api = {
  get: (url: string) => fetchWithRefresh(url, { method: "GET" }),
  post: (url: string, body: object) =>
    fetchWithRefresh(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  delete: (url: string) => fetchWithRefresh(url, { method: "DELETE" }),
};

export function getParamNames(entry: ProblemLanguage): string[] {
  if (entry.language === "java") {
    const signatureRegex =
      /public\s+static\s+([\w<>\[\], ?]+)\s+(\w+)\s*\(([^)]*)\)/;
    const match = entry.placeholder_code.match(signatureRegex);
    if (!match)
      throw new Error(
        "Could not find method signature in Java placeholder code.",
      );
    return extractParamNames(match[3]);
  } else if (entry.language === "python") {
    const signatureRegex = /def\s+\w+\s*\(([^)]*)\)/;
    const match = entry.placeholder_code.match(signatureRegex);
    if (!match)
      throw new Error(
        "Could not find method signature in Python placeholder code.",
      );
    return match[1]
      .split(",")
      .map((p) => p.trim().split(":")[0].trim())
      .filter(Boolean);
  }
  throw new Error("Unsupported language");
}

export function extractParamNames(paramsList: string): string[] {
  const params = splitParams(paramsList);
  return params.map((p) => {
    const tokens = p.trim().split(/\s+/);
    if (tokens.length < 2) {
      throw new Error(`Parameter "${p.trim()}" is missing a type.`);
    }
    return tokens[tokens.length - 1];
  });
}

export function splitParams(paramsList: string): string[] {
  const params: string[] = [];
  let current = "";
  let depth = 0;

  for (let i = 0; i < paramsList.length; i++) {
    const c = paramsList[i];
    if (c === "<" || c === "[" || c === "{") depth++;
    if (c === ">" || c === "]" || c === "}") depth--;
    if (c === "," && depth === 0) {
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
