import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

export interface LibraryDocument {
  title: string;
  author: string;
  year?: number;
  description?: string;
  url?: string;
  imageUrl?: string;
}

export interface LibraryArticle extends LibraryDocument {}

export interface LibraryBook {
  title: string;
  author: string;
  recommendedBy?: string;
  isbn?: string;
  imageUrl?: string;
  url?: string;
  /** Open Library / catalog URL for lookup */
  catalogUrl?: string;
}

export interface LibraryData {
  keyDocuments: LibraryDocument[];
  importantArticles: LibraryArticle[];
  books: Record<string, LibraryBook[]>;
}

const ROOT_DIR = process.cwd();
const LIBRARY_FILE = path.join(ROOT_DIR, "data", "library.yaml");
const USER_LIBRARY_FILE = path.join(ROOT_DIR, "data", "library-user.yaml");
const LIBRARY_RECOMMENDATIONS_FILE = path.join(
  ROOT_DIR,
  "data",
  "library-recommendations.yaml"
);

export interface LibraryRecommendationsSchema {
  recommendations: Record<string, string[]>;
}

const EMPTY_RECOMMENDATIONS: LibraryRecommendationsSchema = {
  recommendations: {},
};

const OPEN_LIBRARY_COVER = "https://covers.openlibrary.org/b/isbn";

function loadYaml<T>(filePath: string, fallback: T): T {
  if (!fs.existsSync(filePath)) return fallback;
  const content = fs.readFileSync(filePath, "utf8");
  const parsed = yaml.load(content) as T | null;
  return parsed ?? fallback;
}

const OPEN_LIBRARY_SEARCH = "https://openlibrary.org/search";

function bookImageUrl(book: LibraryBook): string | undefined {
  if (book.imageUrl) return book.imageUrl;
  if (book.isbn) return `${OPEN_LIBRARY_COVER}/${book.isbn}-M.jpg`;
  return undefined;
}

function bookCatalogUrl(book: LibraryBook): string {
  if (book.url) return book.url;
  if (book.isbn) return `https://openlibrary.org/isbn/${book.isbn}`;
  const q = encodeURIComponent(`${book.title} ${book.author}`);
  return `${OPEN_LIBRARY_SEARCH}?q=${q}`;
}

function enrichBooks(books: Record<string, LibraryBook[]>): Record<string, LibraryBook[]> {
  const out: Record<string, LibraryBook[]> = {};
  for (const [cat, list] of Object.entries(books)) {
    out[cat] = (list ?? []).map((b) => ({
      ...b,
      imageUrl: bookImageUrl(b),
    }));
  }
  return out;
}

export function loadLibraryData(): LibraryData {
  const base = loadYaml<LibraryData>(LIBRARY_FILE, {
    keyDocuments: [],
    importantArticles: [],
    books: {},
  });
  const user = loadYaml<LibraryData>(USER_LIBRARY_FILE, {
    keyDocuments: [],
    importantArticles: [],
    books: {},
  });

  const keyDocuments = [...(base.keyDocuments ?? []), ...(user.keyDocuments ?? [])];
  const importantArticles = [
    ...(base.importantArticles ?? []),
    ...(user.importantArticles ?? []),
  ];
  const books: Record<string, LibraryBook[]> = {};
  const cats = new Set([
    ...Object.keys(base.books ?? {}),
    ...Object.keys(user.books ?? {}),
  ]);
  for (const cat of cats) {
    const baseList = (base.books ?? {})[cat] ?? [];
    const userList = (user.books ?? {})[cat] ?? [];
    const merged = [...baseList, ...userList];
    const enriched = enrichBooks({ [cat]: merged })[cat];
    books[cat] = enriched.map((b) => ({
      ...b,
      catalogUrl: bookCatalogUrl(b),
    }));
  }

  return {
    keyDocuments,
    importantArticles,
    books,
  };
}

export type AddLibraryItemType = "document" | "article" | "book";

export interface AddLibraryItemInput {
  type: AddLibraryItemType;
  title: string;
  author: string;
  year?: number;
  description?: string;
  recommendedBy?: string;
  category?: string;
  isbn?: string;
  url?: string;
}

export function addLibraryItem(input: AddLibraryItemInput): void {
  const userPath = path.join(ROOT_DIR, "data");
  if (!fs.existsSync(userPath)) fs.mkdirSync(userPath, { recursive: true });

  const existing = loadYaml<LibraryData>(USER_LIBRARY_FILE, {
    keyDocuments: [],
    importantArticles: [],
    books: {},
  });

  if (input.type === "document") {
    const items = existing.keyDocuments ?? [];
    items.push({
      title: input.title.trim(),
      author: input.author.trim(),
      year: input.year,
      description: input.description?.trim(),
      url: input.url?.trim(),
    });
    existing.keyDocuments = items;
  } else if (input.type === "article") {
    const items = existing.importantArticles ?? [];
    items.push({
      title: input.title.trim(),
      author: input.author.trim(),
      year: input.year,
      description: input.description?.trim(),
      url: input.url?.trim(),
    });
    existing.importantArticles = items;
  } else if (input.type === "book") {
    const cat = (input.category?.trim() ?? "Other").trim() || "Other";
    const book: LibraryBook = {
      title: input.title.trim(),
      author: input.author.trim(),
      recommendedBy: input.recommendedBy?.trim(),
      isbn: input.isbn?.trim(),
      url: input.url?.trim(),
    };
    const cats = existing.books ?? {};
    const list = cats[cat] ?? [];
    list.push(book);
    cats[cat] = list;
    existing.books = cats;
  }

  fs.writeFileSync(
    USER_LIBRARY_FILE,
    yaml.dump(existing, { lineWidth: -1 }),
    "utf8"
  );
}

function isEthereumAddress(value: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(value);
}

export function loadLibraryRecommendations(): LibraryRecommendationsSchema {
  return loadYaml<LibraryRecommendationsSchema>(
    LIBRARY_RECOMMENDATIONS_FILE,
    EMPTY_RECOMMENDATIONS
  );
}

export function addLibraryRecommendation(itemKey: string, address: string): void {
  const normalizedAddr = address.trim().toLowerCase();
  if (!isEthereumAddress(normalizedAddr)) return;

  const schema = loadLibraryRecommendations();
  const recs = schema.recommendations ?? {};
  const existing = recs[itemKey] ?? [];
  if (existing.includes(normalizedAddr)) return;

  recs[itemKey] = [...existing, normalizedAddr];
  schema.recommendations = recs;

  const dir = path.dirname(LIBRARY_RECOMMENDATIONS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    LIBRARY_RECOMMENDATIONS_FILE,
    yaml.dump(schema, { lineWidth: -1 }),
    "utf8"
  );
}

export function getRecommendCounts(
  schema: LibraryRecommendationsSchema
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const [key, addrs] of Object.entries(schema.recommendations ?? {})) {
    counts[key] = addrs?.length ?? 0;
  }
  return counts;
}

export function getRecommendedByAddress(
  schema: LibraryRecommendationsSchema,
  address: string
): Set<string> {
  const normalized = address.trim().toLowerCase();
  if (!isEthereumAddress(normalized)) return new Set();

  const keys = new Set<string>();
  for (const [key, addrs] of Object.entries(schema.recommendations ?? {})) {
    if (addrs?.includes(normalized)) keys.add(key);
  }
  return keys;
}
