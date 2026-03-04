"use client";

import type { Course } from "@/types/academy";

type Props = {
  courses: Course[];
  alignButtonRight?: boolean;
};

export function Lectures({ courses, alignButtonRight = false }: Props) {
  if (courses.length === 0) {
    return (
      <section className="mb-12">
        <h2 className="mb-4 font-serif text-[22px] font-bold text-black dark:text-[#f2f4f6]">
          Lectures
        </h2>
        <div className="rounded-[12px] border border-[#e0e0e0] bg-[#f0f0f0] p-6 dark:border-[#303640] dark:bg-[#1a1f27]">
          <p className="text-center text-[14px] text-[#616161] dark:text-[#a7b0bd]">
            No courses available
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <h2 className="mb-4 font-serif text-[22px] font-bold text-black dark:text-[#f2f4f6]">
        Lectures
      </h2>
      <div className="rounded-[12px] border border-[#e0e0e0] bg-[#f0f0f0] p-4 dark:border-[#303640] dark:bg-[#1a1f27]">
        <div className="space-y-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="flex items-center gap-4 rounded-[12px] border border-[#e0e0e0] bg-white p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.14)] dark:border-[#303640] dark:bg-[#181d25] dark:hover:shadow-[0_14px_30px_rgba(0,0,0,0.55)]"
            >
              {course.icon && (
                <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-[#f5f5f5] dark:bg-[#252b35]">
                  <img
                    src={course.icon}
                    alt=""
                    className="h-24 w-24 object-contain"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1 flex flex-col">
                <h3 className="mb-1 font-sans text-[15px] font-bold text-black dark:text-[#f2f4f6]">
                  {course.title}
                </h3>
                <p className="mb-2 text-[13px] leading-relaxed text-[#616161] dark:text-[#a7b0bd] flex-1">
                  {course.description}
                </p>
                <div className={`flex mt-1 ${alignButtonRight ? "justify-end" : "justify-start"}`}>
                  <a
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-7 items-center justify-center rounded-full border border-[#70FF88] bg-[#70FF88] px-2.5 text-[9px] font-bold uppercase tracking-[0.08em] text-black transition-all hover:-translate-y-0.5 hover:bg-[#5bee72]"
                  >
                    START COURSE
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
