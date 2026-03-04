import { ProjectEditor } from "@/components/project-editor/ProjectEditor";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProjectEditor initialMode="update" initialProjectId={id} />;
}

