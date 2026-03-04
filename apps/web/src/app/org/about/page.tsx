import { getOrgDefaultContent } from "@/lib/org/default-content";
import OrgAboutContent from "@/components/org/OrgAboutContent";

export const metadata = {
  title: "About | Web3Privacy Now",
  description: "We cultivate an ecosystem around digital freedom.",
};

export default function OrgAboutPage() {
  const content = getOrgDefaultContent();
  return <OrgAboutContent content={content} />;
}
