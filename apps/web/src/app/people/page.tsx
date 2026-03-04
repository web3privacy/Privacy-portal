import { PeoplePageContent } from "@/components/people/people-page-content";
import { loadPeopleData } from "@/lib/people";

export const metadata = {
  title: "Personas | Privacy Portal",
  description: "People in the privacy and Web3 ecosystem",
};

export const revalidate = 0;

export default async function PeoplePage() {
  const data = loadPeopleData();

  return <PeoplePageContent people={data.people} />;
}
