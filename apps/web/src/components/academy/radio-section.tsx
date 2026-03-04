"use client";

import { RadioPlayer } from "./radio-player";
import type { RadioTrack, RadioPlaylist } from "@/types/academy";

type Props = {
  tracks: RadioTrack[];
  playlists?: RadioPlaylist[];
};

export function RadioSection({ tracks, playlists = [] }: Props) {
  return (
    <div>
      <RadioPlayer tracks={tracks} playlists={playlists} compact={true} />
    </div>
  );
}
