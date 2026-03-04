"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { AwardYear, Winner, Nominator, Nomination, AwardCategory } from "@/types/awards";
import { AutocompleteProject } from "./autocomplete-project";
import { AutocompletePerson } from "./autocomplete-person";

type Props = {
  existingYears: number[];
  initialData?: AwardYear;
};

export function AddYearForm({ existingYears, initialData }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<AwardYear>>({
    year: initialData?.year || new Date().getFullYear(),
    title: initialData?.title || "",
    description: initialData?.description || "",
    heroBackgroundImage: initialData?.heroBackgroundImage || "/images/bg-awards.png",
    dates: initialData?.dates || {
      nominationsOpen: "",
      nominationsClose: "",
      announcement: "",
    },
    categories: initialData?.categories || [
      {
        id: "favourite-privacy-project",
        name: "Favourite Privacy Project",
        description: "The best privacy-focused projects of the year",
        maxNominations: 3,
      },
      {
        id: "exciting-innovation",
        name: "Exciting Innovation",
        description: "Most exciting innovations supporting privacy",
        maxNominations: 2,
      },
      {
        id: "major-news-event",
        name: "Major News / Event",
        description: "Key events and news regarding privacy",
        maxNominations: 1,
      },
      {
        id: "doxxer-of-year",
        name: "Doxxer of the Year",
        description: "For encouraging to use non-private channels",
        maxNominations: 1,
      },
    ],
    winners: initialData?.winners || [],
    nominations: initialData?.nominations || [],
    rules: initialData?.rules || "",
    howToNominate: initialData?.howToNominate || "",
    articles: initialData?.articles || [],
    bannerAds: initialData?.bannerAds || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/awards", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year: formData.year,
          data: formData,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save");
      }

      router.push("/awards/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-[#121212] dark:bg-[#0f1318] dark:text-[#f2f4f6]">
      <div className="viewport-range-shell mx-auto w-full max-w-[800px] px-4 py-10 md:px-6">
        <Link
          href="/awards/admin"
          className="mb-6 inline-flex items-center gap-2 text-[14px] text-black/70 hover:text-black dark:text-[#a8b0bd] dark:hover:text-white"
        >
          <span className="material-symbols-rounded text-[18px]">arrow_back</span>
          Back to Admin
        </Link>

        <h1 className="mb-6 text-[32px] font-bold text-black dark:text-[#f2f4f6]">
          {initialData ? "Edit Awards Year" : "Add Awards Year"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-[14px] font-bold text-black dark:text-[#f2f4f6]">
              Year *
            </label>
            <input
              type="number"
              required
              value={formData.year || ""}
              onChange={(e) =>
                setFormData({ ...formData, year: parseInt(e.target.value, 10) })
              }
              className="w-full rounded-[8px] border border-[#e0e0e0] bg-white px-4 py-2 text-[14px] text-black outline-none dark:border-[#303640] dark:bg-[#181d25] dark:text-[#f2f4f6]"
            />
            {existingYears.includes(formData.year || 0) && !initialData && (
              <p className="mt-1 text-[12px] text-red-600">
                Year already exists
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-[14px] font-bold text-black dark:text-[#f2f4f6]">
              Title
            </label>
            <input
              type="text"
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Privacy Awards 2024"
              className="w-full rounded-[8px] border border-[#e0e0e0] bg-white px-4 py-2 text-[14px] text-black outline-none dark:border-[#303640] dark:bg-[#181d25] dark:text-[#f2f4f6]"
            />
          </div>

          <div>
            <label className="mb-2 block text-[14px] font-bold text-black dark:text-[#f2f4f6]">
              Description
            </label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full rounded-[8px] border border-[#e0e0e0] bg-white px-4 py-2 text-[14px] text-black outline-none dark:border-[#303640] dark:bg-[#181d25] dark:text-[#f2f4f6]"
            />
          </div>

          <div>
            <label className="mb-2 block text-[14px] font-bold text-black dark:text-[#f2f4f6]">
              Hero Background Image
            </label>
            <input
              type="text"
              value={formData.heroBackgroundImage || ""}
              onChange={(e) =>
                setFormData({ ...formData, heroBackgroundImage: e.target.value })
              }
              placeholder="/images/bg-awards.png"
              className="w-full rounded-[8px] border border-[#e0e0e0] bg-white px-4 py-2 text-[14px] text-black outline-none dark:border-[#303640] dark:bg-[#181d25] dark:text-[#f2f4f6]"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-[14px] font-bold text-black dark:text-[#f2f4f6]">
                Nominations Open *
              </label>
              <input
                type="date"
                required
                value={formData.dates?.nominationsOpen || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dates: { ...formData.dates!, nominationsOpen: e.target.value },
                  })
                }
                className="w-full rounded-[8px] border border-[#e0e0e0] bg-white px-4 py-2 text-[14px] text-black outline-none dark:border-[#303640] dark:bg-[#181d25] dark:text-[#f2f4f6]"
              />
            </div>
            <div>
              <label className="mb-2 block text-[14px] font-bold text-black dark:text-[#f2f4f6]">
                Nominations Close *
              </label>
              <input
                type="date"
                required
                value={formData.dates?.nominationsClose || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dates: { ...formData.dates!, nominationsClose: e.target.value },
                  })
                }
                className="w-full rounded-[8px] border border-[#e0e0e0] bg-white px-4 py-2 text-[14px] text-black outline-none dark:border-[#303640] dark:bg-[#181d25] dark:text-[#f2f4f6]"
              />
            </div>
            <div>
              <label className="mb-2 block text-[14px] font-bold text-black dark:text-[#f2f4f6]">
                Announcement *
              </label>
              <input
                type="date"
                required
                value={formData.dates?.announcement || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dates: { ...formData.dates!, announcement: e.target.value },
                  })
                }
                className="w-full rounded-[8px] border border-[#e0e0e0] bg-white px-4 py-2 text-[14px] text-black outline-none dark:border-[#303640] dark:bg-[#181d25] dark:text-[#f2f4f6]"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[14px] font-bold text-black dark:text-[#f2f4f6]">
              Rules (Markdown)
            </label>
            <textarea
              value={formData.rules || ""}
              onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
              rows={10}
              className="w-full rounded-[8px] border border-[#e0e0e0] bg-white px-4 py-2 font-mono text-[13px] text-black outline-none dark:border-[#303640] dark:bg-[#181d25] dark:text-[#f2f4f6]"
            />
          </div>

          <div>
            <label className="mb-2 block text-[14px] font-bold text-black dark:text-[#f2f4f6]">
              How to Nominate (Markdown)
            </label>
            <textarea
              value={formData.howToNominate || ""}
              onChange={(e) => setFormData({ ...formData, howToNominate: e.target.value })}
              rows={8}
              className="w-full rounded-[8px] border border-[#e0e0e0] bg-white px-4 py-2 font-mono text-[13px] text-black outline-none dark:border-[#303640] dark:bg-[#181d25] dark:text-[#f2f4f6]"
            />
          </div>

          {/* Winners Section */}
          <div className="rounded-[12px] border border-[#e0e0e0] bg-white p-6 dark:border-[#303640] dark:bg-[#181d25]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[20px] font-bold text-black dark:text-[#f2f4f6]">
                Winners ({formData.winners?.length || 0})
              </h2>
              <button
                type="button"
                onClick={() => {
                  const newWinner: Winner = {
                    category: "favourite-privacy-project",
                    winner: "",
                  };
                  setFormData({
                    ...formData,
                    winners: [...(formData.winners || []), newWinner],
                  });
                }}
                className="rounded-[8px] bg-[#70ff88] px-4 py-2 text-[13px] font-bold uppercase tracking-[0.08em] text-black transition-all hover:bg-[#5eef70]"
              >
                + Add Winner
              </button>
            </div>
            <div className="space-y-4">
              {formData.winners?.map((winner, index) => (
                <div
                  key={index}
                  className="rounded-[8px] border border-[#e0e0e0] bg-[#f5f5f5] p-4 dark:border-[#303640] dark:bg-[#1a1f27]"
                >
                  <div className="mb-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[12px] font-bold text-black dark:text-[#f2f4f6]">
                        Category *
                      </label>
                      <select
                        value={winner.category}
                        onChange={(e) => {
                          const newWinners = [...(formData.winners || [])];
                          newWinners[index] = { ...winner, category: e.target.value as AwardCategory };
                          setFormData({ ...formData, winners: newWinners });
                        }}
                        className="w-full rounded-[8px] border border-[#e0e0e0] bg-white px-3 py-2 text-[13px] text-black outline-none dark:border-[#303640] dark:bg-[#181d25] dark:text-[#f2f4f6]"
                      >
                        {formData.categories?.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-[12px] font-bold text-black dark:text-[#f2f4f6]">
                        Winner Name *
                      </label>
                      <input
                        type="text"
                        value={winner.winner}
                        onChange={(e) => {
                          const newWinners = [...(formData.winners || [])];
                          newWinners[index] = { ...winner, winner: e.target.value };
                          setFormData({ ...formData, winners: newWinners });
                        }}
                        className="w-full rounded-[8px] border border-[#e0e0e0] bg-white px-3 py-2 text-[13px] text-black outline-none dark:border-[#303640] dark:bg-[#181d25] dark:text-[#f2f4f6]"
                      />
                    </div>
                  </div>
                  <div className="mb-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[12px] font-bold text-black dark:text-[#f2f4f6]">
                        Link to Project
                      </label>
                      <AutocompleteProject
                        value={winner.projectId}
                        onChange={(projectId, project) => {
                          const newWinners = [...(formData.winners || [])];
                          newWinners[index] = {
                            ...winner,
                            projectId: projectId || undefined,
                            url: project?.links?.web || winner.url,
                          };
                          setFormData({ ...formData, winners: newWinners });
                        }}
                        placeholder="Search projects..."
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[12px] font-bold text-black dark:text-[#f2f4f6]">
                        Link to Person
                      </label>
                      <AutocompletePerson
                        value={winner.personId}
                        onChange={(personId, person) => {
                          const newWinners = [...(formData.winners || [])];
                          newWinners[index] = {
                            ...winner,
                            personId: personId || undefined,
                            // Auto-fill winner name from person if available
                            winner: person?.name || person?.displayName || winner.winner,
                            description: person?.title || winner.description,
                            icon: person?.avatar || winner.icon,
                            url: person?.links?.find(l => l.type === "web")?.url || winner.url,
                          };
                          setFormData({ ...formData, winners: newWinners });
                        }}
                        placeholder="Search people..."
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="mb-1 block text-[12px] font-bold text-black dark:text-[#f2f4f6]">
                      Description
                    </label>
                    <textarea
                      value={winner.description || ""}
                      onChange={(e) => {
                        const newWinners = [...(formData.winners || [])];
                        newWinners[index] = { ...winner, description: e.target.value };
                        setFormData({ ...formData, winners: newWinners });
                      }}
                      rows={2}
                      className="w-full rounded-[8px] border border-[#e0e0e0] bg-white px-3 py-2 text-[13px] text-black outline-none dark:border-[#303640] dark:bg-[#181d25] dark:text-[#f2f4f6]"
                    />
                  </div>
                  <div className="mb-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[12px] font-bold text-black dark:text-[#f2f4f6]">
                        Icon URL
                      </label>
                      <input
                        type="text"
                        value={winner.icon || ""}
                        onChange={(e) => {
                          const newWinners = [...(formData.winners || [])];
                          newWinners[index] = { ...winner, icon: e.target.value };
                          setFormData({ ...formData, winners: newWinners });
                        }}
                        placeholder="/images/awards/icon.png"
                        className="w-full rounded-[8px] border border-[#e0e0e0] bg-white px-3 py-2 text-[13px] text-black outline-none dark:border-[#303640] dark:bg-[#181d25] dark:text-[#f2f4f6]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[12px] font-bold text-black dark:text-[#f2f4f6]">
                        URL
                      </label>
                      <input
                        type="text"
                        value={winner.url || ""}
                        onChange={(e) => {
                          const newWinners = [...(formData.winners || [])];
                          newWinners[index] = { ...winner, url: e.target.value };
                          setFormData({ ...formData, winners: newWinners });
                        }}
                        placeholder="https://..."
                        className="w-full rounded-[8px] border border-[#e0e0e0] bg-white px-3 py-2 text-[13px] text-black outline-none dark:border-[#303640] dark:bg-[#181d25] dark:text-[#f2f4f6]"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newWinners = formData.winners?.filter((_, i) => i !== index);
                      setFormData({ ...formData, winners: newWinners });
                    }}
                    className="text-[13px] text-red-600 underline"
                  >
                    Remove Winner
                  </button>
                </div>
              ))}
              {(!formData.winners || formData.winners.length === 0) && (
                <div className="py-8 text-center text-[14px] text-black/70 dark:text-[#a8b0bd]">
                  No winners yet. Click "+ Add Winner" to add one.
                </div>
              )}
            </div>
          </div>

          {/* Nominators Section */}
          <div className="rounded-[12px] border border-[#e0e0e0] bg-white p-6 dark:border-[#303640] dark:bg-[#181d25]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[20px] font-bold text-black dark:text-[#f2f4f6]">
                Nominators ({formData.nominations?.length || 0})
              </h2>
              <button
                type="button"
                onClick={() => {
                  const newNominator: Nominator = {
                    id: `nom-${Date.now()}`,
                    name: "",
                    nominations: [],
                  };
                  setFormData({
                    ...formData,
                    nominations: [...(formData.nominations || []), newNominator],
                  });
                }}
                className="rounded-[8px] bg-[#70ff88] px-4 py-2 text-[13px] font-bold uppercase tracking-[0.08em] text-black transition-all hover:bg-[#5eef70]"
              >
                + Add Nominator
              </button>
            </div>
            <div className="space-y-6">
              {formData.nominations?.map((nominator, nominatorIndex) => (
                <div
                  key={nominator.id}
                  className="rounded-[8px] border border-[#e0e0e0] bg-[#f5f5f5] p-4 dark:border-[#303640] dark:bg-[#1a1f27]"
                >
                  <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[12px] font-bold text-black dark:text-[#f2f4f6]">
                        Nominator Name *
                      </label>
                      <input
                        type="text"
                        value={nominator.name}
                        onChange={(e) => {
                          const newNominations = [...(formData.nominations || [])];
                          newNominations[nominatorIndex] = {
                            ...nominator,
                            name: e.target.value,
                          };
                          setFormData({ ...formData, nominations: newNominations });
                        }}
                        className="w-full rounded-[8px] border border-[#e0e0e0] bg-white px-3 py-2 text-[13px] text-black outline-none dark:border-[#303640] dark:bg-[#181d25] dark:text-[#f2f4f6]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[12px] font-bold text-black dark:text-[#f2f4f6]">
                        Link to Person
                      </label>
                      <AutocompletePerson
                        value={nominator.personId}
                        onChange={(personId, person) => {
                          const newNominations = [...(formData.nominations || [])];
                          newNominations[nominatorIndex] = {
                            ...nominator,
                            personId: personId || undefined,
                            // Auto-fill from person data if available
                            name: person?.name || nominator.name,
                            title: person?.title || nominator.title,
                            avatar: person?.avatar || nominator.avatar,
                            org: person?.organizations?.[0] || nominator.org,
                          };
                          setFormData({ ...formData, nominations: newNominations });
                        }}
                        placeholder="Search people..."
                      />
                    </div>
                  </div>
                  <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[12px] font-bold text-black dark:text-[#f2f4f6]">
                        Title
                      </label>
                      <input
                        type="text"
                        value={nominator.title || ""}
                        onChange={(e) => {
                          const newNominations = [...(formData.nominations || [])];
                          newNominations[nominatorIndex] = {
                            ...nominator,
                            title: e.target.value,
                          };
                          setFormData({ ...formData, nominations: newNominations });
                        }}
                        placeholder="Founder of Ethereum, Developer, Thinker"
                        className="w-full rounded-[8px] border border-[#e0e0e0] bg-white px-3 py-2 text-[13px] text-black outline-none dark:border-[#303640] dark:bg-[#181d25] dark:text-[#f2f4f6]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[12px] font-bold text-black dark:text-[#f2f4f6]">
                        Avatar URL
                      </label>
                      <input
                        type="text"
                        value={nominator.avatar || ""}
                        onChange={(e) => {
                          const newNominations = [...(formData.nominations || [])];
                          newNominations[nominatorIndex] = {
                            ...nominator,
                            avatar: e.target.value,
                          };
                          setFormData({ ...formData, nominations: newNominations });
                        }}
                        placeholder="/images/nominators/avatar.png"
                        className="w-full rounded-[8px] border border-[#e0e0e0] bg-white px-3 py-2 text-[13px] text-black outline-none dark:border-[#303640] dark:bg-[#181d25] dark:text-[#f2f4f6]"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="mb-1 block text-[12px] font-bold text-black dark:text-[#f2f4f6]">
                      Organization
                    </label>
                    <input
                      type="text"
                      value={nominator.org || ""}
                      onChange={(e) => {
                        const newNominations = [...(formData.nominations || [])];
                        newNominations[nominatorIndex] = {
                          ...nominator,
                          org: e.target.value,
                        };
                        setFormData({ ...formData, nominations: newNominations });
                      }}
                      className="w-full rounded-[8px] border border-[#e0e0e0] bg-white px-3 py-2 text-[13px] text-black outline-none dark:border-[#303640] dark:bg-[#181d25] dark:text-[#f2f4f6]"
                    />
                  </div>

                  {/* Nominations */}
                  <div className="mb-4">
                    <div className="mb-2 flex items-center justify-between">
                      <label className="block text-[12px] font-bold text-black dark:text-[#f2f4f6]">
                        Nominations ({nominator.nominations.length})
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const newNominations = [...(formData.nominations || [])];
                          const newNomination: Nomination = {
                            id: `nom-${nominator.id}-${Date.now()}`,
                            category: "favourite-privacy-project",
                            nominee: "",
                          };
                          newNominations[nominatorIndex] = {
                            ...nominator,
                            nominations: [...nominator.nominations, newNomination],
                          };
                          setFormData({ ...formData, nominations: newNominations });
                        }}
                        className="rounded-[6px] bg-[#70ff88] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-black transition-all hover:bg-[#5eef70]"
                      >
                        + Add Nomination
                      </button>
                    </div>
                    <div className="space-y-3">
                      {nominator.nominations.map((nomination, nomIndex) => (
                        <div
                          key={nomination.id}
                          className="rounded-[6px] border border-[#d0d0d0] bg-white p-3 dark:border-[#404850] dark:bg-[#0f1318]"
                        >
                          <div className="mb-2 grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div>
                              <label className="mb-1 block text-[11px] font-bold text-black dark:text-[#f2f4f6]">
                                Category *
                              </label>
                              <select
                                value={nomination.category}
                                onChange={(e) => {
                                  const newNominations = [...(formData.nominations || [])];
                                  newNominations[nominatorIndex].nominations[nomIndex] = {
                                    ...nomination,
                                    category: e.target.value as AwardCategory,
                                  };
                                  setFormData({ ...formData, nominations: newNominations });
                                }}
                                className="w-full rounded-[6px] border border-[#e0e0e0] bg-white px-2 py-1 text-[12px] text-black outline-none dark:border-[#303640] dark:bg-[#181d25] dark:text-[#f2f4f6]"
                              >
                                {formData.categories?.map((cat) => (
                                  <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="mb-1 block text-[11px] font-bold text-black dark:text-[#f2f4f6]">
                                Nominee Name *
                              </label>
                              <input
                                type="text"
                                value={nomination.nominee}
                                onChange={(e) => {
                                  const newNominations = [...(formData.nominations || [])];
                                  newNominations[nominatorIndex].nominations[nomIndex] = {
                                    ...nomination,
                                    nominee: e.target.value,
                                  };
                                  setFormData({ ...formData, nominations: newNominations });
                                }}
                                className="w-full rounded-[6px] border border-[#e0e0e0] bg-white px-2 py-1 text-[12px] text-black outline-none dark:border-[#303640] dark:bg-[#181d25] dark:text-[#f2f4f6]"
                              />
                            </div>
                          </div>
                          <div className="mb-2 grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div>
                              <label className="mb-1 block text-[11px] font-bold text-black dark:text-[#f2f4f6]">
                                Link to Project
                              </label>
                              <AutocompleteProject
                                value={nomination.projectId}
                                onChange={(projectId, project) => {
                                  const newNominations = [...(formData.nominations || [])];
                                  newNominations[nominatorIndex].nominations[nomIndex] = {
                                    ...nomination,
                                    projectId: projectId || undefined,
                                    url: project?.links?.web || nomination.url,
                                  };
                                  setFormData({ ...formData, nominations: newNominations });
                                }}
                                placeholder="Search projects..."
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-[11px] font-bold text-black dark:text-[#f2f4f6]">
                                Link to Person
                              </label>
                              <AutocompletePerson
                                value={nomination.personId}
                                onChange={(personId, person) => {
                                  const newNominations = [...(formData.nominations || [])];
                                  newNominations[nominatorIndex].nominations[nomIndex] = {
                                    ...nomination,
                                    personId: personId || undefined,
                                    // Auto-fill nominee name from person if available
                                    nominee: person?.name || person?.displayName || nomination.nominee,
                                    description: person?.title || nomination.description,
                                    icon: person?.avatar || nomination.icon,
                                    url: person?.links?.find(l => l.type === "web")?.url || nomination.url,
                                  };
                                  setFormData({ ...formData, nominations: newNominations });
                                }}
                                placeholder="Search people..."
                              />
                            </div>
                          </div>
                          <div className="mb-2">
                            <label className="mb-1 block text-[11px] font-bold text-black dark:text-[#f2f4f6]">
                              Description
                            </label>
                            <input
                              type="text"
                              value={nomination.description || ""}
                              onChange={(e) => {
                                const newNominations = [...(formData.nominations || [])];
                                newNominations[nominatorIndex].nominations[nomIndex] = {
                                  ...nomination,
                                  description: e.target.value,
                                };
                                setFormData({ ...formData, nominations: newNominations });
                              }}
                              className="w-full rounded-[6px] border border-[#e0e0e0] bg-white px-2 py-1 text-[12px] text-black outline-none dark:border-[#303640] dark:bg-[#181d25] dark:text-[#f2f4f6]"
                            />
                          </div>
                          <div className="mb-2 grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div>
                              <label className="mb-1 block text-[11px] font-bold text-black dark:text-[#f2f4f6]">
                                Icon URL
                              </label>
                              <input
                                type="text"
                                value={nomination.icon || ""}
                                onChange={(e) => {
                                  const newNominations = [...(formData.nominations || [])];
                                  newNominations[nominatorIndex].nominations[nomIndex] = {
                                    ...nomination,
                                    icon: e.target.value,
                                  };
                                  setFormData({ ...formData, nominations: newNominations });
                                }}
                                placeholder="/images/nominations/icon.png"
                                className="w-full rounded-[6px] border border-[#e0e0e0] bg-white px-2 py-1 text-[12px] text-black outline-none dark:border-[#303640] dark:bg-[#181d25] dark:text-[#f2f4f6]"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-[11px] font-bold text-black dark:text-[#f2f4f6]">
                                URL
                              </label>
                              <input
                                type="text"
                                value={nomination.url || ""}
                                onChange={(e) => {
                                  const newNominations = [...(formData.nominations || [])];
                                  newNominations[nominatorIndex].nominations[nomIndex] = {
                                    ...nomination,
                                    url: e.target.value,
                                  };
                                  setFormData({ ...formData, nominations: newNominations });
                                }}
                                placeholder="https://..."
                                className="w-full rounded-[6px] border border-[#e0e0e0] bg-white px-2 py-1 text-[12px] text-black outline-none dark:border-[#303640] dark:bg-[#181d25] dark:text-[#f2f4f6]"
                              />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newNominations = [...(formData.nominations || [])];
                              newNominations[nominatorIndex].nominations = newNominations[
                                nominatorIndex
                              ].nominations.filter((_, i) => i !== nomIndex);
                              setFormData({ ...formData, nominations: newNominations });
                            }}
                            className="text-[11px] text-red-600 underline"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      {nominator.nominations.length === 0 && (
                        <div className="py-4 text-center text-[12px] text-black/70 dark:text-[#a8b0bd]">
                          No nominations yet. Click "+ Add Nomination" to add one.
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const newNominations = formData.nominations?.filter(
                        (_, i) => i !== nominatorIndex
                      );
                      setFormData({ ...formData, nominations: newNominations });
                    }}
                    className="text-[13px] text-red-600 underline"
                  >
                    Remove Nominator
                  </button>
                </div>
              ))}
              {(!formData.nominations || formData.nominations.length === 0) && (
                <div className="py-8 text-center text-[14px] text-black/70 dark:text-[#a8b0bd]">
                  No nominators yet. Click "+ Add Nominator" to add one.
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="rounded-[8px] border border-red-600 bg-red-50 p-4 text-[14px] text-red-600 dark:bg-red-900/20">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="rounded-[8px] bg-[#70ff88] px-6 py-2 text-[14px] font-bold uppercase tracking-[0.08em] text-black transition-all hover:bg-[#5eef70] disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <Link
              href="/awards/admin"
              className="rounded-[8px] border border-[#e0e0e0] bg-white px-6 py-2 text-[14px] font-bold text-black transition-all hover:bg-[#f5f5f5] dark:border-[#303640] dark:bg-[#181d25] dark:text-[#f2f4f6] dark:hover:bg-[#1f252d]"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
