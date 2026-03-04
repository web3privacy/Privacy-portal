"use client";

import { PillMultiSelect } from "@/components/ui/pill-multi-select";
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

  return (
    <PillMultiSelect
      value={selectedCategory ?? []}
      onChange={(next) => setSelectedCategory(next)}
      options={options.map((cat) => ({
        value: cat.id,
        label: cat.name,
        iconUrl: cat.icon,
      }))}
      placeholder={loading ? "Loading..." : "All categories"}
      loading={loading}
      ariaLabel="Category"
    />
  );
}
