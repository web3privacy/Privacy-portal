import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

export interface GlossaryTerm {
  term: string;
  definition: string;
}

export interface GlossaryData {
  terms: GlossaryTerm[];
}

const ROOT_DIR = process.cwd();
const GLOSSARY_FILE = path.join(ROOT_DIR, "data", "glossary.yaml");
const USER_GLOSSARY_FILE = path.join(ROOT_DIR, "data", "glossary-user.yaml");

const EMPTY_GLOSSARY: GlossaryData = { terms: [] };

function loadYaml<T>(filePath: string, fallback: T): T {
  if (!fs.existsSync(filePath)) return fallback;
  const content = fs.readFileSync(filePath, "utf8");
  const parsed = yaml.load(content) as T | null;
  return parsed ?? fallback;
}

export function loadGlossaryData(): GlossaryData {
  const base = loadYaml<GlossaryData>(GLOSSARY_FILE, EMPTY_GLOSSARY);
  const user = loadYaml<GlossaryData>(USER_GLOSSARY_FILE, EMPTY_GLOSSARY);
  const baseTerms = base.terms ?? [];
  const userTerms = user.terms ?? [];
  const byTerm = new Map<string, GlossaryTerm>();
  baseTerms.forEach((t) => byTerm.set(t.term, t));
  userTerms.forEach((t) => byTerm.set(t.term, t));
  return { terms: Array.from(byTerm.values()) };
}

export function addGlossaryTerm(term: string, definition: string): void {
  const userPath = path.join(ROOT_DIR, "data");
  if (!fs.existsSync(userPath)) fs.mkdirSync(userPath, { recursive: true });

  const existing = loadYaml<GlossaryData>(USER_GLOSSARY_FILE, { terms: [] });
  const terms = existing.terms ?? [];
  terms.push({ term: term.trim(), definition: definition.trim() });

  fs.writeFileSync(
    USER_GLOSSARY_FILE,
    yaml.dump({ terms }, { lineWidth: -1 }),
    "utf8"
  );
}

export function updateGlossaryTerm(
  oldTerm: string,
  term: string,
  definition: string
): void {
  const userPath = path.join(ROOT_DIR, "data");
  if (!fs.existsSync(userPath)) fs.mkdirSync(userPath, { recursive: true });

  const existing = loadYaml<GlossaryData>(USER_GLOSSARY_FILE, { terms: [] });
  let terms = existing.terms ?? [];
  const idx = terms.findIndex((t) => t.term === oldTerm);
  const updated = { term: term.trim(), definition: definition.trim() };
  if (idx >= 0) {
    terms = [...terms];
    terms[idx] = updated;
  } else {
    terms.push(updated);
  }

  fs.writeFileSync(
    USER_GLOSSARY_FILE,
    yaml.dump({ terms }, { lineWidth: -1 }),
    "utf8"
  );
}
