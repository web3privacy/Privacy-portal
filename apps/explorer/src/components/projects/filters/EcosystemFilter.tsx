"use client";

import { PillMultiSelect } from "@/components/ui/pill-multi-select";
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

  return (
    <PillMultiSelect
      value={selectedEcosystem ?? []}
      onChange={(next) => setSelectedEcosystem(next)}
      options={options.map((eco) => ({
        value: eco.id,
        label: eco.name,
        iconUrl: eco.icon,
      }))}
      placeholder={loading ? "Loading..." : "All ecosystems"}
      loading={loading}
      ariaLabel="Ecosystem"
    />
  );
}
