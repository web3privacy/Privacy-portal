import { GETProjectsResponse } from "@/app/api/projects/route";
import { ProjectFilters } from "@/types/projectFilters";
import type { Project } from "@/types/project";

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export const createParams = (filters: ProjectFilters): string => {
  const params = new URLSearchParams();

  if (filters.categories) {
    filters.categories.forEach((cat) => params.append("categories", cat));
  }

  if (filters.ecosystems) {
    filters.ecosystems.forEach((eco) => params.append("ecosystems", eco));
  }
  if (filters.usecases) {
    filters.usecases.forEach((usecase) => params.append("usecases", usecase));
  }

  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
  if (filters.page) params.set("page", filters.page.toString());
  if (filters.pageSize) params.set("pageSize", filters.pageSize.toString());
  if (filters.q) params.set("q", filters.q);
  return params.toString();
};

export async function getProjects(
  filters: ProjectFilters = {}
): Promise<GETProjectsResponse> {
  const queryString = createParams(filters);
  const baseUrl = getBaseUrl();

  const res = await fetch(`${baseUrl}/api/projects?${queryString}`, {
    next: { revalidate: 300 }, // Cache for 5 minutes (300 seconds)
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch projects: ${res.statusText}`);
  }

  return res.json();
}

export async function getProject(id: string): Promise<Project> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/projects/${id}`, {
    next: { revalidate: 300 }, // Cache for 5 minutes (300 seconds)
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch project");
  }

  return data.project as Project;
}
