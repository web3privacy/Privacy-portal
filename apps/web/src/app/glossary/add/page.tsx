import { AddTermForm } from "@/components/glossary/add-term-form";

export const metadata = {
  title: "Add Term | Glossary | Privacy Portal",
  description: "Add a new term to the privacy glossary.",
};

export default function AddTermPage() {
  return (
    <main className="viewport-range-shell mx-auto w-full max-w-[640px] px-4 py-10 md:px-6">
      <h1 className="font-serif text-[26px] font-bold text-black dark:text-[#f2f4f6] md:text-[30px]">
        Add new term
      </h1>
      <p className="mt-2 text-sm text-[#616161] dark:text-[#a7b0bd]">
        Add a privacy-related term and its definition to the glossary.
      </p>
      <AddTermForm className="mt-8" />
    </main>
  );
}
