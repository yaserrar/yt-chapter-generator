import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
var getSubtitles = require("youtube-captions-scraper").getSubtitles;
var getYouTubeID = require("get-youtube-id");
import { YoutubeTranscript } from "youtube-transcript";

const { find } = require("lodash");
import striptags from "striptags";
import he from "he";

function secondsToMinutes(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = (seconds % 60).toFixed(0);

  const formattedMinutes = String(minutes).padStart(1, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

type Caption = {
  text: string;
  duration: number;
  offset: number;
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // defaults to process.env["OPENAI_API_KEY"]
});

export async function POST(request: NextRequest, response: NextResponse) {
  const data = (await request.json()) as { url: string };

  try {
    const transcript = await YoutubeTranscript.fetchTranscript(data.url);

    const transformedCaptions = transcript?.map((caption) => {
      const start = secondsToMinutes(Number(caption.offset / 1000));
      return `${start}\n${caption.text}`;
    });

    const captionsText = transformedCaptions?.join("\n");
    console.log(captionsText);
    if (captionsText) {
      if (captionsText.length > 15000) {
        return NextResponse.json(
          { message: "Video is too long, and it will cost a lot :)" },
          { status: 400 }
        );
      }
      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Task:
Create YouTube video chapters using timestamped text entries. The input format is:
MM:SS
Text
Requirements:
Generate concise chapter titles (up to 50 characters) and at least 1 minute should have elapsed before specifying a new chapter.
Chapter timestamps must not exceed the largest transcript timestamp.The output for each line should look like: 00:00 - Title
Ensure that chapters match provided timestamps and stay within time boundaries of timestamps provided.`,
          },
          {
            role: "user",
            content: captionsText,
          },
        ],
        temperature: 0.5,
        top_p: 1,
        // frequency_penalty: 1,
      });
      const chapters = chatCompletion.choices[0].message.content;
      return NextResponse.json(chapters, {
        status: 200,
      });
    }
    return NextResponse.json(
      { message: "Could not extract captions" },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { message: "Error has occurred or IP address blocked by Youtube" },
      { status: 500 }
    );
  }
}
