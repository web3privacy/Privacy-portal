import { Project } from "@/types";
import { ProjectFilters } from "@/types/projectFilters";
import _ from "lodash";

function norm(s: string): string {
  return s.trim().toLowerCase();
}

export function processProjects(
  projects: Project[],
  filters: ProjectFilters
): {
  total: number;
  paginated: Project[];
} {
  const {
    categories,
    ecosystems,
    usecases,
    sortBy,
    sortOrder = "asc",
    page = 1,
    pageSize = 20,
    q,
  } = filters;

  let result = projects;

  const categoriesSet = new Set((categories ?? []).map(norm));
  const ecosystemsSet = new Set((ecosystems ?? []).map(norm));
  const usecasesSet = new Set((usecases ?? []).map(norm));

  // 🔍 TEXT SEARCH FILTER
  if (q && q.trim() !== "") {
    const lowerQ = q.toLowerCase();
    result = result.filter((project) => {
      return (
        project.name.toLowerCase().includes(lowerQ) ||
        project.description?.toLowerCase().includes(lowerQ) ||
        project.categories?.some((cat) => cat.toLowerCase().includes(lowerQ)) ||
        project.ecosystem?.some((eco) => eco.toLowerCase().includes(lowerQ)) ||
        project.usecases?.some((uc) => uc.toLowerCase().includes(lowerQ))
      );
    });
  }

  // FILTERING
  result = _.filter(result, (project) => {
    const categoryMatch = categoriesSet.size
      ? (project.categories ?? []).some((cat) => categoriesSet.has(norm(cat)))
      : true;

    const ecosystemMatch = ecosystemsSet.size
      ? (project.ecosystem ?? []).some((eco) => ecosystemsSet.has(norm(eco)))
      : true;

    const usecaseMatch = usecasesSet.size
      ? (project.usecases ?? []).some((uc) => usecasesSet.has(norm(uc)))
      : true;

    return categoryMatch && ecosystemMatch && usecaseMatch;
  });

  // SORTING
  if (sortBy) {
    result = _.orderBy(result, [sortBy], [sortOrder]);
  }

  const total = result.length;
  // PAGINATION
  const paginated = _(result)
    .slice((page - 1) * pageSize, page * pageSize)
    .value();

  return {
    total,
    paginated,
  };
}
