"use client";

import { useState } from "react";
import Link from "next/link";
import type { AcademyData } from "@/types/academy";

type Props = {
  data: AcademyData;
};

export function AcademyAdminList({ data: initialData }: Props) {
  const [data, setData] = useState(initialData);

  const refresh = async () => {
    const res = await fetch("/api/academy");
    const newData = await res.json();
    setData(newData);
  };

  const handleDelete = async (id: string, type: string) => {
    if (!confirm(`Delete this ${type}?`)) return;
    await fetch(`/api/academy?id=${id}&type=${type}`, { method: "DELETE" });
    refresh();
  };

  return (
    <div className="space-y-8">
      {/* Talks Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-bold">Talks</h2>
          <Link
            href="/academy/admin/add?type=talk"
            className="text-sm underline text-[#70FF88] hover:text-[#5bee72]"
          >
            + Add Talk
          </Link>
        </div>
        <ul className="space-y-2">
          {data.talks.map((talk) => (
            <li key={talk.id} className="flex items-center justify-between py-2 border-b">
              <div className="flex-1 min-w-0">
                <span className="font-medium truncate block">{talk.title}</span>
                <span className="text-xs text-[#616161] dark:text-[#a7b0bd]">
                  Order: {talk.displayOrder ?? "auto"}
                </span>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Link href={`/academy/admin/edit/${talk.id}?type=talk`} className="text-sm underline text-black hover:text-[#616161] dark:text-white dark:hover:text-[#a7b0bd]">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(talk.id, "talk")}
                  className="text-sm text-red-600 underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
          {data.talks.length === 0 && (
            <li className="text-sm text-[#616161] dark:text-[#a7b0bd] py-2">No talks</li>
          )}
        </ul>
      </section>

      {/* Courses Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-bold">Courses</h2>
          <Link
            href="/academy/admin/add?type=course"
            className="text-sm underline text-[#70FF88] hover:text-[#5bee72]"
          >
            + Add Course
          </Link>
        </div>
        <ul className="space-y-2">
          {data.courses.map((course) => (
            <li key={course.id} className="flex items-center justify-between py-2 border-b">
              <span className="font-medium truncate">{course.title}</span>
              <div className="flex gap-2 flex-shrink-0">
                <Link href={`/academy/admin/edit/${course.id}?type=course`} className="text-sm underline text-black hover:text-[#616161] dark:text-white dark:hover:text-[#a7b0bd]">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(course.id, "course")}
                  className="text-sm text-red-600 underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
          {data.courses.length === 0 && (
            <li className="text-sm text-[#616161] dark:text-[#a7b0bd] py-2">No courses</li>
          )}
        </ul>
      </section>

      {/* Guides Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-bold">Guides</h2>
          <Link
            href="/academy/admin/add?type=guide"
            className="text-sm underline text-[#70FF88] hover:text-[#5bee72]"
          >
            + Add Guide
          </Link>
        </div>
        <ul className="space-y-2">
          {data.guides.map((guide) => (
            <li key={guide.id} className="flex items-center justify-between py-2 border-b">
              <span className="font-medium truncate">{guide.title}</span>
              <div className="flex gap-2 flex-shrink-0">
                <Link href={`/academy/admin/edit/${guide.id}?type=guide`} className="text-sm underline text-black hover:text-[#616161] dark:text-white dark:hover:text-[#a7b0bd]">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(guide.id, "guide")}
                  className="text-sm text-red-600 underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
          {data.guides.length === 0 && (
            <li className="text-sm text-[#616161] dark:text-[#a7b0bd] py-2">No guides</li>
          )}
        </ul>
      </section>

      {/* Radio Tracks Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-bold">Radio Tracks</h2>
          <Link
            href="/academy/admin/add?type=radioTrack"
            className="text-sm underline text-[#70FF88] hover:text-[#5bee72]"
          >
            + Add Radio Track
          </Link>
        </div>
        <ul className="space-y-2">
          {data.radioTracks.map((track) => (
            <li key={track.id} className="flex items-center justify-between py-2 border-b">
              <div className="flex-1 min-w-0">
                <span className="font-medium truncate block">{track.title}</span>
                <span className="text-xs text-[#616161] dark:text-[#a7b0bd]">
                  Order: {track.displayOrder ?? "auto"}
                </span>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Link href={`/academy/admin/edit/${track.id}?type=radioTrack`} className="text-sm underline text-black hover:text-[#616161] dark:text-white dark:hover:text-[#a7b0bd]">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(track.id, "radioTrack")}
                  className="text-sm text-red-600 underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
          {data.radioTracks.length === 0 && (
            <li className="text-sm text-[#616161] dark:text-[#a7b0bd] py-2">No radio tracks</li>
          )}
        </ul>
      </section>

      {/* Featured Documents Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-bold">Featured Documents</h2>
          <Link
            href="/academy/admin/add?type=featuredDocument"
            className="text-sm underline text-[#70FF88] hover:text-[#5bee72]"
          >
            + Add Document
          </Link>
        </div>
        <ul className="space-y-2">
          {data.featuredDocuments.map((doc) => (
            <li key={doc.id} className="flex items-center justify-between py-2 border-b">
              <span className="font-medium truncate">{doc.title}</span>
              <div className="flex gap-2 flex-shrink-0">
                <Link href={`/academy/admin/edit/${doc.id}?type=featuredDocument`} className="text-sm underline text-black hover:text-[#616161] dark:text-white dark:hover:text-[#a7b0bd]">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(doc.id, "featuredDocument")}
                  className="text-sm text-red-600 underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
          {data.featuredDocuments.length === 0 && (
            <li className="text-sm text-[#616161] dark:text-[#a7b0bd] py-2">No documents</li>
          )}
        </ul>
      </section>
    </div>
  );
}
