"use client";

import { ProjectsHero } from "./projects/ProjectsHero";
import { ProjectsByCategory } from "./projects/ProjectsByCategory";
import { ProjectsTechnologiesSection } from "./projects/ProjectsTechnologiesSection";

export function OrgProjectsContent() {
  return (
    <main style={{ width: "100%", minHeight: "100vh" }} className="projects-page landing-root">
      <div className="content-shell content-shell--with-padding" style={{ paddingBottom: 0 }}>
        <ProjectsHero />
        <div style={{ paddingTop: 24, paddingBottom: 40 }}>
          <ProjectsByCategory />
        </div>
      </div>
      <ProjectsTechnologiesSection />
    </main>
  );
}
