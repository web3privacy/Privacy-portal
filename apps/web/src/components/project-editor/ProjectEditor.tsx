"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import yaml from "js-yaml";

import MultipleSelector, { type Option } from "@/components/ui/multiselect";
import { cn } from "@/lib/utils";

type EditorResult =
  | {
      ok: true;
      kind: "github";
      prUrl: string;
      prNumber: number;
      branch: string;
      path: string;
    }
  | { ok: true; kind: "local"; path: string }
  | { ok: false; error: string; details?: unknown };

export type ProjectEditorProps = {
  initialMode?: "create" | "update";
  initialProjectId?: string;
};

const ProjectIdSchema = z
  .string()
  .min(2)
  .max(64)
  .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, "Use a slug: a-z, 0-9, dashes.");

function normalizeProjectId(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

function errorFromResponse(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  return typeof record.error === "string" ? record.error : null;
}

type Category = { id: string; name: string; icon?: string };
type Ecosystem = { id: string; name: string; icon?: string };
type Usecase = { id: string; name: string };
type Asset = { id: string; name: string };
type Feature = { id: string; name: string };
type Phase = { id: string; name: string };
type Custody = { id: string; name: string };
type Requirement = { id: string; name: string };

type ProjectDoc = Record<string, unknown>;

function createEmptyDoc(id: string): ProjectDoc {
  return {
    id,
    name: "",
    categories: [],
    usecases: [],
    ecosystem: [],
    description: "",
    product_launch_day: "",
    sunset: false,
    assets_used: [],
    have_token: false,
    tokens: [],
    screenshots: [],
    third_party_dependency: "",
    social_trust: "",
    technical_spof: "",
    links: {
      web: "",
      github: "",
      docs: "",
      whitepaper: "",
      blog: "",
      twitter: "",
      discord: "",
      telegram: "",
      forum: "",
      governance: "",
    },
    project_phase: "",
    project_status: {
      live_status: false,
      mainnet: false,
      testnet: false,
      version: "",
    },
    blockchain_features: {
      opensource: false,
      p2p: false,
      upgradability: { enabled: false },
      asset_custody_type: "",
      encryption: "",
    },
    storage: { decentralized: false },
    privacy_policy: { defined: false, link: "", data_usage: "" },
    tracebility: { kyc: false, tracked_data: "", sign_in_type_requirments: [] },
    compliance: "",
    default_privacy: false,
    team: { anonymous: true, company: { link: "" }, teammembers: [] },
    funding: [],
    audits: [],
    history: [],
    logos: [],
  };
}

function safeObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function getStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((x): x is string => typeof x === "string").map((x) => x.trim()).filter(Boolean);
}

function setAtPath(obj: ProjectDoc, path: string[], value: unknown): ProjectDoc {
  const root = { ...obj };
  let cursor: Record<string, unknown> = root;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    const next = safeObject(cursor[key]);
    cursor[key] = { ...next };
    cursor = cursor[key] as Record<string, unknown>;
  }
  cursor[path[path.length - 1]] = value;
  return root;
}

function getAtPath(obj: ProjectDoc, path: string[]): unknown {
  let cursor: unknown = obj;
  for (const key of path) {
    const record = safeObject(cursor);
    cursor = record[key];
  }
  return cursor;
}

function toYaml(doc: ProjectDoc): string {
  return yaml.dump(doc, {
    lineWidth: 120,
    noRefs: true,
    sortKeys: false,
    quotingType: '"',
  } as never);
}

type StepId =
  | "basic"
  | "openness"
  | "tech"
  | "privacy"
  | "security"
  | "socials"
  | "assets"
  | "review";

const STEPS: Array<{ id: StepId; label: string; hint: string }> = [
  { id: "basic", label: "Basic Info", hint: "Name, description, categories" },
  { id: "openness", label: "Openness", hint: "Team, funding, timeline" },
  { id: "tech", label: "Technical", hint: "Open source, custody, storage" },
  { id: "privacy", label: "Privacy", hint: "KYC, policy, compliance" },
  { id: "security", label: "Security", hint: "Audits, dependencies" },
  { id: "socials", label: "Socials", hint: "Links, community channels" },
  { id: "assets", label: "Assets", hint: "Tokens, logos, screenshots" },
  { id: "review", label: "Review", hint: "YAML + Publish" },
];

function FieldLabel({ children }: { children: string }) {
  return (
    <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/55 dark:text-white/55">
      {children}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      type={type}
      className="mt-2 w-full rounded-[12px] border border-black/15 bg-white px-3 py-2 text-[13px] text-black shadow-sm outline-none focus:border-black/35 dark:border-white/15 dark:bg-[#0f1318] dark:text-[#f2f4f6] dark:focus:border-white/35"
    />
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-3">
      <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/55 dark:text-white/55">
        {label}
      </span>
      <span
        className={cn(
          "relative inline-flex h-7 w-12 items-center rounded-full border transition-colors",
          checked
            ? "border-black/20 bg-accent dark:border-white/20"
            : "border-black/15 bg-black/5 dark:border-white/15 dark:bg-white/10"
        )}
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onChange(!checked);
          }
        }}
      >
        <span
          className={cn(
            "inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </span>
    </label>
  );
}

