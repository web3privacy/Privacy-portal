#!/usr/bin/env node

/**
 * Script to import people data from web3privacy/data GitHub repository
 * Fetches YAML files from https://github.com/web3privacy/data/tree/main/src/people
 * and converts them to our People database format
 */

import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

const PEOPLE_USER_FILE = path.join(ROOT_DIR, "data", "people-user.yaml");
const GITHUB_API_BASE = "https://api.github.com/repos/web3privacy/data/contents/src/people";

// Load existing people to avoid duplicates
function loadExistingPeople() {
  if (!fs.existsSync(PEOPLE_USER_FILE)) {
    return { people: [] };
  }
  try {
    const content = fs.readFileSync(PEOPLE_USER_FILE, "utf8");
    return yaml.load(content) || { people: [] };
  } catch (error) {
    console.error("Error loading people file:", error);
    return { people: [] };
  }
}

// Generate person ID from name
function generatePersonId(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Extract link type from URL
function getLinkType(url) {
  if (!url) return "other";
  const lower = url.toLowerCase();
  if (lower.includes("github.com")) return "github";
  if (lower.includes("twitter.com") || lower.includes("x.com")) return "twitter";
  if (lower.includes("linkedin.com")) return "linkedin";
  if (lower.includes("telegram.org") || lower.includes("t.me")) return "telegram";
  if (lower.includes("discord")) return "discord";
  return "web";
}

// Convert GitHub person data to our format
function convertPersonData(githubData, filename) {
  const personId = generatePersonId(githubData.name || filename.replace(".yaml", "").replace(".yml", ""));
  
  const person = {
    id: personId,
    name: githubData.name || githubData.displayName || filename,
    displayName: githubData.displayName || githubData.name,
    title: githubData.title || githubData.role || githubData.bio,
    description: githubData.description || githubData.bio || githubData.about,
    avatar: githubData.avatar || githubData.image || githubData.photo,
    links: [],
    tags: [],
    organizations: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Process links
  if (githubData.links) {
    if (typeof githubData.links === "object" && !Array.isArray(githubData.links)) {
      Object.entries(githubData.links).forEach(([key, url]) => {
        if (url && typeof url === "string") {
          person.links.push({
            type: getLinkType(url),
            url: url,
            label: key === "web" ? url : undefined,
          });
        }
      });
    } else if (Array.isArray(githubData.links)) {
      githubData.links.forEach((link) => {
        if (typeof link === "string") {
          person.links.push({
            type: getLinkType(link),
            url: link,
          });
        } else if (typeof link === "object" && link.url) {
          person.links.push({
            type: getLinkType(link.url),
            url: link.url,
            label: link.label || link.name,
          });
        }
      });
    }
  }

  // Process tags/categories
  if (githubData.tags) {
    person.tags = Array.isArray(githubData.tags) ? githubData.tags : [githubData.tags];
  }
  if (githubData.categories) {
    const cats = Array.isArray(githubData.categories) ? githubData.categories : [githubData.categories];
    person.tags = [...(person.tags || []), ...cats];
  }

  // Process organizations
  if (githubData.organization || githubData.org) {
    person.organizations = [githubData.organization || githubData.org];
  }
  if (githubData.organizations && Array.isArray(githubData.organizations)) {
    person.organizations = [...(person.organizations || []), ...githubData.organizations];
  }

  // Process projects
  if (githubData.projects && Array.isArray(githubData.projects)) {
    person.projects = githubData.projects.map((proj) => {
      if (typeof proj === "string") {
        return { projectId: proj };
      }
      return {
        projectId: proj.id || proj.projectId || proj.name,
        role: proj.role,
      };
    });
  }

  // Process stacks
  if (githubData.stacks && Array.isArray(githubData.stacks)) {
    person.stacks = githubData.stacks.map((stack) => {
      if (typeof stack === "string") {
        return { stackId: stack };
      }
      return {
        stackId: stack.id || stack.stackId || stack.name,
        role: stack.role,
      };
    });
  }

  return person;
}

// Fetch file contents from GitHub
async function fetchGitHubFile(downloadUrl) {
  try {
    const response = await fetch(downloadUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Error fetching file ${downloadUrl}:`, error);
    return null;
  }
}

// Main import function
async function importPeopleFromGitHub() {
  console.log("Starting import of people from GitHub...");

  const existingData = loadExistingPeople();
  const existingPeople = existingData.people || [];
  const peopleMap = new Map();

  // Add existing people to map
  existingPeople.forEach((person) => {
    peopleMap.set(person.id, person);
  });

  try {
    // Fetch list of files in the people directory
    const response = await fetch(GITHUB_API_BASE);
    if (!response.ok) {
      throw new Error(`Failed to fetch directory listing: ${response.status}`);
    }

    const files = await response.json();
    console.log(`Found ${files.length} files in GitHub repository`);

    let imported = 0;
    let updated = 0;
    let errors = 0;

    for (const file of files) {
      if (file.type !== "file" || (!file.name.endsWith(".yaml") && !file.name.endsWith(".yml"))) {
        continue;
      }

      try {
        const content = await fetchGitHubFile(file.download_url);
        if (!content) {
          errors++;
          continue;
        }

        const githubData = yaml.load(content);
        if (!githubData || typeof githubData !== "object") {
          console.warn(`Skipping ${file.name}: invalid YAML structure`);
          errors++;
          continue;
        }

        const person = convertPersonData(githubData, file.name);
        const existing = peopleMap.get(person.id);

        if (existing) {
          // Merge with existing person
          const merged = {
            ...existing,
            ...person,
            links: [...(existing.links || []), ...person.links],
            tags: [...new Set([...(existing.tags || []), ...(person.tags || [])])],
            organizations: [...new Set([...(existing.organizations || []), ...(person.organizations || [])])],
            updatedAt: new Date().toISOString(),
          };
          peopleMap.set(person.id, merged);
          updated++;
        } else {
          peopleMap.set(person.id, person);
          imported++;
        }
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        errors++;
      }
    }

    // Convert map to array
    const allPeople = Array.from(peopleMap.values());

    // Save to people-user.yaml
    const output = {
      people: allPeople,
    };

    fs.writeFileSync(PEOPLE_USER_FILE, yaml.dump(output, { lineWidth: 120 }));

    console.log(`\nImport complete!`);
    console.log(`- New people imported: ${imported}`);
    console.log(`- Existing people updated: ${updated}`);
    console.log(`- Errors: ${errors}`);
    console.log(`- Total people: ${allPeople.length}`);
    console.log(`\nData saved to: ${PEOPLE_USER_FILE}`);
  } catch (error) {
    console.error("Error importing people:", error);
    process.exit(1);
  }
}

// Run the import
importPeopleFromGitHub().catch(console.error);
