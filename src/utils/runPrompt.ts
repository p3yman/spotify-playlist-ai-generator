import type { RequestEventAction } from "@builder.io/qwik-city";
import { server$ } from "@builder.io/qwik-city";
import OpenAI from "openai";

export const runPrompt = server$(async function (
  prompt: string,
  requestEvent: RequestEventAction
) {
  const openai = new OpenAI({
    apiKey: requestEvent.env.get("OPENAI_API_KEY"),
  });
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You are a music specialist who can generate greater playlists of 5 songs based on the description text provided by the user. Your response would be only a JSON like this:
          \`\`\`
          {
            "title": "Playlist title",
            "tracks": [
              ["TRACK_NAME", "ARTIST"]
            ]
          }
          \`\`\`
          No other explanations or responses, no extra characters`,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 1,
    max_tokens: 512,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  const playlist = JSON.parse(response.choices[0].message.content ?? "[]");

  if (playlist.tracks.length === 0) {
    return false;
  }

  const tracks = playlist.tracks.map(([name, artist]: [string, string]) => {
    return {
      name,
      artist,
    };
  });

  return { title: playlist.title, tracks };
});
