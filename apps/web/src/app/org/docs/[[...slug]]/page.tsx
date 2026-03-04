import OrgDocsViewer from "@/components/org/docs/OrgDocsViewer";

export const metadata = {
  title: "Docs | Web3Privacy Now",
  description: "Documentation and guides for the Web3Privacy ecosystem.",
};

export default async function OrgDocsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  return <OrgDocsViewer slugParam={slug} />;
}
