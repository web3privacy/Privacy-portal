"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { AcademyData, Talk, Course, Guide, RadioTrack, FeaturedDocument, AcceleratorItem } from "@/types/academy";

type Props = {
  data: AcademyData;
};

export function AcademyAdminEnhanced({ data: initialData }: Props) {
  const [data, setData] = useState(initialData);
  const [draggedItem, setDraggedItem] = useState<{ type: string; id: string } | null>(null);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

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

  const handleReorder = async (type: "talks" | "radioTracks", items: { id: string; displayOrder: number }[]) => {
    await fetch("/api/academy", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "reorder",
        contentType: type,
        items,
      }),
    });
    refresh();
  };

  const handleDragStart = (e: React.DragEvent, type: string, id: string) => {
    setDraggedItem({ type, id });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, targetType: "talks" | "radioTracks", targetId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.type !== targetType) return;

    const items = data[targetType] as (Talk | RadioTrack)[];
    const draggedIndex = items.findIndex((item) => item.id === draggedItem.id);
    const targetIndex = items.findIndex((item) => item.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1 || draggedIndex === targetIndex) {
      setDraggedItem(null);
      return;
    }

    // Reorder items
    const newItems = [...items];
    const [removed] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, removed);

    // Update displayOrder
    const reorderedItems = newItems.map((item, index) => ({
      id: item.id,
      displayOrder: index + 1,
    }));

    await handleReorder(targetType, reorderedItems);
    setDraggedItem(null);
  };

  const updateOrder = async (type: "talks" | "radioTracks", id: string, newOrder: number) => {
    const items = data[type] as (Talk | RadioTrack)[];
    const reorderedItems = items.map((item) => ({
      id: item.id,
      displayOrder: item.id === id ? newOrder : (item.displayOrder || 999),
    }));
    await handleReorder(type, reorderedItems);
  };

  return (
    <div className="space-y-12">
      {/* Talks Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-bold">Talks (Videos)</h2>
          <Link
            href="/academy/admin/add?type=talk"
            className="text-sm underline text-[#70FF88] hover:text-[#5bee72]"
          >
            + Add Talk
          </Link>
        </div>
        <div className="rounded-[12px] border border-[#e0e0e0] bg-white dark:border-[#303640] dark:bg-[#181d25] overflow-hidden">
          <div className="space-y-0">
            {data.talks.map((talk, index) => (
              <div
                key={talk.id}
                draggable
                onDragStart={(e) => handleDragStart(e, "talks", talk.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, "talks", talk.id)}
                className={`flex items-center gap-4 p-4 border-b border-[#e0e0e0] dark:border-[#303640] last:border-b-0 hover:bg-[#f5f5f5] dark:hover:bg-[#1f252d] cursor-move ${
                  draggedItem?.id === talk.id ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-center gap-2 shrink-0">
                  <span className="material-symbols-rounded text-[20px] text-[#616161] dark:text-[#a7b0bd]">
                    drag_handle
                  </span>
                  <input
                    type="number"
                    value={talk.displayOrder ?? index + 1}
                    onChange={(e) => updateOrder("talks", talk.id, parseInt(e.target.value) || 0)}
                    className="w-16 rounded border px-2 py-1 text-sm"
                    min="1"
                  />
                </div>
                {talk.thumbnailUrl && (
                  <div className="relative w-24 h-16 shrink-0 rounded overflow-hidden bg-[#f5f5f5] dark:bg-[#252b35]">
                    <img
                      src={talk.thumbnailUrl}
                      alt={talk.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{talk.title}</div>
                  <div className="text-xs text-[#616161] dark:text-[#a7b0bd] mt-1">
                    {talk.speaker && `${talk.speaker} • `}
                    {talk.duration && `${talk.duration} • `}
                    YouTube ID: {talk.youtubeId}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link
                    href={`/academy/admin/edit/${talk.id}?type=talk`}
                    className="text-sm underline text-black hover:text-[#616161] dark:text-white dark:hover:text-[#a7b0bd]"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(talk.id, "talk")}
                    className="text-sm text-red-600 underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {data.talks.length === 0 && (
              <div className="text-sm text-[#616161] dark:text-[#a7b0bd] py-8 text-center">No talks</div>
            )}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-bold">Courses (Lectures)</h2>
          <Link
            href="/academy/admin/add?type=course"
            className="text-sm underline text-[#70FF88] hover:text-[#5bee72]"
          >
            + Add Course
          </Link>
        </div>
        <div className="rounded-[12px] border border-[#e0e0e0] bg-white dark:border-[#303640] dark:bg-[#181d25] overflow-hidden">
          <div className="space-y-0">
            {data.courses.map((course) => (
              <div
                key={course.id}
                className="flex items-center gap-4 p-4 border-b border-[#e0e0e0] dark:border-[#303640] last:border-b-0 hover:bg-[#f5f5f5] dark:hover:bg-[#1f252d]"
              >
                {course.icon && (
                  <div className="relative w-16 h-16 shrink-0 rounded overflow-hidden bg-[#f5f5f5] dark:bg-[#252b35]">
                    <img
                      src={course.icon}
                      alt={course.title}
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{course.title}</div>
                  <div className="text-xs text-[#616161] dark:text-[#a7b0bd] mt-1 truncate">
                    {course.url}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link
                    href={`/academy/admin/edit/${course.id}?type=course`}
                    className="text-sm underline text-black hover:text-[#616161] dark:text-white dark:hover:text-[#a7b0bd]"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(course.id, "course")}
                    className="text-sm text-red-600 underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {data.courses.length === 0 && (
              <div className="text-sm text-[#616161] dark:text-[#a7b0bd] py-8 text-center">No courses</div>
            )}
          </div>
        </div>
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
        <div className="rounded-[12px] border border-[#e0e0e0] bg-white dark:border-[#303640] dark:bg-[#181d25] overflow-hidden">
          <div className="space-y-0">
            {data.guides.map((guide) => (
              <div
                key={guide.id}
                className="flex items-center gap-4 p-4 border-b border-[#e0e0e0] dark:border-[#303640] last:border-b-0 hover:bg-[#f5f5f5] dark:hover:bg-[#1f252d]"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {guide.title}
                    {guide.isNew && (
                      <span className="ml-2 rounded-full bg-[#70FF88] px-2 py-0.5 text-[10px] font-bold uppercase text-black">
                        NEW
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#616161] dark:text-[#a7b0bd] mt-1 truncate">
                    {guide.url}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link
                    href={`/academy/admin/edit/${guide.id}?type=guide`}
                    className="text-sm underline text-black hover:text-[#616161] dark:text-white dark:hover:text-[#a7b0bd]"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(guide.id, "guide")}
                    className="text-sm text-red-600 underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {data.guides.length === 0 && (
              <div className="text-sm text-[#616161] dark:text-[#a7b0bd] py-8 text-center">No guides</div>
            )}
          </div>
        </div>
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
        <div className="rounded-[12px] border border-[#e0e0e0] bg-white dark:border-[#303640] dark:bg-[#181d25] overflow-hidden">
          <div className="space-y-0">
            {data.radioTracks.map((track, index) => (
              <div
                key={track.id}
                draggable
                onDragStart={(e) => handleDragStart(e, "radioTracks", track.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, "radioTracks", track.id)}
                className={`flex items-center gap-4 p-4 border-b border-[#e0e0e0] dark:border-[#303640] last:border-b-0 hover:bg-[#f5f5f5] dark:hover:bg-[#1f252d] cursor-move ${
                  draggedItem?.id === track.id ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-center gap-2 shrink-0">
                  <span className="material-symbols-rounded text-[20px] text-[#616161] dark:text-[#a7b0bd]">
                    drag_handle
                  </span>
                  <input
                    type="number"
                    value={track.displayOrder ?? index + 1}
                    onChange={(e) => updateOrder("radioTracks", track.id, parseInt(e.target.value) || 0)}
                    className="w-16 rounded border px-2 py-1 text-sm"
                    min="1"
                  />
                </div>
                {track.thumbnailUrl && (
                  <div className="relative w-24 h-16 shrink-0 rounded overflow-hidden bg-[#f5f5f5] dark:bg-[#252b35]">
                    <img
                      src={track.thumbnailUrl}
                      alt={track.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{track.title}</div>
                  <div className="text-xs text-[#616161] dark:text-[#a7b0bd] mt-1">
                    {track.speaker && `${track.speaker} • `}
                    {track.duration && `${track.duration} • `}
                    YouTube ID: {track.youtubeId}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link
                    href={`/academy/admin/edit/${track.id}?type=radioTrack`}
                    className="text-sm underline text-black hover:text-[#616161] dark:text-white dark:hover:text-[#a7b0bd]"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(track.id, "radioTrack")}
                    className="text-sm text-red-600 underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {data.radioTracks.length === 0 && (
              <div className="text-sm text-[#616161] dark:text-[#a7b0bd] py-8 text-center">No radio tracks</div>
            )}
          </div>
        </div>
      </section>

      {/* Accelerator Items Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-bold">Accelerator Items</h2>
          <Link
            href="/academy/admin/add?type=acceleratorItem"
            className="text-sm underline text-[#70FF88] hover:text-[#5bee72]"
          >
            + Add Item
          </Link>
        </div>
        <div className="rounded-[12px] border border-[#e0e0e0] bg-white dark:border-[#303640] dark:bg-[#181d25] overflow-hidden">
          <div className="space-y-0">
            {data.acceleratorItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 border-b border-[#e0e0e0] dark:border-[#303640] last:border-b-0 hover:bg-[#f5f5f5] dark:hover:bg-[#1f252d]"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{item.title}</div>
                  {item.description && (
                    <div className="text-xs text-[#616161] dark:text-[#a7b0bd] mt-1">
                      {item.description}
                    </div>
                  )}
                  {item.url && (
                    <div className="text-xs text-[#616161] dark:text-[#a7b0bd] mt-1 truncate">
                      {item.url}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link
                    href={`/academy/admin/edit/${item.id}?type=acceleratorItem`}
                    className="text-sm underline text-black hover:text-[#616161] dark:text-white dark:hover:text-[#a7b0bd]"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id, "acceleratorItem")}
                    className="text-sm text-red-600 underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {data.acceleratorItems.length === 0 && (
              <div className="text-sm text-[#616161] dark:text-[#a7b0bd] py-8 text-center">No accelerator items</div>
            )}
          </div>
        </div>
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
        <div className="rounded-[12px] border border-[#e0e0e0] bg-white dark:border-[#303640] dark:bg-[#181d25] overflow-hidden">
          <div className="space-y-0">
            {data.featuredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-4 p-4 border-b border-[#e0e0e0] dark:border-[#303640] last:border-b-0 hover:bg-[#f5f5f5] dark:hover:bg-[#1f252d]"
              >
                {doc.thumbnailUrl && (
                  <div className="relative w-24 h-16 shrink-0 rounded overflow-hidden bg-[#f5f5f5] dark:bg-[#252b35]">
                    <img
                      src={doc.thumbnailUrl}
                      alt={doc.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{doc.title}</div>
                  <div className="text-xs text-[#616161] dark:text-[#a7b0bd] mt-1 truncate">
                    {doc.url}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link
                    href={`/academy/admin/edit/${doc.id}?type=featuredDocument`}
                    className="text-sm underline text-black hover:text-[#616161] dark:text-white dark:hover:text-[#a7b0bd]"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(doc.id, "featuredDocument")}
                    className="text-sm text-red-600 underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {data.featuredDocuments.length === 0 && (
              <div className="text-sm text-[#616161] dark:text-[#a7b0bd] py-8 text-center">No documents</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
