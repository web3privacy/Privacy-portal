import { notFound } from "next/navigation";
import Link from "next/link";
import { getProject, getProjectDetail } from "@/lib/org/w3pn-projects";
import { ProjectDetailLayout } from "@/components/org/projects/detail/ProjectDetailLayout";
import { ProjectDetailHero } from "@/components/org/projects/detail/ProjectDetailHero";
import { ProjectDetailMissionLinks } from "@/components/org/projects/detail/ProjectDetailMissionLinks";
import { ProjectDetailFeatures } from "@/components/org/projects/detail/ProjectDetailFeatures";
import { ProjectDetailArticles } from "@/components/org/projects/detail/ProjectDetailArticles";
import { ProjectDetailRoadmap } from "@/components/org/projects/detail/ProjectDetailRoadmap";
import { ProjectDetailTestimonials } from "@/components/org/projects/detail/ProjectDetailTestimonials";
import { ProjectDetailContribute } from "@/components/org/projects/detail/ProjectDetailContribute";
import { ProjectDetailFeedback } from "@/components/org/projects/detail/ProjectDetailFeedback";
import { ProjectDetailDonate } from "@/components/org/projects/detail/ProjectDetailDonate";
import { ProjectDetailTeam } from "@/components/org/projects/detail/ProjectDetailTeam";
import { ProjectDetailPartners } from "@/components/org/projects/detail/ProjectDetailPartners";
import { ProjectDetailFooter } from "@/components/org/projects/detail/ProjectDetailFooter";
import { ProjectDetailPlaceholder } from "@/components/org/projects/detail/ProjectDetailPlaceholder";

export async function generateMetadata({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const project = getProject(projectId);
  return {
    title: project ? `${String((project as { name?: string }).name ?? projectId)} | Web3Privacy Now` : "Project | Web3Privacy Now",
  };
}

type Detail = Record<string, unknown> & {
  hero?: unknown;
  mission?: unknown;
  links?: unknown;
  features?: unknown;
  articles?: unknown[];
  articlesHrefAll?: string;
  roadmap?: unknown[];
  roadmapPagination?: unknown;
  testimonials?: unknown[];
  testimonialsReadMoreHref?: string;
  contribute?: unknown;
  donate?: unknown;
  team?: unknown[];
  partners?: unknown[];
  footer?: unknown;
};

export default async function OrgProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = getProject(projectId);
  const detail = getProjectDetail(projectId) as Detail | null;

  if (!project) notFound();

  const proj = project as { name?: string; description?: string; links?: { url?: string; docs?: string; github?: string } };
  const external = proj.links?.url ?? proj.links?.docs ?? proj.links?.github;

  // No detail: show external link or "detail not available"
  if (!detail) {
    if (external?.startsWith("http")) {
      return (
        <main className="landing-root" style={{ minHeight: "100vh", paddingTop: "82px" }}>
          <div className="page-content-wrap page-content-wrap--with-padding" style={{ padding: "82px 24px 48px", textAlign: "center" }}>
            <h1 style={{ color: "#f2f4f6" }}>{proj.name}</h1>
            <p style={{ color: "rgba(255,255,255,0.8)" }}>Visit the project:</p>
            <a href={external} target="_blank" rel="noreferrer" style={{ color: "#70ff88", fontSize: 18 }}>
              {external}
            </a>
            <p style={{ marginTop: 24 }}>
              <Link href="/org/projects" style={{ color: "#70ff88" }}>← Back to Projects</Link>
            </p>
          </div>
        </main>
      );
    }
    return (
      <main className="landing-root" style={{ minHeight: "100vh", paddingTop: "82px" }}>
        <div className="page-content-wrap page-content-wrap--with-padding" style={{ padding: "82px 24px 48px", textAlign: "center" }}>
          <h1 style={{ color: "#f2f4f6" }}>Detail not available</h1>
          <Link href="/org/projects" style={{ color: "#70ff88" }}>← Back to Projects</Link>
        </div>
      </main>
    );
  }

  const hasFeatures =
    (Array.isArray(detail.features) && detail.features.length > 0) ||
    (detail.features && typeof detail.features === "object" && (
      ((detail.features as { cards?: unknown[] }).cards?.length ?? 0) > 0 ||
      ((detail.features as { items?: unknown[] }).items?.length ?? 0) > 0
    ));

  return (
    <div className="landing-root">
      <ProjectDetailLayout>
        <div className="content-shell content-shell--with-padding" style={{ paddingTop: 82 }}>
          <ProjectDetailHero hero={detail.hero as any} />
          <ProjectDetailMissionLinks mission={detail.mission as any} links={detail.links as any} />
          {hasFeatures ? (
            <ProjectDetailFeatures features={detail.features as any} />
          ) : (
            <ProjectDetailPlaceholder sectionTitle="Features" />
          )}
          {detail.articles?.length ? (
            <ProjectDetailArticles articles={detail.articles as any} hrefAll={detail.articlesHrefAll} />
          ) : (
            <ProjectDetailPlaceholder sectionTitle="Articles" message="Articles tagged with this project are available on the main portal." />
          )}
          {detail.roadmap?.length ? (
            <ProjectDetailRoadmap roadmap={detail.roadmap as any} roadmapPagination={detail.roadmapPagination as any} />
          ) : (
            <ProjectDetailPlaceholder sectionTitle="Roadmap" />
          )}
          {detail.testimonials?.length ? (
            <ProjectDetailTestimonials testimonials={detail.testimonials as any} readMoreHref={detail.testimonialsReadMoreHref} />
          ) : (
            <ProjectDetailPlaceholder sectionTitle="Testimonials" />
          )}
          <ProjectDetailContribute contribute={detail.contribute as any} />
          <ProjectDetailFeedback />
          <ProjectDetailDonate donate={detail.donate as any} />
          {detail.team?.length ? (
            <ProjectDetailTeam team={detail.team as any} />
          ) : (
            <ProjectDetailPlaceholder sectionTitle="Team" />
          )}
          {detail.partners?.length ? (
            <ProjectDetailPartners partners={detail.partners as any} />
          ) : (
            <ProjectDetailPlaceholder sectionTitle="Partners" />
          )}
          <ProjectDetailFooter projectName={proj.name} footer={detail.footer as any} />
        </div>
      </ProjectDetailLayout>
    </div>
  );
}
