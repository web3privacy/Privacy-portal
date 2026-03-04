import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { getMostPopularTools } from "@/lib/stacks-view";
import type {
  AppData,
  DataSchema,
  LikeCounts,
  LikesFileSchema,
  PopularTool,
  PopularToolsFileSchema,
  Stacks,
  Tools,
} from "@/types";

const ROOT_DIR = process.cwd();
const BASE_DATA_FILE = path.join(ROOT_DIR, "data.yaml");
const DATA_DIR = path.join(ROOT_DIR, "data");
const USER_SUBMITTED_DATA_FILE = path.join(DATA_DIR, "user-submitted.yaml");
const POPULAR_TOOLS_FILE = path.join(DATA_DIR, "popular-tools.yaml");
const LIKES_FILE = path.join(DATA_DIR, "likes.yaml");

const EMPTY_DATA_SCHEMA: DataSchema = {
  tools: {},
  stacks: {},
};

const EMPTY_POPULAR_TOOLS_SCHEMA: PopularToolsFileSchema = {
  popular_tools: [],
};

const EMPTY_LIKES_SCHEMA: LikesFileSchema = {
  likes: {},
};

function loadYamlFile<T>(filePath: string, fallback: T): T {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const parsed = yaml.load(fileContents) as T | null;
  return parsed ?? fallback;
}

export function loadYamlData(filePath: string): DataSchema {
  return loadYamlFile<DataSchema>(filePath, EMPTY_DATA_SCHEMA);
}

export function mergeTools(baseTools: Tools, extraTools: Tools): Tools {
  const merged: Tools = { ...baseTools };

  for (const [categoryKey, categoryTools] of Object.entries(extraTools)) {
    merged[categoryKey] = {
      ...(merged[categoryKey] ?? {}),
      ...categoryTools,
    };
  }

  return merged;
}

export function loadUserSubmittedData(): DataSchema {
  return loadYamlFile<DataSchema>(USER_SUBMITTED_DATA_FILE, EMPTY_DATA_SCHEMA);
}

export function loadPopularToolsFile(): PopularToolsFileSchema {
  return loadYamlFile<PopularToolsFileSchema>(POPULAR_TOOLS_FILE, EMPTY_POPULAR_TOOLS_SCHEMA);
}

function isEthereumAddress(value: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(value);
}

function normalizeLikesSchema(value: LikesFileSchema): LikesFileSchema {
  const normalized: LikesFileSchema = { likes: {} };

  for (const [stackId, addresses] of Object.entries(value.likes ?? {})) {
    if (!Array.isArray(addresses)) {
      continue;
    }

    const unique = Array.from(
      new Set(
        addresses
          .map((address) => String(address).trim().toLowerCase())
          .filter((address) => isEthereumAddress(address))
      )
    );

    if (unique.length > 0) {
      normalized.likes[stackId] = unique;
    }
  }

  return normalized;
}

export function loadLikesFile(): LikesFileSchema {
  const loaded = loadYamlFile<LikesFileSchema>(LIKES_FILE, EMPTY_LIKES_SCHEMA);
  return normalizeLikesSchema(loaded);
}

export function saveLikesFile(data: LikesFileSchema): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const normalized = normalizeLikesSchema(data);
  fs.writeFileSync(LIKES_FILE, yaml.dump(normalized, { noRefs: true }), "utf8");
}

export function getLikeCountsForStacks(
  stacks: Stacks,
  likesSchema: LikesFileSchema = loadLikesFile()
): LikeCounts {
  const stackIds = new Set(Object.values(stacks).map((stack) => stack.id));
  const counts: LikeCounts = {};

  for (const stackId of stackIds) {
    counts[stackId] = 0;
  }

  for (const [stackId, addresses] of Object.entries(likesSchema.likes)) {
    if (!stackIds.has(stackId)) {
      continue;
    }
    counts[stackId] = addresses.length;
  }

  return counts;
}

export function saveUserSubmittedData(data: DataSchema): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(USER_SUBMITTED_DATA_FILE, yaml.dump(data, { noRefs: true }), "utf8");
}

export function savePopularToolsFile(popularTools: PopularTool[]): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(
    POPULAR_TOOLS_FILE,
    yaml.dump({ popular_tools: popularTools }, { noRefs: true }),
    "utf8"
  );
}

export function loadAppData(): AppData {
  const baseData = loadYamlData(BASE_DATA_FILE);
  const userData = loadUserSubmittedData();
  const mergedTools = mergeTools(baseData.tools, userData.tools);
  const mergedStacks = {
    ...baseData.stacks,
    ...userData.stacks,
  };
  const likesSchema = loadLikesFile();
  const likeCounts = getLikeCountsForStacks(mergedStacks, likesSchema);

  const popularToolsFile = loadPopularToolsFile();
  const popularTools =
    popularToolsFile.popular_tools.length > 0
      ? popularToolsFile.popular_tools
      : getMostPopularTools(mergedTools, Object.values(mergedStacks), 10);

  if (popularToolsFile.popular_tools.length === 0 && popularTools.length > 0) {
    savePopularToolsFile(popularTools);
  }

  return {
    tools: mergedTools,
    stacks: mergedStacks,
    popularTools,
    likeCounts,
  };
}

export function getDataFiles() {
  return {
    base: BASE_DATA_FILE,
    userSubmitted: USER_SUBMITTED_DATA_FILE,
    popularTools: POPULAR_TOOLS_FILE,
    likes: LIKES_FILE,
  };
}
