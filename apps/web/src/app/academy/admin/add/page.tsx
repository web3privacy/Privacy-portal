import { AddTalkForm } from "@/components/academy/add-talk-form";
import { AddCourseForm } from "@/components/academy/add-course-form";
import { AddGuideForm } from "@/components/academy/add-guide-form";
import { AddRadioTrackForm } from "@/components/academy/add-radio-track-form";
import { AddFeaturedDocumentForm } from "@/components/academy/add-featured-document-form";
import { AddAcceleratorItemForm } from "@/components/academy/add-accelerator-item-form";
import Link from "next/link";

export const metadata = {
  title: "Add Academy Item | Privacy Portal",
};

export default async function AddAcademyItemPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const type = params.type || "talk";

  const renderForm = () => {
    switch (type) {
      case "talk":
        return <AddTalkForm />;
      case "course":
        return <AddCourseForm />;
      case "guide":
        return <AddGuideForm />;
      case "radioTrack":
        return <AddRadioTrackForm />;
      case "featuredDocument":
        return <AddFeaturedDocumentForm />;
      case "acceleratorItem":
        return <AddAcceleratorItemForm />;
      default:
        return <AddTalkForm />;
    }
  };

  return (
    <div className="viewport-range-shell mx-auto w-full px-4 py-10 md:px-6 max-w-2xl">
      <Link href="/academy/admin" className="text-sm underline mb-4 block">← Admin</Link>
      <h1 className="font-serif text-2xl font-bold mb-6">Add {type}</h1>
      {renderForm()}
    </div>
  );
}
