"use client";

import { PillMultiSelect } from "@/components/ui/pill-multi-select";
import { projectsSearchParams } from "@/types/projectFilters";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";

interface Usecase {
  id: string;
  name: string;
}

export default function UsecaseFilter() {
  const [selectedUsecase, setSelectedUsecase] = useQueryState(
    "usecases",
    projectsSearchParams.usecases.withOptions({ shallow: false })
  );
  const [options, setOptions] = useState<Usecase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/usecases")
      .then((res) => res.json())
      .then((data: { usecases: Usecase[] }) => {
        if (Array.isArray(data.usecases)) {
          setOptions(data.usecases);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <PillMultiSelect
      value={selectedUsecase ?? []}
      onChange={(next) => setSelectedUsecase(next)}
      options={options.map((uc) => ({
        value: uc.id,
        label: uc.name,
      }))}
      placeholder={loading ? "Loading..." : "Select use-case"}
      loading={loading}
      ariaLabel="Use case"
    />
  );
}
