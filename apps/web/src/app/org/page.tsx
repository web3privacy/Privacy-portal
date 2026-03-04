import { getOrgDefaultContent } from "@/lib/org/default-content";
import OrgLandingContent from "@/components/org/OrgLandingContent";

export const metadata = {
  title: "Web3Privacy Now",
  description: "Uniting efforts and empowering society to defend freedom.",
};

export default function OrgHomePage() {
  const content = getOrgDefaultContent();

  return <OrgLandingContent content={content} />;
}
