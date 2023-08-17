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

export const useGetPlaylist = routeAction$(
  async (data, requestEvent) => {
    console.log({ data });
    return {
      success: true,
      playlist: [],
    };
  },
  zod$({
    prompt: z
      .string({
        required_error: "Please enter a prompt.",
      })
      .min(1, { message: "Please enter a prompt." }),
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
          {action.value?.success && <p>Playlist added successfully</p>}
          <button
            type="submit"
            class="px-4 py-2 rounded-full bg-green-600 hover:bg-green-700 transition duration-200 text-white flex items-center"
          >
            Generate
          </button>
        </div>
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
