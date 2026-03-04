import { getAcademyItemById } from "@/lib/academy";
import { EditTalkForm } from "@/components/academy/edit-talk-form";
import { EditCourseForm } from "@/components/academy/edit-course-form";
import { EditGuideForm } from "@/components/academy/edit-guide-form";
import { EditRadioTrackForm } from "@/components/academy/edit-radio-track-form";
import { EditFeaturedDocumentForm } from "@/components/academy/edit-featured-document-form";
import { EditAcceleratorItemForm } from "@/components/academy/edit-accelerator-item-form";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditAcademyItemPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { id } = await params;
  const { type } = await searchParams;
  
  if (!type) {
    return notFound();
  }

  const item = getAcademyItemById(id, type);
  if (!item) return notFound();

  const renderForm = () => {
    switch (type) {
      case "talk":
        return <EditTalkForm talk={item as any} />;
      case "course":
        return <EditCourseForm course={item as any} />;
      case "guide":
        return <EditGuideForm guide={item as any} />;
      case "radioTrack":
        return <EditRadioTrackForm track={item as any} />;
      case "featuredDocument":
        return <EditFeaturedDocumentForm document={item as any} />;
      case "acceleratorItem":
        return <EditAcceleratorItemForm item={item as any} />;
      default:
        return null;
    }
  };

  return (
    <div className="viewport-range-shell mx-auto w-full px-4 py-10 md:px-6 max-w-2xl">
      <Link href="/academy/admin" className="text-sm underline mb-4 block">← Admin</Link>
      <h1 className="font-serif text-2xl font-bold mb-6">Edit {type}</h1>
      {renderForm()}
    </div>
  );
}
