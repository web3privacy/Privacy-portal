import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import type { PeopleData, Person } from "@/types/people";

// Get root directory - handle both monorepo and standalone cases
const ROOT_DIR = (() => {
  const cwd = process.cwd();
  // If we're in apps/web, go up two levels to get to root
  if (cwd.endsWith('apps/web')) {
    return path.resolve(cwd, '..', '..');
  }
  // If we're in the root, use it directly
  if (fs.existsSync(path.join(cwd, 'data', 'people.yaml'))) {
    return cwd;
  }
  // Try to find the root by going up
  let current = cwd;
  for (let i = 0; i < 5; i++) {
    if (fs.existsSync(path.join(current, 'data', 'people.yaml'))) {
      return current;
    }
    current = path.resolve(current, '..');
  }
  return cwd;
})();

const PEOPLE_FILE = path.join(ROOT_DIR, "data", "people.yaml");
const USER_PEOPLE_FILE = path.join(ROOT_DIR, "data", "people-user.yaml");

const EMPTY_PEOPLE: PeopleData = {
  people: [],
};

function loadYaml<T>(filePath: string, fallback: T): T {
  if (!fs.existsSync(filePath)) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[loadYaml] File not found: ${filePath}`);
    }
    return fallback;
  }
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const parsed = yaml.load(content) as T | null;
    if (!parsed && process.env.NODE_ENV === 'development') {
      console.warn(`[loadYaml] Parsed data is null for: ${filePath}`);
    }
    return parsed ?? fallback;
  } catch (error) {
    console.error(`[loadYaml] Error loading YAML file ${filePath}:`, error);
    return fallback;
  }
}

export function loadPeopleData(): PeopleData {
  const base = loadYaml<PeopleData>(PEOPLE_FILE, EMPTY_PEOPLE);
  const user = loadYaml<PeopleData>(USER_PEOPLE_FILE, EMPTY_PEOPLE);

  // Merge base and user data
  // For people, we merge by id (user data overrides base)
  const peopleMap = new Map<string, Person>();
  
  // Add base people
  base.people?.forEach(person => {
    peopleMap.set(person.id, person);
  });
  
  // Override with user people
  user.people?.forEach(person => {
    peopleMap.set(person.id, person);
  });

  const merged: PeopleData = {
    people: Array.from(peopleMap.values()),
  };

  if (process.env.NODE_ENV === 'development') {
    console.log('[loadPeopleData] Loaded:', {
      people: merged.people.length,
    });
  }

  return merged;
}

export function getPersonById(data: PeopleData, id: string): Person | undefined {
  return data.people.find(p => p.id === id);
}

export function getPersonByName(data: PeopleData, name: string): Person | undefined {
  return data.people.find(p => 
    p.name.toLowerCase() === name.toLowerCase() ||
    p.displayName?.toLowerCase() === name.toLowerCase()
  );
}

export function searchPeople(data: PeopleData, query: string): Person[] {
  const lowerQuery = query.toLowerCase();
  return data.people.filter(person =>
    person.name.toLowerCase().includes(lowerQuery) ||
    person.displayName?.toLowerCase().includes(lowerQuery) ||
    person.title?.toLowerCase().includes(lowerQuery) ||
    person.description?.toLowerCase().includes(lowerQuery) ||
    person.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}
