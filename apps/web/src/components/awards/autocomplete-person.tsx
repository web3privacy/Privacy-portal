"use client";

import { useState, useEffect, useRef } from "react";
import type { Person } from "@/types/people";

type Props = {
  value?: string;
  onChange: (personId: string | null, person: Person | null) => void;
  placeholder?: string;
  onPersonSelect?: (person: Person) => void; // Callback for when person is selected
};

export function AutocompletePerson({ value, onChange, placeholder = "Search people...", onPersonSelect }: Props) {
  const [query, setQuery] = useState("");
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load selected person if value is provided
  useEffect(() => {
    if (value && !selectedPerson) {
      fetch(`/api/people/${value}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.person) {
            setSelectedPerson(data.person);
            setQuery(data.person.name || data.person.displayName || "");
          }
        })
        .catch(() => {});
    }
  }, [value, selectedPerson]);

  // Search people
  useEffect(() => {
    if (!query.trim()) {
      setPeople([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      setLoading(true);
      fetch(`/api/people?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          setPeople(data.people || []);
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

  const handleSelect = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name || person.displayName || "");
    setOpen(false);
    onChange(person.id, person);
    if (onPersonSelect) {
      onPersonSelect(person);
    }
  };

  const handleClear = () => {
    setSelectedPerson(null);
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
        {selectedPerson && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-black/50 hover:text-black dark:text-[#9ea7b5] dark:hover:text-white"
          >
            <span className="material-symbols-rounded text-[18px]">close</span>
          </button>
        )}
      </div>

      {open && (query.trim() || people.length > 0) && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-[8px] border border-[#e0e0e0] bg-white shadow-lg dark:border-[#303640] dark:bg-[#181d25]">
          {loading ? (
            <div className="p-4 text-center text-[14px] text-black/70 dark:text-[#a8b0bd]">
              Loading...
            </div>
          ) : people.length > 0 ? (
            people.map((person) => (
              <button
                key={person.id}
                type="button"
                onClick={() => handleSelect(person)}
                className="w-full px-4 py-2 text-left text-[14px] text-black hover:bg-[#f5f5f5] dark:text-[#f2f4f6] dark:hover:bg-[#1f252d]"
              >
                <div className="font-medium">{person.name || person.displayName}</div>
                {person.title && (
                  <div className="text-[12px] text-black/60 dark:text-[#9ea7b5] line-clamp-1">
                    {person.title}
                  </div>
                )}
              </button>
            ))
          ) : query.trim() ? (
            <div className="p-4 text-center text-[14px] text-black/70 dark:text-[#a8b0bd]">
              No people found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
