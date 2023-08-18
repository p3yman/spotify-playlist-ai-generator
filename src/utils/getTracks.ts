import type { RequestEventAction } from "@builder.io/qwik-city";
import { server$ } from "@builder.io/qwik-city";
import type { Track } from "./types";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";

export const getTracks = server$(async function (
  tracks: Track[],
  requestEvent: RequestEventAction
) {
  const sdk = SpotifyApi.withClientCredentials(
    requestEvent.env.get("SPOTIFY_CLIENT_ID") ?? "",
    requestEvent.env.get("SPOTIFY_CLIENT_SECRET") ?? ""
  );
  const responses = await Promise.all(
    tracks.map(async (track) => {
      return sdk.search(`${track.name} ${track.artist}`, ["track"]);
    })
  );
  return responses.map(({ tracks }) => {
    const track = tracks.items[0];
    return {
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      image: track.album.images[0].url,
      url: track.external_urls.spotify,
      preview: track.preview_url,
      id: track.id,
      duration: msToMinSec(track.duration_ms),
    };
  });
});

function msToMinSec(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

  return `${minutes}:${formattedSeconds}`;
}