function Panel({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-[18px] border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#151a21]", className)}>
      <div className="font-serif text-[18px] text-black dark:text-[#f2f4f6]">{title}</div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function buildOptionsFromCategories(list: Category[]): Option[] {
  return list.map((c) => ({
    value: c.id,
    label: c.name,
    icon: c.icon,
  }));
}

function buildOptionsFromEcosystems(list: Ecosystem[]): Option[] {
  return list.map((e) => ({ value: e.id, label: e.name, icon: e.icon }));
}

function buildOptionsFromUsecases(list: Usecase[]): Option[] {
  return list.map((u) => ({ value: u.id, label: u.name }));
}

function buildOptionsFromAssets(list: Asset[]): Option[] {
  return list.map((a) => ({ value: a.id, label: a.name }));
}

function buildOptionsFromFeatures(list: Feature[]): Option[] {
  return list.map((f) => ({ value: f.id, label: f.name }));
}

function buildOptionsFromRequirements(list: Requirement[]): Option[] {
  return list.map((r) => ({ value: r.id, label: r.name }));
}

function selectedOptions(all: Option[], values: string[]): Option[] {
  const map = new Map(all.map((o) => [o.value, o]));
  return values.map((v) => map.get(v) ?? { value: v, label: v }).filter(Boolean);
}

function MultiSelectField({
  label,
  placeholder,
  options,
  values,
  onChange,
  loading,
  creatable,
}: {
  label: string;
  placeholder: string;
  options: Option[];
  values: string[];
  onChange: (v: string[]) => void;
  loading?: boolean;
  creatable?: boolean;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="mt-2">
        <MultipleSelector
          value={selectedOptions(options, values)}
          options={options}
          placeholder={loading ? "Loading..." : placeholder}
          onChange={(opts) => onChange(opts.map((o) => o.value))}
          creatable={!!creatable}
          className={cn(
            "rounded-[14px]",
            loading
              ? "border-black/10 bg-black/5 text-black/55 dark:border-white/10 dark:bg-white/10 dark:text-white/65"
              : "border-black/15 bg-white/70 dark:border-white/15 dark:bg-[#0f1318]"
          )}
          badgeClassName="rounded-full bg-black/5 text-black/70 dark:bg-white/10 dark:text-white/70"
          loadingIndicator={
            <div className="px-2 py-2 text-[12px] text-black/45 dark:text-white/45">Loading…</div>
          }
          emptyIndicator={
            <div className="px-2 py-2 text-[12px] text-black/45 dark:text-white/45">No options</div>
          }
        />
      </div>
    </div>
  );
}

function validateDoc(doc: ProjectDoc): string | null {
  const id = safeObject(doc).id;
  const name = safeObject(doc).name;
  if (typeof id !== "string" || !id.trim()) return "Missing project id.";
  if (!ProjectIdSchema.safeParse(normalizeProjectId(id)).success) return "Invalid project id.";
  if (typeof name !== "string" || name.trim().length < 2) return "Name is required.";
  const categories = getStringArray(safeObject(doc).categories);
  if (categories.length === 0) return "Pick at least one category.";
  return null;
}

function SuggestInput({
  value,
  onChange,
  placeholder,
  listId,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  listId?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      list={listId}
      className="mt-2 w-full rounded-[12px] border border-black/15 bg-white px-3 py-2 text-[13px] text-black shadow-sm outline-none focus:border-black/35 dark:border-white/15 dark:bg-[#0f1318] dark:text-[#f2f4f6] dark:focus:border-white/35"
    />
  );
}

export function ProjectEditor({
  initialMode = "create",
  initialProjectId = "",
}: ProjectEditorProps) {
  const [mode, setMode] = useState<"create" | "update">(initialMode);
  const [target, setTarget] = useState<"local" | "github">("local");
  const [token, setToken] = useState("");
  const [projectId, setProjectId] = useState(initialProjectId);
  const normalizedId = useMemo(() => normalizeProjectId(projectId), [projectId]);

  const [sourcePath, setSourcePath] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<EditorResult | null>(null);

  const [step, setStep] = useState<StepId>("basic");
  const [doc, setDoc] = useState<ProjectDoc>(() => createEmptyDoc(normalizeProjectId(initialProjectId || "your-project-id")));

  const [categories, setCategories] = useState<Category[]>([]);
  const [ecosystems, setEcosystems] = useState<Ecosystem[]>([]);
  const [usecases, setUsecases] = useState<Usecase[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [custodys, setCustodys] = useState<Custody[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [optLoading, setOptLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<{
    roles: string[];
    fundingTypes: string[];
    historyEventTypes: string[];
    auditCompanies: string[];
    auditNames: string[];
  }>({
    roles: [],
    fundingTypes: [],
    historyEventTypes: [],
    auditCompanies: [],
    auditNames: [],
  });

  const didAutoLoad = useRef(false);

  const categoryOptions = useMemo(() => buildOptionsFromCategories(categories), [categories]);
  const ecosystemOptions = useMemo(() => buildOptionsFromEcosystems(ecosystems), [ecosystems]);
  const usecaseOptions = useMemo(() => buildOptionsFromUsecases(usecases), [usecases]);
  const assetOptions = useMemo(() => buildOptionsFromAssets(assets), [assets]);
  const featureOptions = useMemo(() => buildOptionsFromFeatures(features), [features]);
  const requirementOptions = useMemo(() => buildOptionsFromRequirements(requirements), [requirements]);

  const validationError = useMemo(() => validateDoc(doc), [doc]);
  const yamlText = useMemo(() => (step === "review" ? toYaml(doc) : ""), [doc, step]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setOptLoading(true);
      try {
        const [catsRes, ecosRes, ucsRes, assetsRes, featuresRes, phasesRes, custodysRes, reqRes] = await Promise.all([
          fetch("/api/categories").then((r) => r.json()),
          fetch("/api/ecosystems").then((r) => r.json()),
          fetch("/api/usecases").then((r) => r.json()),
          fetch("/api/assets").then((r) => r.json()),
          fetch("/api/features").then((r) => r.json()),
          fetch("/api/phases").then((r) => r.json()),
          fetch("/api/custodys").then((r) => r.json()),
          fetch("/api/requirements").then((r) => r.json()),
        ]);
        if (!alive) return;
        setCategories(Array.isArray(catsRes.categories) ? catsRes.categories : []);
        setEcosystems(Array.isArray(ecosRes.ecosystems) ? ecosRes.ecosystems : []);
        setUsecases(Array.isArray(ucsRes.usecases) ? ucsRes.usecases : []);
        setAssets(Array.isArray(assetsRes.assets) ? assetsRes.assets : []);
        setFeatures(Array.isArray(featuresRes.features) ? featuresRes.features : []);
        setPhases(Array.isArray(phasesRes.phases) ? phasesRes.phases : []);
        setCustodys(Array.isArray(custodysRes.custodys) ? custodysRes.custodys : []);
        setRequirements(Array.isArray(reqRes.requirements) ? reqRes.requirements : []);
      } finally {
        if (alive) setOptLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/editor-suggestions");
        const data = (await res.json()) as Partial<typeof suggestions>;
        if (!alive) return;
        setSuggestions({
          roles: Array.isArray(data.roles) ? data.roles : [],
          fundingTypes: Array.isArray(data.fundingTypes) ? data.fundingTypes : [],
          historyEventTypes: Array.isArray(data.historyEventTypes) ? data.historyEventTypes : [],
          auditCompanies: Array.isArray(data.auditCompanies) ? data.auditCompanies : [],
          auditNames: Array.isArray(data.auditNames) ? data.auditNames : [],
        });
      } catch {
        // ignore
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Keep doc.id synced with Project ID input (create + update, but do not overwrite a loaded doc unless it mismatches).
  useEffect(() => {
    if (!normalizedId) return;
    setDoc((prev) => {
      const current = safeObject(prev).id;
      if (typeof current === "string" && normalizeProjectId(current) === normalizedId) return prev;
      return setAtPath(prev, ["id"], normalizedId);
    });
  }, [normalizedId]);

  const loadExisting = async () => {
    setStatus(null);
    const parsedId = ProjectIdSchema.safeParse(normalizedId);
    if (!parsedId.success) {
      setStatus({ ok: false, error: parsedId.error.issues[0]?.message ?? "Invalid ID" });
      return;
    }
    if (target === "github" && !token.trim()) {
      setStatus({ ok: false, error: "GitHub token is required to load project YAML." });
      return;
    }

    setBusy(true);
    try {
      const res =
        target === "local"
          ? await fetch("/api/local/project-yaml", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ projectId: parsedId.data }),
            })
          : await fetch("/api/github/project-yaml", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ token: token.trim(), projectId: parsedId.data }),
            });
      const data = (await res.json()) as { ok: boolean; path?: string; yaml?: string; error?: string };
      if (!res.ok || !data.ok || !data.yaml) {
        setStatus({ ok: false, error: data.error ?? "Failed to load YAML" });
        return;
      }
      setSourcePath(typeof data.path === "string" ? data.path : null);
      const parsed = yaml.load(data.yaml) as unknown;
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        setStatus({ ok: false, error: "Loaded YAML is not a mapping/object." });
        return;
      }
      setDoc(parsed as ProjectDoc);
    } catch (err) {
      setStatus({ ok: false, error: (err as Error).message || "Failed to load YAML" });
    } finally {
      setBusy(false);
    }
  };

  const publish = async () => {
    setStatus(null);

    const parsedId = ProjectIdSchema.safeParse(normalizedId);
    if (!parsedId.success) {
      setStatus({ ok: false, error: parsedId.error.issues[0]?.message ?? "Invalid ID" });
      return;
    }
    if (target === "github" && !token.trim()) {
      setStatus({ ok: false, error: "GitHub token is required." });
      return;
    }

    const err = validateDoc(doc);
    if (err) {
      setStatus({ ok: false, error: err });
      return;
    }

    const yamlTextNow = toYaml(doc);
    setBusy(true);
    try {
      const res =
        target === "local"
          ? await fetch("/api/local/save-project", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                projectId: parsedId.data,
                yaml: yamlTextNow,
                sourcePath: sourcePath ?? undefined,
              }),
            })
          : await fetch("/api/github/commit-project", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                token: token.trim(),
                mode,
                projectId: parsedId.data,
                yaml: yamlTextNow,
                sourcePath: sourcePath ?? undefined,
              }),
            });
      const raw: unknown = await res.json();
      if (!res.ok) {
        setStatus({ ok: false, error: errorFromResponse(raw) ?? "Commit failed", details: raw });
        return;
      }

      if (target === "local") {
        const record = raw as Record<string, unknown>;
        const savedPath = typeof record.path === "string" ? record.path : null;
        if (!savedPath) {
          setStatus({ ok: false, error: "Save succeeded but no path returned." });
          return;
        }
        setStatus({ ok: true, kind: "local", path: savedPath });
        return;
      }

      const record = raw as Record<string, unknown>;
      const prUrl = typeof record.prUrl === "string" ? record.prUrl : null;
      const prNumber = typeof record.prNumber === "number" ? record.prNumber : null;
      const branch = typeof record.branch === "string" ? record.branch : null;
      const outPath = typeof record.path === "string" ? record.path : null;
      if (!prUrl || !prNumber || !branch || !outPath) {
        setStatus({ ok: false, error: "PR created but response was incomplete." });
        return;
      }
      setStatus({ ok: true, kind: "github", prUrl, prNumber, branch, path: outPath });
    } catch (err) {
      setStatus({ ok: false, error: (err as Error).message || "Commit failed" });
    } finally {
      setBusy(false);
    }
  };

  // Auto-load in update mode for local target.
  useEffect(() => {
    if (didAutoLoad.current) return;
    if (mode !== "update") return;
    if (!normalizedId) return;
    if (target !== "local") return;
    didAutoLoad.current = true;
    void loadExisting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, normalizedId, target]);

  const update = (path: string[], value: unknown) => setDoc((d) => setAtPath(d, path, value));

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <main className="viewport-range-shell mx-auto w-full max-w-[1280px] px-4 py-10 md:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/55 dark:text-white/55">
            Explorer
          </p>
          <h1 className="mt-3 font-serif text-[34px] leading-[1] tracking-[-0.02em] text-black md:text-[44px] dark:text-[#f2f4f6]">
            {mode === "create" ? "Add a project" : "Edit project"}
          </h1>
          <p className="mt-4 max-w-[70ch] text-[14px] leading-relaxed text-black/70 dark:text-white/70">
            Multi-step editor with suggestions. The generated YAML is shown in the final step and
            is used for publishing.
          </p>
        </div>

        <div className="inline-flex overflow-hidden rounded-[12px] border border-black/15 bg-white dark:border-white/15 dark:bg-[#151a21]">
          <button
            type="button"
            onClick={() => setMode("create")}
            className={cn(
              "px-4 py-2 text-[12px] font-bold uppercase tracking-[0.08em] transition-colors",
              mode === "create"
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "text-black/70 hover:text-black hover:bg-black/5 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10"
            )}
            aria-pressed={mode === "create"}
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => setMode("update")}
            className={cn(
              "px-4 py-2 text-[12px] font-bold uppercase tracking-[0.08em] transition-colors",
              mode === "update"
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "text-black/70 hover:text-black hover:bg-black/5 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10"
            )}
            aria-pressed={mode === "update"}
          >
            Update
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-6">
          <div className="rounded-[18px] border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#151a21]">
            <div className="flex items-center justify-between gap-3">
              <FieldLabel>Destination</FieldLabel>
              <div className="inline-flex overflow-hidden rounded-[12px] border border-black/15 bg-white dark:border-white/15 dark:bg-[#0f1318]">
                <button
                  type="button"
                  onClick={() => setTarget("local")}
                  className={cn(
                    "px-3 py-2 text-[12px] font-bold uppercase tracking-[0.08em] transition-colors",
                    target === "local"
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "text-black/70 hover:text-black hover:bg-black/5 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10"
                  )}
                  aria-pressed={target === "local"}
                >
                  Local
                </button>
                <button
                  type="button"
                  onClick={() => setTarget("github")}
                  className={cn(
                    "px-3 py-2 text-[12px] font-bold uppercase tracking-[0.08em] transition-colors",
                    target === "github"
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "text-black/70 hover:text-black hover:bg-black/5 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10"
                  )}
                  aria-pressed={target === "github"}
                >
                  GitHub PR
                </button>
              </div>
            </div>

            <div className="mt-4">
              <FieldLabel>GitHub token</FieldLabel>
              <TextInput
                value={token}
                onChange={setToken}
                placeholder="ghp_..."
                type="password"
              />
              <p className="mt-2 text-[12px] leading-relaxed text-black/55 dark:text-white/55">
                {target === "github"
                  ? "Classic PAT with repo scope works. Not stored."
                  : "Disabled in Local mode."}
              </p>
            </div>

            <div className="mt-4">
              <FieldLabel>Project ID</FieldLabel>
              <TextInput
                value={projectId}
                onChange={setProjectId}
                placeholder="aztec"
              />
              <p className="mt-2 text-[12px] text-black/55 dark:text-white/55">
                Normalized: <span className="font-mono">{normalizedId || "-"}</span>
              </p>
              {mode === "update" ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={loadExisting}
                  className="mt-3 w-full rounded-[12px] border border-black/15 bg-white px-3 py-2 text-[12px] font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-black/5 disabled:opacity-50 dark:border-white/15 dark:bg-[#151a21] dark:text-[#f2f4f6] dark:hover:bg-white/10"
                >
                  {busy ? "Loading..." : "Load current YAML"}
                </button>
              ) : null}
              {sourcePath ? (
                <p className="mt-2 text-[12px] text-black/55 dark:text-white/55">
                  Source: <span className="font-mono">{sourcePath}</span>
                </p>
              ) : null}
            </div>
          </div>

          <nav className="rounded-[18px] border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-[#151a21]">
            {STEPS.map((s) => {
              const active = s.id === step;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStep(s.id)}
                  className={cn(
                    "w-full rounded-[14px] px-3 py-3 text-left transition-colors",
                    active
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "hover:bg-black/5 dark:hover:bg-white/10"
                  )}
                >
                  <div className="text-[12px] font-bold uppercase tracking-[0.08em]">
                    {s.label}
                  </div>
                  <div className={cn("mt-1 text-[12px]", active ? "text-white/75 dark:text-black/70" : "text-black/55 dark:text-white/55")}>
                    {s.hint}
                  </div>
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="space-y-6">
          {step === "basic" ? (
            <div className="space-y-6">
              <Panel title="Basic Information">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>Name</FieldLabel>
                    <TextInput
                      value={String(getAtPath(doc, ["name"]) ?? "")}
                      onChange={(v) => update(["name"], v)}
                      placeholder="Aztec"
                    />
                  </div>
                  <div>
                    <FieldLabel>Nickname (optional)</FieldLabel>
                    <TextInput
                      value={String(getAtPath(doc, ["nickname"]) ?? "")}
                      onChange={(v) => update(["nickname"], v)}
                      placeholder="aztec"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <FieldLabel>Description</FieldLabel>
                  <textarea
                    value={String(getAtPath(doc, ["description"]) ?? "")}
                    onChange={(e) => update(["description"], e.target.value)}
                    placeholder="Short description"
                    className="mt-2 min-h-[120px] w-full rounded-[12px] border border-black/15 bg-white p-3 text-[13px] leading-relaxed text-black shadow-sm outline-none focus:border-black/35 dark:border-white/15 dark:bg-[#0f1318] dark:text-[#f2f4f6] dark:focus:border-white/35"
                  />
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <MultiSelectField
                    label="Categories"
                    placeholder="Pick categories"
                    options={categoryOptions}
                    values={getStringArray(getAtPath(doc, ["categories"]))}
                    onChange={(v) => update(["categories"], v)}
                    loading={optLoading}
                  />
                  <MultiSelectField
                    label="Use-cases"
                    placeholder="Pick use-cases"
                    options={usecaseOptions}
                    values={getStringArray(getAtPath(doc, ["usecases"]))}
                    onChange={(v) => update(["usecases"], v)}
                    loading={optLoading}
                  />
                  <MultiSelectField
                    label="Ecosystem"
                    placeholder="Pick ecosystems"
                    options={ecosystemOptions}
                    values={getStringArray(getAtPath(doc, ["ecosystem"]))}
                    onChange={(v) => update(["ecosystem"], v)}
                    loading={optLoading}
                  />
                </div>

                <div className="mt-6 flex flex-wrap gap-4">
                  <Toggle
                    label="Sunset"
                    checked={Boolean(getAtPath(doc, ["sunset"]))}
                    onChange={(v) => update(["sunset"], v)}
                  />
                  <Toggle
                    label="Live status"
                    checked={Boolean(getAtPath(doc, ["project_status", "live_status"]))}
                    onChange={(v) => update(["project_status", "live_status"], v)}
                  />
                  <Toggle
                    label="Mainnet"
                    checked={Boolean(getAtPath(doc, ["project_status", "mainnet"]))}
                    onChange={(v) => update(["project_status", "mainnet"], v)}
                  />
                  <Toggle
                    label="Testnet"
                    checked={Boolean(getAtPath(doc, ["project_status", "testnet"]))}
                    onChange={(v) => update(["project_status", "testnet"], v)}
                  />
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>Project Phase</FieldLabel>
                    <select
                      value={String(getAtPath(doc, ["project_phase"]) ?? "")}
                      onChange={(e) => update(["project_phase"], e.target.value)}
                      className="mt-2 w-full rounded-[12px] border border-black/15 bg-white px-3 py-2 text-[13px] text-black shadow-sm outline-none focus:border-black/35 dark:border-white/15 dark:bg-[#0f1318] dark:text-[#f2f4f6] dark:focus:border-white/35"
                      disabled={optLoading}
                    >
                      <option value="">{optLoading ? "Loading..." : "Select phase"}</option>
                      {phases.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <FieldLabel>Version</FieldLabel>
                    <TextInput
                      value={String(getAtPath(doc, ["project_status", "version"]) ?? "")}
                      onChange={(v) => update(["project_status", "version"], v)}
                      placeholder="v1.2"
                    />
                  </div>
                </div>
              </Panel>
            </div>
          ) : null}

          {step === "openness" ? (
            <div className="space-y-6">
              <Panel title="Launch & Team">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>Product launch day</FieldLabel>
                    <TextInput
                      value={String(getAtPath(doc, ["product_launch_day"]) ?? "")}
                      onChange={(v) => update(["product_launch_day"], v)}
                      placeholder="YYYY-MM-DD"
                      type="date"
                    />
                    <p className="mt-2 text-[12px] text-black/55 dark:text-white/55">
                      Stored in YAML as <span className="font-mono">product_launch_day</span>.
                    </p>
                  </div>
                  <div className="flex flex-col justify-end gap-4">
                    <Toggle
                      label="Team anonymous"
                      checked={Boolean(getAtPath(doc, ["team", "anonymous"]))}
                      onChange={(v) => update(["team", "anonymous"], v)}
                    />
                    <div>
                      <FieldLabel>Company link (optional)</FieldLabel>
                      <TextInput
                        value={String(getAtPath(doc, ["team", "company", "link"]) ?? "")}
                        onChange={(v) => update(["team", "company", "link"], v)}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <FieldLabel>Team members</FieldLabel>
                  <p className="mt-2 text-[12px] text-black/55 dark:text-white/55">
                    Add people and their roles. Role field has suggestions.
                  </p>

                  {/* Suggestions */}
                  <datalist id="roles-list">
                    {suggestions.roles.map((r) => (
                      <option key={r} value={r} />
                    ))}
                  </datalist>

                  <div className="mt-4 space-y-3">
                    {(Array.isArray(getAtPath(doc, ["team", "teammembers"]))
                      ? (getAtPath(doc, ["team", "teammembers"]) as unknown[])
                      : []
                    ).map((m, idx) => {
                      const member = safeObject(m);
                      return (
                        <div
                          key={`member-${idx}`}
                          className="grid gap-3 rounded-[14px] border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-[#151a21] md:grid-cols-[1fr_1fr_1fr_auto]"
                        >
                          <div>
                            <FieldLabel>Name</FieldLabel>
                            <TextInput
                              value={String(member.name ?? "")}
                              onChange={(v) => {
                                const team = safeObject(getAtPath(doc, ["team"]));
                                const prev = Array.isArray(team.teammembers) ? (team.teammembers as unknown[]) : [];
                                const next = prev.slice() as Record<string, unknown>[];
                                next[idx] = { ...safeObject(next[idx]), name: v };
                                update(["team"], { ...team, teammembers: next });
                              }}
                              placeholder="Alice"
                            />
                          </div>
                          <div>
                            <FieldLabel>Role</FieldLabel>
                            <SuggestInput
                              value={String(member.role ?? "")}
                              onChange={(v) => {
                                const team = safeObject(getAtPath(doc, ["team"]));
                                const prev = Array.isArray(team.teammembers) ? (team.teammembers as unknown[]) : [];
                                const next = prev.slice() as Record<string, unknown>[];
                                next[idx] = { ...safeObject(next[idx]), role: v };
                                update(["team"], { ...team, teammembers: next });
                              }}
                              placeholder="Founder, Engineer..."
                              listId="roles-list"
                            />
                          </div>
                          <div>
                            <FieldLabel>Link</FieldLabel>
                            <TextInput
                              value={String(member.link ?? "")}
                              onChange={(v) => {
                                const team = safeObject(getAtPath(doc, ["team"]));
                                const prev = Array.isArray(team.teammembers) ? (team.teammembers as unknown[]) : [];
                                const next = prev.slice() as Record<string, unknown>[];
                                next[idx] = { ...safeObject(next[idx]), link: v };
                                update(["team"], { ...team, teammembers: next });
                              }}
                              placeholder="https://..."
                            />
                          </div>
                          <div className="flex items-end justify-end gap-2">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                const team = safeObject(getAtPath(doc, ["team"]));
                                const prev = Array.isArray(team.teammembers) ? (team.teammembers as unknown[]) : [];
                                const next = prev.slice();
                                const tmp = next[idx - 1];
                                next[idx - 1] = next[idx];
                                next[idx] = tmp;
                                update(["team"], { ...team, teammembers: next });
                              }}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-black/15 bg-white text-black/70 hover:bg-black/5 hover:text-black disabled:opacity-40 dark:border-white/15 dark:bg-[#151a21] dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                              aria-label="Move up"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              disabled={
                                idx ===
                                (Array.isArray(getAtPath(doc, ["team", "teammembers"]))
                                  ? (getAtPath(doc, ["team", "teammembers"]) as unknown[]).length - 1
                                  : 0)
                              }
                              onClick={() => {
                                const team = safeObject(getAtPath(doc, ["team"]));
                                const prev = Array.isArray(team.teammembers) ? (team.teammembers as unknown[]) : [];
                                const next = prev.slice();
                                const tmp = next[idx + 1];
                                next[idx + 1] = next[idx];
                                next[idx] = tmp;
                                update(["team"], { ...team, teammembers: next });
                              }}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-black/15 bg-white text-black/70 hover:bg-black/5 hover:text-black disabled:opacity-40 dark:border-white/15 dark:bg-[#151a21] dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                              aria-label="Move down"
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const team = safeObject(getAtPath(doc, ["team"]));
                                const prev = Array.isArray(team.teammembers) ? (team.teammembers as unknown[]) : [];
                                const next = prev.slice();
                                next.splice(idx, 1);
                                update(["team"], { ...team, teammembers: next });
                              }}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-black/15 bg-white text-black/70 hover:bg-black/5 hover:text-black dark:border-white/15 dark:bg-[#151a21] dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                              aria-label="Remove member"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => {
                        const team = safeObject(getAtPath(doc, ["team"]));
                        const prev = Array.isArray(team.teammembers) ? (team.teammembers as unknown[]) : [];
                        update(["team"], { ...team, teammembers: [...prev, { name: "", role: "", link: "" }] });
                      }}
                      className="w-full rounded-[12px] border border-black/15 bg-white px-4 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-black/5 dark:border-white/15 dark:bg-[#151a21] dark:text-[#f2f4f6] dark:hover:bg-white/10"
                    >
                      + Add team member
                    </button>
                  </div>
                </div>
              </Panel>

              <Panel title="Funding">
                {/* Suggestions */}
                <datalist id="funding-types-list">
                  {suggestions.fundingTypes.map((t) => (
                    <option key={t} value={t} />
                  ))}
                </datalist>

                <div className="space-y-3">
                  {(Array.isArray(getAtPath(doc, ["funding"])) ? (getAtPath(doc, ["funding"]) as unknown[]) : []).map(
                    (f, idx) => {
                      const fund = safeObject(f);
                      return (
                        <div
                          key={`fund-${idx}`}
                          className="grid gap-3 rounded-[14px] border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-[#151a21] md:grid-cols-[1.2fr_1fr_1fr_1fr_auto]"
                        >
                          <div>
                            <FieldLabel>Name</FieldLabel>
                            <TextInput
                              value={String(fund.name ?? "")}
                              onChange={(v) => {
                                const prev = Array.isArray(getAtPath(doc, ["funding"])) ? (getAtPath(doc, ["funding"]) as unknown[]) : [];
                                const next = prev.slice() as Record<string, unknown>[];
                                next[idx] = { ...safeObject(next[idx]), name: v };
                                update(["funding"], next);
                              }}
                              placeholder="a16z, Seed round..."
                            />
                          </div>
                          <div>
                            <FieldLabel>Type</FieldLabel>
                            <SuggestInput
                              value={String(fund.type ?? "")}
                              onChange={(v) => {
                                const prev = Array.isArray(getAtPath(doc, ["funding"])) ? (getAtPath(doc, ["funding"]) as unknown[]) : [];
                                const next = prev.slice() as Record<string, unknown>[];
                                next[idx] = { ...safeObject(next[idx]), type: v };
                                update(["funding"], next);
                              }}
                              placeholder="Seed, Grant..."
                              listId="funding-types-list"
                            />
                          </div>
                          <div>
                            <FieldLabel>Value</FieldLabel>
                            <TextInput
                              value={String(fund.value ?? "")}
                              onChange={(v) => {
                                const prev = Array.isArray(getAtPath(doc, ["funding"])) ? (getAtPath(doc, ["funding"]) as unknown[]) : [];
                                const next = prev.slice() as Record<string, unknown>[];
                                next[idx] = { ...safeObject(next[idx]), value: v };
                                update(["funding"], next);
                              }}
                              placeholder="$10M"
                            />
                          </div>
                          <div>
                            <FieldLabel>Time</FieldLabel>
                            <TextInput
                              value={String(fund.time ?? "")}
                              onChange={(v) => {
                                const prev = Array.isArray(getAtPath(doc, ["funding"])) ? (getAtPath(doc, ["funding"]) as unknown[]) : [];
                                const next = prev.slice() as Record<string, unknown>[];
                                next[idx] = { ...safeObject(next[idx]), time: v };
                                update(["funding"], next);
                              }}
                              placeholder="YYYY-MM-DD"
                              type="date"
                            />
                          </div>
                          <div className="flex items-end justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                const prev = Array.isArray(getAtPath(doc, ["funding"])) ? (getAtPath(doc, ["funding"]) as unknown[]) : [];
                                const next = prev.slice();
                                next.splice(idx, 1);
                                update(["funding"], next);
                              }}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-black/15 bg-white text-black/70 hover:bg-black/5 hover:text-black dark:border-white/15 dark:bg-[#151a21] dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                              aria-label="Remove funding"
                            >
                              ×
                            </button>
                          </div>
                          <div className="md:col-span-5">
                            <FieldLabel>Link</FieldLabel>
                            <TextInput
                              value={String(fund.link ?? "")}
                              onChange={(v) => {
                                const prev = Array.isArray(getAtPath(doc, ["funding"])) ? (getAtPath(doc, ["funding"]) as unknown[]) : [];
                                const next = prev.slice() as Record<string, unknown>[];
                                next[idx] = { ...safeObject(next[idx]), link: v };
                                update(["funding"], next);
                              }}
                              placeholder="https://..."
                            />
                          </div>
                        </div>
                      );
                    }
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      const prev = Array.isArray(getAtPath(doc, ["funding"])) ? (getAtPath(doc, ["funding"]) as unknown[]) : [];
                      update(["funding"], [...prev, { name: "", type: "", link: "", value: "", time: "" }]);
                    }}
                    className="w-full rounded-[12px] border border-black/15 bg-white px-4 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-black/5 dark:border-white/15 dark:bg-[#151a21] dark:text-[#f2f4f6] dark:hover:bg-white/10"
                  >
                    + Add funding entry
                  </button>
                </div>
              </Panel>

              <Panel title="History / Timeline">
                {/* Suggestions */}
                <datalist id="history-types-list">
                  {suggestions.historyEventTypes.map((t) => (
                    <option key={t} value={t} />
                  ))}
                </datalist>

                <div className="space-y-3">
                  {(Array.isArray(getAtPath(doc, ["history"])) ? (getAtPath(doc, ["history"]) as unknown[]) : []).map(
                    (h, idx) => {
                      const entry = safeObject(h);
                      return (
                        <div
                          key={`hist-${idx}`}
                          className="rounded-[14px] border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-[#151a21]"
                        >
                          <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_auto]">
                            <div>
                              <FieldLabel>Title</FieldLabel>
                              <TextInput
                                value={String(entry.title ?? "")}
                                onChange={(v) => {
                                  const prev = Array.isArray(getAtPath(doc, ["history"])) ? (getAtPath(doc, ["history"]) as unknown[]) : [];
                                  const next = prev.slice() as Record<string, unknown>[];
                                  next[idx] = { ...safeObject(next[idx]), title: v };
                                  update(["history"], next);
                                }}
                                placeholder="Mainnet launch"
                              />
                            </div>
                            <div>
                              <FieldLabel>Type</FieldLabel>
                              <SuggestInput
                                value={String(entry.event_type ?? "")}
                                onChange={(v) => {
                                  const prev = Array.isArray(getAtPath(doc, ["history"])) ? (getAtPath(doc, ["history"]) as unknown[]) : [];
                                  const next = prev.slice() as Record<string, unknown>[];
                                  next[idx] = { ...safeObject(next[idx]), event_type: v };
                                  update(["history"], next);
                                }}
                                placeholder="Launch, Audit..."
                                listId="history-types-list"
                              />
                            </div>
                            <div>
                              <FieldLabel>Time</FieldLabel>
                              <TextInput
                                value={String(entry.time ?? "")}
                                onChange={(v) => {
                                  const prev = Array.isArray(getAtPath(doc, ["history"])) ? (getAtPath(doc, ["history"]) as unknown[]) : [];
                                  const next = prev.slice() as Record<string, unknown>[];
                                  next[idx] = { ...safeObject(next[idx]), time: v };
                                  update(["history"], next);
                                }}
                                placeholder="YYYY-MM-DD"
                                type="date"
                              />
                            </div>
                            <div className="flex items-end justify-end gap-2">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => {
                                  const prev = Array.isArray(getAtPath(doc, ["history"])) ? (getAtPath(doc, ["history"]) as unknown[]) : [];
                                  const next = prev.slice();
                                  const tmp = next[idx - 1];
                                  next[idx - 1] = next[idx];
                                  next[idx] = tmp;
                                  update(["history"], next);
                                }}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-black/15 bg-white text-black/70 hover:bg-black/5 hover:text-black disabled:opacity-40 dark:border-white/15 dark:bg-[#151a21] dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                                aria-label="Move up"
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                disabled={
                                  idx ===
                                  (Array.isArray(getAtPath(doc, ["history"]))
                                    ? (getAtPath(doc, ["history"]) as unknown[]).length - 1
                                    : 0)
                                }
                                onClick={() => {
                                  const prev = Array.isArray(getAtPath(doc, ["history"])) ? (getAtPath(doc, ["history"]) as unknown[]) : [];
                                  const next = prev.slice();
                                  const tmp = next[idx + 1];
                                  next[idx + 1] = next[idx];
                                  next[idx] = tmp;
                                  update(["history"], next);
                                }}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-black/15 bg-white text-black/70 hover:bg-black/5 hover:text-black disabled:opacity-40 dark:border-white/15 dark:bg-[#151a21] dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                                aria-label="Move down"
                              >
                                ↓
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const prev = Array.isArray(getAtPath(doc, ["history"])) ? (getAtPath(doc, ["history"]) as unknown[]) : [];
                                  const next = prev.slice();
                                  next.splice(idx, 1);
                                  update(["history"], next);
                                }}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-black/15 bg-white text-black/70 hover:bg-black/5 hover:text-black dark:border-white/15 dark:bg-[#151a21] dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                                aria-label="Remove history item"
                              >
                                ×
                              </button>
                            </div>
                          </div>

                          <div className="mt-3 grid gap-3 md:grid-cols-2">
                            <div>
                              <FieldLabel>Link</FieldLabel>
                              <TextInput
                                value={String(entry.link ?? "")}
                                onChange={(v) => {
                                  const prev = Array.isArray(getAtPath(doc, ["history"])) ? (getAtPath(doc, ["history"]) as unknown[]) : [];
                                  const next = prev.slice() as Record<string, unknown>[];
                                  next[idx] = { ...safeObject(next[idx]), link: v };
                                  update(["history"], next);
                                }}
                                placeholder="https://..."
                              />
                            </div>
                            <div>
                              <FieldLabel>Description</FieldLabel>
                              <textarea
                                value={String(entry.description ?? "")}
                                onChange={(e) => {
                                  const prev = Array.isArray(getAtPath(doc, ["history"])) ? (getAtPath(doc, ["history"]) as unknown[]) : [];
                                  const next = prev.slice() as Record<string, unknown>[];
                                  next[idx] = { ...safeObject(next[idx]), description: e.target.value };
                                  update(["history"], next);
                                }}
                                placeholder="What changed?"
                                className="mt-2 min-h-[42px] w-full rounded-[12px] border border-black/15 bg-white p-3 text-[13px] leading-relaxed text-black shadow-sm outline-none focus:border-black/35 dark:border-white/15 dark:bg-[#0f1318] dark:text-[#f2f4f6] dark:focus:border-white/35"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      const prev = Array.isArray(getAtPath(doc, ["history"])) ? (getAtPath(doc, ["history"]) as unknown[]) : [];
                      update(["history"], [...prev, { title: "", event_type: "", time: "", link: "", description: "" }]);
                    }}
                    className="w-full rounded-[12px] border border-black/15 bg-white px-4 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-black/5 dark:border-white/15 dark:bg-[#151a21] dark:text-[#f2f4f6] dark:hover:bg-white/10"
                  >
                    + Add history item
                  </button>
                </div>
              </Panel>
            </div>
          ) : null}

          {step === "tech" ? (
            <Panel title="Technical Information">
              <div className="grid gap-4 md:grid-cols-2">
                <Toggle
                  label="Open source"
                  checked={Boolean(getAtPath(doc, ["blockchain_features", "opensource"]))}
                  onChange={(v) => update(["blockchain_features", "opensource"], v)}
                />
                <Toggle
                  label="P2P"
                  checked={Boolean(getAtPath(doc, ["blockchain_features", "p2p"]))}
                  onChange={(v) => update(["blockchain_features", "p2p"], v)}
                />
                <Toggle
                  label="Decentralized storage"
                  checked={Boolean(getAtPath(doc, ["storage", "decentralized"]))}
                  onChange={(v) => update(["storage", "decentralized"], v)}
                />
                <Toggle
                  label="Upgradable"
                  checked={Boolean(getAtPath(doc, ["blockchain_features", "upgradability", "enabled"]))}
                  onChange={(v) => update(["blockchain_features", "upgradability", "enabled"], v)}
                />
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel>Asset custody type</FieldLabel>
                  <select
                    value={String(getAtPath(doc, ["blockchain_features", "asset_custody_type"]) ?? "")}
                    onChange={(e) => update(["blockchain_features", "asset_custody_type"], e.target.value)}
                    className="mt-2 w-full rounded-[12px] border border-black/15 bg-white px-3 py-2 text-[13px] text-black shadow-sm outline-none focus:border-black/35 dark:border-white/15 dark:bg-[#0f1318] dark:text-[#f2f4f6] dark:focus:border-white/35"
                    disabled={optLoading}
                  >
                    <option value="">{optLoading ? "Loading..." : "Select custody"}</option>
                    {custodys.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <FieldLabel>Encryption</FieldLabel>
                  <TextInput
                    value={String(getAtPath(doc, ["blockchain_features", "encryption"]) ?? "")}
                    onChange={(v) => update(["blockchain_features", "encryption"], v)}
                    placeholder="ZK proofs, AES..."
                  />
                </div>
              </div>
              <div className="mt-6">
                <MultiSelectField
                  label="Technology features"
                  placeholder="Pick features"
                  options={featureOptions}
                  values={getStringArray(getAtPath(doc, ["technology", "features"]))}
                  onChange={(v) => update(["technology", "features"], v)}
                  loading={optLoading}
                />
              </div>
            </Panel>
          ) : null}

          {step === "privacy" ? (
            <Panel title="Privacy & Compliance">
              <div className="grid gap-4 md:grid-cols-2">
                <Toggle
                  label="KYC required"
                  checked={Boolean(getAtPath(doc, ["tracebility", "kyc"]))}
                  onChange={(v) => update(["tracebility", "kyc"], v)}
                />
                <Toggle
                  label="Privacy by default"
                  checked={Boolean(getAtPath(doc, ["default_privacy"]))}
                  onChange={(v) => update(["default_privacy"], v)}
                />
                <Toggle
                  label="Privacy policy defined"
                  checked={Boolean(getAtPath(doc, ["privacy_policy", "defined"]))}
                  onChange={(v) => update(["privacy_policy", "defined"], v)}
                />
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel>Privacy policy link</FieldLabel>
                  <TextInput
                    value={String(getAtPath(doc, ["privacy_policy", "link"]) ?? "")}
                    onChange={(v) => update(["privacy_policy", "link"], v)}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <FieldLabel>Compliance</FieldLabel>
                  <TextInput
                    value={String(getAtPath(doc, ["compliance"]) ?? "")}
                    onChange={(v) => update(["compliance"], v)}
                    placeholder="nFADP (Switzerland)"
                  />
                </div>
              </div>

              <div className="mt-4">
                <FieldLabel>Tracked data</FieldLabel>
                <textarea
                  value={String(getAtPath(doc, ["tracebility", "tracked_data"]) ?? "")}
                  onChange={(e) => update(["tracebility", "tracked_data"], e.target.value)}
                  placeholder="What data is tracked (if any)?"
                  className="mt-2 min-h-[90px] w-full rounded-[12px] border border-black/15 bg-white p-3 text-[13px] leading-relaxed text-black shadow-sm outline-none focus:border-black/35 dark:border-white/15 dark:bg-[#0f1318] dark:text-[#f2f4f6] dark:focus:border-white/35"
                />
              </div>

              <div className="mt-6">
                <MultiSelectField
                  label="Sign-in requirements"
                  placeholder="Pick requirements"
                  options={requirementOptions}
                  values={getStringArray(getAtPath(doc, ["tracebility", "sign_in_type_requirments"]))}
                  onChange={(v) => update(["tracebility", "sign_in_type_requirments"], v)}
                  loading={optLoading}
                />
              </div>
            </Panel>
          ) : null}

          {step === "security" ? (
            <div className="space-y-6">
              <Panel title="Audits">
                {/* Suggestions */}
                <datalist id="audit-names-list">
                  {suggestions.auditNames.map((t) => (
                    <option key={t} value={t} />
                  ))}
                </datalist>
                <datalist id="audit-companies-list">
                  {suggestions.auditCompanies.map((t) => (
                    <option key={t} value={t} />
                  ))}
                </datalist>

                <div className="space-y-3">
                  {(Array.isArray(getAtPath(doc, ["audits"])) ? (getAtPath(doc, ["audits"]) as unknown[]) : []).map(
                    (a, idx) => {
                      const audit = safeObject(a);
                      return (
                        <div
                          key={`audit-${idx}`}
                          className="grid gap-3 rounded-[14px] border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-[#151a21] md:grid-cols-[1.2fr_1fr_1fr_1fr_auto]"
                        >
                          <div>
                            <FieldLabel>Name</FieldLabel>
                            <SuggestInput
                              value={String(audit.name ?? "")}
                              onChange={(v) => {
                                const prev = Array.isArray(getAtPath(doc, ["audits"])) ? (getAtPath(doc, ["audits"]) as unknown[]) : [];
                                const next = prev.slice() as Record<string, unknown>[];
                                next[idx] = { ...safeObject(next[idx]), name: v };
                                update(["audits"], next);
                              }}
                              placeholder="Audit report"
                              listId="audit-names-list"
                            />
                          </div>
                          <div>
                            <FieldLabel>Company</FieldLabel>
                            <SuggestInput
                              value={String(audit.company ?? "")}
                              onChange={(v) => {
                                const prev = Array.isArray(getAtPath(doc, ["audits"])) ? (getAtPath(doc, ["audits"]) as unknown[]) : [];
                                const next = prev.slice() as Record<string, unknown>[];
                                next[idx] = { ...safeObject(next[idx]), company: v };
                                update(["audits"], next);
                              }}
                              placeholder="Trail of Bits..."
                              listId="audit-companies-list"
                            />
                          </div>
                          <div>
                            <FieldLabel>URL</FieldLabel>
                            <TextInput
                              value={String(audit.url ?? audit.link ?? "")}
                              onChange={(v) => {
                                const prev = Array.isArray(getAtPath(doc, ["audits"])) ? (getAtPath(doc, ["audits"]) as unknown[]) : [];
                                const next = prev.slice() as Record<string, unknown>[];
                                next[idx] = { ...safeObject(next[idx]), url: v };
                                update(["audits"], next);
                              }}
                              placeholder="https://..."
                            />
                          </div>
                          <div>
                            <FieldLabel>Time</FieldLabel>
                            <TextInput
                              value={String(audit.time ?? "")}
                              onChange={(v) => {
                                const prev = Array.isArray(getAtPath(doc, ["audits"])) ? (getAtPath(doc, ["audits"]) as unknown[]) : [];
                                const next = prev.slice() as Record<string, unknown>[];
                                next[idx] = { ...safeObject(next[idx]), time: v };
                                update(["audits"], next);
                              }}
                              placeholder="YYYY-MM-DD"
                              type="date"
                            />
                          </div>
                          <div className="flex items-end justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                const prev = Array.isArray(getAtPath(doc, ["audits"])) ? (getAtPath(doc, ["audits"]) as unknown[]) : [];
                                const next = prev.slice();
                                next.splice(idx, 1);
                                update(["audits"], next);
                              }}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-black/15 bg-white text-black/70 hover:bg-black/5 hover:text-black dark:border-white/15 dark:bg-[#151a21] dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                              aria-label="Remove audit"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      );
                    }
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      const prev = Array.isArray(getAtPath(doc, ["audits"])) ? (getAtPath(doc, ["audits"]) as unknown[]) : [];
                      update(["audits"], [...prev, { name: "", company: "", url: "", time: "" }]);
                    }}
                    className="w-full rounded-[12px] border border-black/15 bg-white px-4 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-black/5 dark:border-white/15 dark:bg-[#151a21] dark:text-[#f2f4f6] dark:hover:bg-white/10"
                  >
                    + Add audit
                  </button>
                </div>
              </Panel>

              <Panel title="Dependencies">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <FieldLabel>Technical SPOF</FieldLabel>
                    <textarea
                      value={String(getAtPath(doc, ["technical_spof"]) ?? "")}
                      onChange={(e) => update(["technical_spof"], e.target.value)}
                      placeholder="Key relayers, sequencers, admin keys..."
                      className="mt-2 min-h-[120px] w-full rounded-[12px] border border-black/15 bg-white p-3 text-[13px] leading-relaxed text-black shadow-sm outline-none focus:border-black/35 dark:border-white/15 dark:bg-[#0f1318] dark:text-[#f2f4f6] dark:focus:border-white/35"
                    />
                  </div>
                  <div>
                    <FieldLabel>Social trust</FieldLabel>
                    <textarea
                      value={String(getAtPath(doc, ["social_trust"]) ?? "")}
                      onChange={(e) => update(["social_trust"], e.target.value)}
                      placeholder="Trusted parties, multisigs..."
                      className="mt-2 min-h-[120px] w-full rounded-[12px] border border-black/15 bg-white p-3 text-[13px] leading-relaxed text-black shadow-sm outline-none focus:border-black/35 dark:border-white/15 dark:bg-[#0f1318] dark:text-[#f2f4f6] dark:focus:border-white/35"
                    />
                  </div>
                  <div>
                    <FieldLabel>Third-party dependency</FieldLabel>
                    <textarea
                      value={String(getAtPath(doc, ["third_party_dependency"]) ?? "")}
                      onChange={(e) => update(["third_party_dependency"], e.target.value)}
                      placeholder="External APIs, service providers..."
                      className="mt-2 min-h-[120px] w-full rounded-[12px] border border-black/15 bg-white p-3 text-[13px] leading-relaxed text-black shadow-sm outline-none focus:border-black/35 dark:border-white/15 dark:bg-[#0f1318] dark:text-[#f2f4f6] dark:focus:border-white/35"
                    />
                  </div>
                </div>
              </Panel>
            </div>
          ) : null}

          {step === "socials" ? (
            <Panel title="Links & Socials">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ["web", "Website"],
                  ["github", "GitHub"],
                  ["docs", "Docs"],
                  ["whitepaper", "Whitepaper"],
                  ["blog", "Blog"],
                  ["twitter", "Twitter / X"],
                  ["discord", "Discord"],
                  ["telegram", "Telegram"],
                  ["forum", "Forum"],
                  ["governance", "Governance"],
                ].map(([k, label]) => (
                  <div key={k}>
                    <FieldLabel>{label}</FieldLabel>
                    <TextInput
                      value={String(getAtPath(doc, ["links", k]) ?? "")}
                      onChange={(v) => update(["links", k], v)}
                      placeholder="https://..."
                    />
                  </div>
                ))}
              </div>
            </Panel>
          ) : null}

          {step === "assets" ? (
            <div className="space-y-6">
              <Panel title="Assets Used">
                <MultiSelectField
                  label="Assets used"
                  placeholder="Pick assets"
                  options={assetOptions}
                  values={getStringArray(getAtPath(doc, ["assets_used"]))}
                  onChange={(v) => update(["assets_used"], v)}
                  loading={optLoading}
                />
              </Panel>

              <Panel title="Tokens">
                <div className="flex flex-wrap gap-4">
                  <Toggle
                    label="Has token"
                    checked={Boolean(getAtPath(doc, ["have_token"]))}
                    onChange={(v) => update(["have_token"], v)}
                  />
                </div>

                <div className="mt-4 space-y-3">
                  {(Array.isArray(getAtPath(doc, ["tokens"])) ? (getAtPath(doc, ["tokens"]) as unknown[]) : []).map((t, idx) => {
                    const tok = safeObject(t);
                    return (
                      <div
                        key={`tok-${idx}`}
                        className="grid gap-3 rounded-[14px] border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-[#151a21] md:grid-cols-[1fr_1fr_1fr_auto]"
                      >
                        <div>
                          <FieldLabel>Symbol</FieldLabel>
                          <TextInput
                            value={String(tok.symbol ?? "")}
                            onChange={(v) => {
                              const next = [...(getAtPath(doc, ["tokens"]) as unknown[])] as Record<string, unknown>[];
                              next[idx] = { ...safeObject(next[idx]), symbol: v };
                              update(["tokens"], next);
                            }}
                            placeholder="$AZTEC"
                          />
                        </div>
                        <div>
                          <FieldLabel>Name</FieldLabel>
                          <TextInput
                            value={String(tok.name ?? "")}
                            onChange={(v) => {
                              const next = [...(getAtPath(doc, ["tokens"]) as unknown[])] as Record<string, unknown>[];
                              next[idx] = { ...safeObject(next[idx]), name: v };
                              update(["tokens"], next);
                            }}
                            placeholder="Aztec Token"
                          />
                        </div>
                        <div>
                          <FieldLabel>Link</FieldLabel>
                          <TextInput
                            value={String(tok.link ?? "")}
                            onChange={(v) => {
                              const next = [...(getAtPath(doc, ["tokens"]) as unknown[])] as Record<string, unknown>[];
                              next[idx] = { ...safeObject(next[idx]), link: v };
                              update(["tokens"], next);
                            }}
                            placeholder="https://..."
                          />
                        </div>
                        <div className="flex items-end justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              const next = [...(getAtPath(doc, ["tokens"]) as unknown[])];
                              next.splice(idx, 1);
                              update(["tokens"], next);
                            }}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-black/15 bg-white text-black/70 hover:bg-black/5 hover:text-black dark:border-white/15 dark:bg-[#151a21] dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                            aria-label="Remove token"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => {
                      const prev = Array.isArray(getAtPath(doc, ["tokens"])) ? (getAtPath(doc, ["tokens"]) as unknown[]) : [];
                      update(["tokens"], [...prev, { symbol: "", name: "", link: "" }]);
                    }}
                    className="w-full rounded-[12px] border border-black/15 bg-white px-4 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-black/5 dark:border-white/15 dark:bg-[#151a21] dark:text-[#f2f4f6] dark:hover:bg-white/10"
                  >
                    + Add token
                  </button>
                </div>
              </Panel>

              <Panel title="Screenshots">
                <div className="text-[12px] text-black/55 dark:text-white/55">
                  Stored in YAML under <span className="font-mono">screenshots:</span>
                </div>

                <div className="mt-4 space-y-3">
                  {(Array.isArray(getAtPath(doc, ["screenshots"])) ? (getAtPath(doc, ["screenshots"]) as unknown[]) : []).map((s, idx) => {
                    const shot = safeObject(s);
                    const url = typeof shot.url === "string" ? shot.url : typeof s === "string" ? (s as string) : "";
                    const caption = typeof shot.caption === "string" ? shot.caption : "";
                    return (
                      <div
                        key={`shot-${idx}`}
                        className="grid gap-3 rounded-[14px] border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-[#151a21] md:grid-cols-[160px_1fr_1fr_auto]"
                      >
                        <div>
                          <FieldLabel>Preview</FieldLabel>
                          <div className="mt-2 overflow-hidden rounded-[12px] border border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.04]">
                            <div className="relative aspect-[16/10]">
                              {url.trim() ? (
                                <a
                                  href={url.trim()}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="absolute inset-0 block"
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={url.trim()}
                                    alt={caption || "Screenshot"}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                  />
                                </a>
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center px-3 text-center text-[12px] font-semibold text-black/45 dark:text-white/45">
                                  Add an image URL
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <FieldLabel>URL</FieldLabel>
                          <TextInput
                            value={url}
                            onChange={(v) => {
                              const prev = Array.isArray(getAtPath(doc, ["screenshots"])) ? (getAtPath(doc, ["screenshots"]) as unknown[]) : [];
                              const next = prev.slice();
                              const prevEntry = safeObject(next[idx]);
                              next[idx] = { ...prevEntry, url: v };
                              update(["screenshots"], next);
                            }}
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <FieldLabel>Caption</FieldLabel>
                          <TextInput
                            value={caption}
                            onChange={(v) => {
                              const prev = Array.isArray(getAtPath(doc, ["screenshots"])) ? (getAtPath(doc, ["screenshots"]) as unknown[]) : [];
                              const next = prev.slice();
                              const prevEntry = safeObject(next[idx]);
                              next[idx] = { ...prevEntry, caption: v };
                              update(["screenshots"], next);
                            }}
                            placeholder="Dashboard"
                          />
                        </div>
                        <div className="flex items-end justify-end gap-2">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => {
                              const prev = Array.isArray(getAtPath(doc, ["screenshots"])) ? (getAtPath(doc, ["screenshots"]) as unknown[]) : [];
                              const next = prev.slice();
                              const tmp = next[idx - 1];
                              next[idx - 1] = next[idx];
                              next[idx] = tmp;
                              update(["screenshots"], next);
                            }}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-black/15 bg-white text-black/70 hover:bg-black/5 hover:text-black disabled:opacity-40 dark:border-white/15 dark:bg-[#151a21] dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            disabled={idx === (Array.isArray(getAtPath(doc, ["screenshots"])) ? (getAtPath(doc, ["screenshots"]) as unknown[]).length - 1 : 0)}
                            onClick={() => {
                              const prev = Array.isArray(getAtPath(doc, ["screenshots"])) ? (getAtPath(doc, ["screenshots"]) as unknown[]) : [];
                              const next = prev.slice();
                              const tmp = next[idx + 1];
                              next[idx + 1] = next[idx];
                              next[idx] = tmp;
                              update(["screenshots"], next);
                            }}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-black/15 bg-white text-black/70 hover:bg-black/5 hover:text-black disabled:opacity-40 dark:border-white/15 dark:bg-[#151a21] dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const prev = Array.isArray(getAtPath(doc, ["screenshots"])) ? (getAtPath(doc, ["screenshots"]) as unknown[]) : [];
                              const next = prev.slice();
                              next.splice(idx, 1);
                              update(["screenshots"], next);
                            }}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-black/15 bg-white text-black/70 hover:bg-black/5 hover:text-black dark:border-white/15 dark:bg-[#151a21] dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => {
                      const prev = Array.isArray(getAtPath(doc, ["screenshots"])) ? (getAtPath(doc, ["screenshots"]) as unknown[]) : [];
                      update(["screenshots"], [...prev, { url: "", caption: "" }]);
                    }}
                    className="w-full rounded-[12px] border border-black/15 bg-white px-4 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-black/5 dark:border-white/15 dark:bg-[#151a21] dark:text-[#f2f4f6] dark:hover:bg-white/10"
                  >
                    + Add screenshot
                  </button>
                </div>
              </Panel>
            </div>
          ) : null}

          {step === "review" ? (
            <Panel title="Review (YAML)">
              {validationError ? (
                <div className="rounded-[12px] border border-[#ef4444]/30 bg-[#ef4444]/10 p-3 text-[13px] text-[#7f1d1d] dark:text-[#fecaca]">
                  {validationError}
                </div>
              ) : (
                <div className="rounded-[12px] border border-black/10 bg-black/[0.02] p-3 text-[13px] text-black/65 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/70">
                  Ready to publish.
                </div>
              )}

              <textarea
                value={yamlText}
                readOnly
                spellCheck={false}
                className="mt-4 h-[560px] w-full resize-y rounded-[12px] border border-black/15 bg-white p-4 font-mono text-[12px] leading-[1.55] text-black shadow-sm outline-none dark:border-white/15 dark:bg-[#0f1318] dark:text-[#f2f4f6]"
              />
            </Panel>
          ) : null}
        </section>
      </div>

      {/* Bottom-right Publish button (original behavior) */}
      <div className="fixed bottom-5 right-5 z-40 md:bottom-8 md:right-8">
        <button
          type="button"
          onClick={publish}
          disabled={busy || !!validationError}
          className={cn(
            "rounded-[14px] px-6 py-4 text-[12px] font-bold uppercase tracking-[0.10em] shadow-lg transition-colors",
            busy || validationError
              ? "bg-black/30 text-white/80 cursor-not-allowed dark:bg-white/30 dark:text-black/80"
              : "bg-black text-white hover:bg-black/85 dark:bg-white dark:text-black dark:hover:bg-white/85"
          )}
        >
          {busy ? "Publishing..." : "Publish"}
        </button>
      </div>

      {/* Status toast-ish */}
      {status ? (
        <div className="fixed bottom-5 left-5 z-40 w-[min(520px,calc(100vw-40px))] rounded-[16px] border border-black/10 bg-white p-4 shadow-xl dark:border-white/10 dark:bg-[#151a21]">
          {status.ok ? (
            <div className="space-y-2">
              <div className="font-serif text-[18px] text-black dark:text-[#f2f4f6]">
                {status.kind === "local" ? "Saved locally" : "PR created"}
              </div>
              <div className="text-[13px] text-black/65 dark:text-white/65">
                Path: <span className="font-mono">{status.path}</span>
              </div>
              {status.kind === "github" ? (
                <>
                  <div className="text-[13px] text-black/65 dark:text-white/65">
                    Branch: <span className="font-mono">{status.branch}</span>
                  </div>
                  <a
                    className="inline-block text-[13px] font-semibold underline underline-offset-4"
                    href={status.prUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open PR #{status.prNumber}
                  </a>
                </>
              ) : null}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="font-serif text-[18px] text-black dark:text-[#f2f4f6]">Error</div>
              <div className="text-[13px] text-black/65 dark:text-white/65">{status.error}</div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setStatus(null)}
            className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-black/10 bg-white text-black/60 hover:bg-black/5 hover:text-black dark:border-white/10 dark:bg-[#151a21] dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      ) : null}

      {/* Step controls */}
      <div className="mt-10 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setStep(STEPS[Math.max(0, stepIndex - 1)].id)}
          disabled={stepIndex === 0}
          className="rounded-[12px] border border-black/15 bg-white px-4 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-black/5 disabled:opacity-40 dark:border-white/15 dark:bg-[#151a21] dark:text-[#f2f4f6] dark:hover:bg-white/10"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => setStep(STEPS[Math.min(STEPS.length - 1, stepIndex + 1)].id)}
          disabled={stepIndex === STEPS.length - 1}
          className="rounded-[12px] border border-black/15 bg-white px-4 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-black/5 disabled:opacity-40 dark:border-white/15 dark:bg-[#151a21] dark:text-[#f2f4f6] dark:hover:bg-white/10"
        >
          Next
        </button>
      </div>
    </main>
  );
}
