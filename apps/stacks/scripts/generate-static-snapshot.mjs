#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import yaml from "js-yaml";

const projectRoot = process.cwd();
const outputDirArg = process.argv[2];
const outputDir = outputDirArg
  ? path.resolve(outputDirArg)
  : path.resolve(projectRoot, "..", "personalstack-netlify-static");
const port = Number(process.env.SNAPSHOT_PORT || 4123);
const baseUrl = `http://127.0.0.1:${port}`;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer() {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/stacks`, { redirect: "follow" });
      if (response.ok) {
        return;
      }
    } catch {
      // Ignore and retry.
    }
    await wait(500);
  }
  throw new Error("Timed out while waiting for Next.js server");
}

function getRoutes() {
  const rawYaml = fs.readFileSync(path.join(projectRoot, "data.yaml"), "utf8");
  const parsed = yaml.load(rawYaml) ?? {};
  const stacks = Object.values(parsed.stacks ?? {})
    .map((stack) => (stack && typeof stack.id === "string" ? stack.id : ""))
    .filter(Boolean);
  const categories = Object.keys(parsed.tools ?? {});

  const routeSet = new Set(["/", "/stacks", "/categories"]);

  for (const id of stacks) {
    routeSet.add(`/stacks/${encodeURIComponent(id)}`);
    routeSet.add(`/share/stack/${encodeURIComponent(id)}`);
  }

  for (const category of categories) {
    routeSet.add(`/categories/${encodeURIComponent(category)}`);
    routeSet.add(`/share/category/${encodeURIComponent(category)}`);
  }

  return [...routeSet];
}

function routeToFile(route) {
  const normalized = route === "/" ? "/index" : route.replace(/\/+$/, "");
  const dirPath = path.join(outputDir, normalized);
  return path.join(dirPath, "index.html");
}

async function writeRoute(route) {
  const response = await fetch(`${baseUrl}${route}`, {
    headers: { Accept: "text/html" },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${route}: ${response.status}`);
  }

  const html = await response.text();
  const filePath = routeToFile(route);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, html, "utf8");
}

function copyDirIfExists(source, destination) {
  if (!fs.existsSync(source)) {
    return;
  }
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.cpSync(source, destination, { recursive: true });
}

async function main() {
  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.mkdirSync(outputDir, { recursive: true });

  const server = spawn("npx", ["next", "start", "-p", String(port)], {
    cwd: projectRoot,
    stdio: "inherit",
    env: { ...process.env },
  });

  try {
    await waitForServer();
    const routes = getRoutes();

    for (const route of routes) {
      await writeRoute(route);
    }

    copyDirIfExists(path.join(projectRoot, ".next", "static"), path.join(outputDir, "_next", "static"));
    copyDirIfExists(path.join(projectRoot, "public"), outputDir);

    const rootIndexPath = path.join(outputDir, "index.html");
    if (!fs.existsSync(rootIndexPath)) {
      fs.copyFileSync(path.join(outputDir, "index", "index.html"), rootIndexPath);
    }

    fs.writeFileSync(
      path.join(outputDir, "netlify.toml"),
      `[build]\n  command = "echo Static deploy package prepared"\n  publish = "."\n`,
      "utf8"
    );

    fs.writeFileSync(
      path.join(outputDir, "package.json"),
      JSON.stringify(
        {
          name: "personalstack-static-deploy",
          private: true,
          scripts: {
            build: "echo Static package - no build needed",
          },
        },
        null,
        2
      ),
      "utf8"
    );
  } finally {
    server.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
