import "@/styles/org/global.css";
import "@/styles/org/project-detail.css";
import { getOrgDefaultContent } from "@/lib/org/default-content";
import OrgLayoutClient from "@/components/org/OrgLayoutClient";

export const metadata = {
  title: "Web3Privacy Now",
  description: "Uniting efforts and empowering society to defend freedom.",
};

export default function OrgLayout({ children }: { children: React.ReactNode }) {
  const content = getOrgDefaultContent();
  return <OrgLayoutClient content={content}>{children}</OrgLayoutClient>;
}
