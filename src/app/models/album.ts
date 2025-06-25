import { Artist } from "./artist";
import { Track } from "./track";

export interface Album{
  id?: number;
  albumName: string;
  genre: string;

  format: String;
  description: String;
  totalTracks: Number;
  track: Track;
  tracks?: Track[];
  artists?: Artist[];
}
