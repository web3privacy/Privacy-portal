import { getOrgDefaultContent } from "@/lib/org/default-content";
import OrgResourcesContent from "@/components/org/OrgResourcesContent";

export const metadata = {
  title: "Resources | Web3Privacy Now",
  description: "Community resources, articles, and guides.",
};

export default function OrgResourcesPage() {
  const content = getOrgDefaultContent();
  return <OrgResourcesContent content={content} />;
}
