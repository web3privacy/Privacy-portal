import { loadPeopleData, getPersonById } from "@/lib/people";
import { PersonDetailPageContent } from "@/components/people/person-detail-page-content";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Person | Privacy Portal",
  description: "Person profile in the privacy and Web3 ecosystem",
};

export const revalidate = 0;

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PersonDetailPage({ params }: Props) {
  const { id } = await params;
  const data = loadPeopleData();
  const person = getPersonById(data, id);

  if (!person) {
    return notFound();
  }

  return <PersonDetailPageContent person={person} />;
}
