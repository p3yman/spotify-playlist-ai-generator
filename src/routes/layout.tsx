import { component$, Slot } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import { Image } from "@unpic/qwik";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export default component$(() => {
  return (
    <div class="w-full min-h-screen bg-primary flex flex-col">
      <header class="flex justify-center py-8">
        <Image
          src="/assets/images/spotify.svg"
          width={150}
          alt="Spotify"
          class="fill-white"
        />
      </header>
      <div class="container rounded-t-xl bg-white grow p-8">
        <Slot />
      </div>
    </div>
  );
});
