"use client";

import { FilterDropdown } from "@/components/ui/filter-dropdown";
import { projectsSearchParams } from "@/types/projectFilters";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";

interface Ecosystem {
  id: string;
  name: string;
  icon?: string;
}

export default function EcosystemFilter() {
  const [selectedEcosystem, setSelectedEcosystem] = useQueryState(
    "ecosystems",
    projectsSearchParams.ecosystems.withOptions({ shallow: false })
  );
  const [options, setOptions] = useState<Ecosystem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/ecosystems")
      .then((res) => res.json())
      .then((data: { ecosystems: Ecosystem[] }) => {
        if (Array.isArray(data.ecosystems)) {
          setOptions(data.ecosystems);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const value = selectedEcosystem ?? [];
  const handleChange = (next: string[]) => {
    setSelectedEcosystem(next.length > 0 ? next : null);
  };

  return (
    <FilterDropdown
      value={value}
      onChange={handleChange}
      options={options.map((eco) => ({ value: eco.id, label: eco.name }))}
      placeholder={loading ? "Loading..." : "All ecosystems"}
      aria-label="Ecosystem"
      className={loading ? "opacity-60 pointer-events-none" : undefined}
    />
  );
}
