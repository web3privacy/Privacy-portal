"use client";

import { RadioPlayer } from "./radio-player";
import type { RadioTrack } from "@/types/academy";

type Props = {
  tracks: RadioTrack[];
};

export function RadioPageContent({ tracks }: Props) {
  return (
    <main className="min-h-screen bg-white text-[#121212] dark:bg-[#0f1318] dark:text-[#f2f4f6]">
      <div className="viewport-range-shell mx-auto w-full max-w-[1140px] px-4 py-10 md:px-6 lg:max-w-[75vw]">
        <h1 className="font-serif text-[26px] md:text-[30px] font-bold text-black dark:text-[#f2f4f6] mb-6">
          Radio & Interviews
        </h1>
        <RadioPlayer tracks={tracks} />
      </div>
    </main>
  );
}
