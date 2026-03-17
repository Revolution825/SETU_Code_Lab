import { ProblemLanguage } from "../types/problemLanguage";

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
