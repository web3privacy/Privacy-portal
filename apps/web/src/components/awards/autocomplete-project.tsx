"use client";

import { useState, useEffect, useRef } from "react";
import type { Project } from "@/types";

type Props = {
  value?: string;
  onChange: (projectId: string | null, project: Project | null) => void;
  placeholder?: string;
};

export function AutocompleteProject({ value, onChange, placeholder = "Search projects..." }: Props) {
  const [query, setQuery] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load selected project if value is provided
  useEffect(() => {
    if (value && !selectedProject) {
      fetch(`/api/projects/${value}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.project) {
            setSelectedProject(data.project);
            setQuery(data.project.name);
          }
        })
        .catch(() => {});
    }
  }, [value, selectedProject]);

  // Search projects
  useEffect(() => {
    if (!query.trim()) {
      setProjects([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      setLoading(true);
      fetch(`/api/projects?q=${encodeURIComponent(query)}&pageSize=10`)
        .then((res) => res.json())
        .then((data) => {
          setProjects(data.projects || []);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (project: Project) => {
    setSelectedProject(project);
    setQuery(project.name);
    setOpen(false);
    onChange(project.id, project);
  };

  const handleClear = () => {
    setSelectedProject(null);
    setQuery("");
    onChange(null, null);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            if (!e.target.value) {
              handleClear();
            }
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full rounded-[8px] border border-[#e0e0e0] bg-white px-4 py-2 pr-10 text-[14px] text-black outline-none dark:border-[#303640] dark:bg-[#181d25] dark:text-[#f2f4f6]"
        />
        {selectedProject && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-black/50 hover:text-black dark:text-[#9ea7b5] dark:hover:text-white"
          >
            <span className="material-symbols-rounded text-[18px]">close</span>
          </button>
        )}
      </div>

      {open && (query.trim() || projects.length > 0) && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-[8px] border border-[#e0e0e0] bg-white shadow-lg dark:border-[#303640] dark:bg-[#181d25]">
          {loading ? (
            <div className="p-4 text-center text-[14px] text-black/70 dark:text-[#a8b0bd]">
              Loading...
            </div>
          ) : projects.length > 0 ? (
            projects.map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={() => handleSelect(project)}
                className="w-full px-4 py-2 text-left text-[14px] text-black hover:bg-[#f5f5f5] dark:text-[#f2f4f6] dark:hover:bg-[#1f252d]"
              >
                <div className="font-medium">{project.name}</div>
                {project.description && (
                  <div className="text-[12px] text-black/60 dark:text-[#9ea7b5] line-clamp-1">
                    {project.description}
                  </div>
                )}
              </button>
            ))
          ) : query.trim() ? (
            <div className="p-4 text-center text-[14px] text-black/70 dark:text-[#a8b0bd]">
              No projects found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
