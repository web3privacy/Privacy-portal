"use client";

import { FilterDropdown } from "@/components/ui/filter-dropdown";
import { projectsSearchParams } from "@/types/projectFilters";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
  icon?: string;
}

export default function CategoryFilter() {
  const [selectedCategory, setSelectedCategory] = useQueryState(
    "categories",
    projectsSearchParams.categories.withOptions({ shallow: false })
  );
  const [options, setOptions] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data: { categories: Category[] }) => {
        if (Array.isArray(data.categories)) {
          setOptions(data.categories);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const value = selectedCategory ?? [];
  const handleChange = (next: string[]) => {
    setSelectedCategory(next.length > 0 ? next : null);
  };

  return (
    <FilterDropdown
      value={value}
      onChange={handleChange}
      options={options.map((cat) => ({ value: cat.id, label: cat.name }))}
      placeholder={loading ? "Loading..." : "All categories"}
      aria-label="Category"
      className={loading ? "opacity-60 pointer-events-none" : undefined}
    />
  );
}
