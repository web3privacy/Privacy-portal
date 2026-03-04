#!/usr/bin/env node

/**
 * Script to extract people from Explorer projects and add them to People database
 * This script:
 * 1. Loads all projects from Explorer data
 * 2. Extracts team members from each project
 * 3. Creates/updates People entries, avoiding duplicates
 * 4. Links projects to people
 */

import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

const EXPLORER_DATA_DIR = path.join(ROOT_DIR, "data", "explorer-data", "src", "projects");
const PEOPLE_FILE = path.join(ROOT_DIR, "data", "people-user.yaml");

// Load existing people to avoid duplicates
function loadExistingPeople() {
  if (!fs.existsSync(PEOPLE_FILE)) {
    return { people: [] };
  }
  try {
    const content = fs.readFileSync(PEOPLE_FILE, "utf8");
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

// Check if person already exists
function personExists(people, name) {
  return people.some(
    (p) =>
      p.name.toLowerCase() === name.toLowerCase() ||
      p.displayName?.toLowerCase() === name.toLowerCase()
  );
}

// Extract link type from URL
function getLinkType(url) {
  if (!url) return "other";
  if (url.includes("github.com")) return "github";
  if (url.includes("twitter.com") || url.includes("x.com")) return "twitter";
  if (url.includes("linkedin.com")) return "linkedin";
  if (url.includes("telegram.org")) return "telegram";
  if (url.includes("discord")) return "discord";
  return "web";
}

// Main extraction function
async function extractPeopleFromProjects() {
  console.log("Starting extraction of people from projects...");

  const existingData = loadExistingPeople();
  const existingPeople = existingData.people || [];
  const peopleMap = new Map();

  // Add existing people to map
  existingPeople.forEach((person) => {
    const key = person.name.toLowerCase();
    peopleMap.set(key, person);
  });

  // Load all projects
  if (!fs.existsSync(EXPLORER_DATA_DIR)) {
    console.error(`Explorer data directory not found: ${EXPLORER_DATA_DIR}`);
    return;
  }

  const projectDirs = fs.readdirSync(EXPLORER_DATA_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  console.log(`Found ${projectDirs.length} projects`);

  let newPeopleCount = 0;
  let updatedPeopleCount = 0;

  for (const projectId of projectDirs) {
    const projectFile = path.join(EXPLORER_DATA_DIR, projectId, "index.yaml");
    
    if (!fs.existsSync(projectFile)) {
      continue;
    }

    try {
      const projectContent = fs.readFileSync(projectFile, "utf8");
      const project = yaml.load(projectContent);

      if (!project.team?.teammembers || !Array.isArray(project.team.teammembers)) {
        continue;
      }

      for (const member of project.team.teammembers) {
        if (!member.name || member.anonymous) {
          continue;
        }

        const nameKey = member.name.toLowerCase();
        let person = peopleMap.get(nameKey);

        if (!person) {
          // Create new person
          const personId = generatePersonId(member.name);
          person = {
            id: personId,
            name: member.name,
            title: member.role,
            links: [],
            projects: [],
            createdAt: new Date().toISOString(),
          };

          if (member.link) {
            person.links.push({
              type: getLinkType(member.link),
              url: member.link,
            });
          }

          peopleMap.set(nameKey, person);
          newPeopleCount++;
        } else {
          // Update existing person
          if (member.role && !person.title) {
            person.title = member.role;
          }
          if (member.link) {
            const linkType = getLinkType(member.link);
            const linkExists = person.links?.some(
              (l) => l.type === linkType && l.url === member.link
            );
            if (!linkExists) {
              if (!person.links) person.links = [];
              person.links.push({
                type: linkType,
                url: member.link,
              });
            }
          }
          updatedPeopleCount++;
        }

        // Add project reference
        if (!person.projects) {
          person.projects = [];
        }
        const projectExists = person.projects.some((p) => p.projectId === projectId);
        if (!projectExists) {
          person.projects.push({
            projectId: projectId,
            role: member.role,
          });
        }

        person.updatedAt = new Date().toISOString();
      }
    } catch (error) {
      console.error(`Error processing project ${projectId}:`, error);
    }
  }

  // Convert map to array
  const allPeople = Array.from(peopleMap.values());

  // Save to people-user.yaml
  const output = {
    people: allPeople,
  };

  fs.writeFileSync(PEOPLE_FILE, yaml.dump(output, { lineWidth: 120 }));

  console.log(`\nExtraction complete!`);
  console.log(`- New people added: ${newPeopleCount}`);
  console.log(`- Existing people updated: ${updatedPeopleCount}`);
  console.log(`- Total people: ${allPeople.length}`);
  console.log(`\nData saved to: ${PEOPLE_FILE}`);
}

// Run the extraction
extractPeopleFromProjects().catch(console.error);
