import { GlossaryPageContent } from "@/components/glossary/glossary-page-content";
import { loadGlossaryData } from "@/lib/glossary";

export const metadata = {
  title: "Glossary | Privacy Portal",
  description:
    "Key privacy-related terms and concepts in Web3 and privacy technology.",
};

export default function GlossaryPage() {
  const data = loadGlossaryData();
  return <GlossaryPageContent terms={data.terms} />;
}
