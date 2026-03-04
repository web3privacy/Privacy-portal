import { getOrgDefaultContent } from "@/lib/org/default-content";
import OrgDonateContent from "@/components/org/OrgDonateContent";

export const metadata = {
  title: "Donate | Web3Privacy Now",
  description: "Support our mission to defend digital freedom.",
};

export default function OrgDonatePage() {
  const content = getOrgDefaultContent();
  return <OrgDonateContent content={content} />;
}
