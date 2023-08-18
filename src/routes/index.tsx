import { component$, useSignal } from "@builder.io/qwik";
import {
  Form,
  type DocumentHead,
  routeAction$,
  zod$,
  z,
} from "@builder.io/qwik-city";
import { clsx } from "clsx";
import { samples } from "~/utils/samples";

import { Image } from "@unpic/qwik";
import { runPrompt } from "~/utils/runPrompt";
import { getTracks } from "~/utils/getTracks";

export const useGetPlaylist = routeAction$(
  async (data, requestEvent) => {
    // const suggestions = await runPrompt(data.prompt, requestEvent);
    const suggestions = {
      title: "Positive Morning Vibes",
      tracks: [
        { name: "Happy", artist: "Pharrell Williams" },
        { name: "Good Vibrations", artist: "The Beach Boys" },
        { name: "Don't Stop Me Now", artist: "Queen" },
        { name: "Happy Together", artist: "The Turtles" },
        { name: "I Wanna Dance with Somebody", artist: "Whitney Houston" },
        { name: "Walking on Sunshine", artist: "Katrina and The Waves" },
        { name: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars" },
        { name: "Lovely Day", artist: "Bill Withers" },
        { name: "Can't Stop the Feeling!", artist: "Justin Timberlake" },
        { name: "Don't Stop Believin'", artist: "Journey" },
        { name: "I Gotta Feeling", artist: "The Black Eyed Peas" },
        { name: "Three Little Birds", artist: "Bob Marley" },
        { name: "Dancing Queen", artist: "ABBA" },
        { name: "Don't You Worry 'bout a Thing", artist: "Stevie Wonder" },
        { name: "Mr. Blue Sky", artist: "Electric Light Orchestra" },
        { name: "Feeling Good", artist: "Nina Simone" },
        { name: "Best Day of My Life", artist: "American Authors" },
        {
          name: "Ain't No Mountain High Enough",
          artist: "Marvin Gaye & Tammi Terrell",
        },
        { name: "I Feel Good", artist: "James Brown" },
        { name: "Dare You to Move", artist: "Switchfoot" },
      ],
    };
    if (!suggestions) {
      return {
        success: false,
        message: "No suggestions found",
      };
    }

    // Get tracks from spotify
    const tracks = await getTracks(suggestions.tracks, requestEvent);

    if (tracks.length === 0) {
      return {
        success: false,
        message: "No tracks found",
      };
    }

    return {
      success: true,
      playlist: {
        title: suggestions.title,
        tracks,
      },
    };
  },
  zod$({
    prompt: z.string({
      required_error: "Please enter a prompt.",
    }),
    // .min(1, { message: "Please enter a prompt." }),
  })
);

export default component$(() => {
  const prompt = useSignal("");
  const action = useGetPlaylist();

  return (
    <>
      <Form action={action}>
        <input type="hidden" value={prompt.value} name="prompt" />
        <textarea
          placeholder="Describe your playlist here..."
          class="
                p-4
                block
                w-full
                h-40
                rounded-xl
                border-gray-300
                shadow-sm
                focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          dir="auto"
          value={prompt.value}
        />
        <h1 class="mt-8 mb-4">Or start with an inspiration:</h1>
        <div class="flex gap-2 flex-wrap">
          {samples.map((sample) => (
            <button
              type="button"
              key={sample.label}
              class={clsx(
                "px-2 py-1 text-xs font-semibold transition-colors rounded-xl",
                "bg-gray-100 text-gray-700 border-gray-200 hover:bg-primary hover:text-white"
              )}
              onClick$={() => {
                prompt.value = sample.prompt;
              }}
            >
              {sample.label}
            </button>
          ))}
        </div>
        <div class="mt-8 flex flex-col gap-2 items-end">
          {action.value?.failed && <p>{action.value.fieldErrors?.prompt}</p>}
          <button
            type="submit"
            class="px-4 py-2 rounded-full bg-green-600 hover:bg-green-700 transition duration-200 text-white flex items-center"
          >
            Generate
          </button>
        </div>
        {action.value?.success && action.value.playlist && (
          <>
            <h1 class="mt-8 mb-4">Playlist: {action.value.playlist.title}</h1>
            <div class="flex flex-col gap-4">
              {action.value.playlist.tracks.map((track) => (
                <div
                  key={track.id}
                  class="flex gap-4 items-center bg-gray-100 rounded-xl p-4"
                >
                  <Image
                    src={track.image}
                    alt={track.name}
                    width={64}
                    height={64}
                  />
                  <div class="flex flex-col gap-1">
                    <div class="font-semibold">{track.name}</div>
                    <div class="text-sm text-gray-500">{track.artist}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Form>
    </>
  );
});

export const head: DocumentHead = {
  title: "Spotify Playlist AI Generator",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
