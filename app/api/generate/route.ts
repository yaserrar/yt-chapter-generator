import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
var getSubtitles = require("youtube-captions-scraper").getSubtitles;
var getYouTubeID = require("get-youtube-id");

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
  dur: string;
  start: string;
  text: string;
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // defaults to process.env["OPENAI_API_KEY"]
});

export async function POST(request: NextRequest, response: NextResponse) {
  const data = (await request.json()) as { url: string };

  try {
    const captions: Caption[] | null = await getSubtitles({
      videoID: getYouTubeID(data.url),
      lang: "en",
    });

    const transformedCaptions = captions?.map((caption) => {
      const start = secondsToMinutes(Number(caption.start));
      return `${start}\n${caption.text}`;
    });

    const captionsText = transformedCaptions?.join("\n");

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
            content:
              "You create labeled chapters for youtube videos. The transcript you will be given has a timestamp and text for that timestamp. This repeats for the whole transcript. The output should be each timestamp and chapter title. Each chapter title should be no longer than 50 characters. The chapter titles can be keywords, summarized concepts or titles. Only create a new chapter when the topic changes significantly. At least 1 minute should have elapsed before specifying a new chapter. Respect the timestamps specified in the transcript. The chapter timestamps should not be greater than the largest timestamp in the transcript. The output for each line should look like: 00:00 - Title",
          },
          {
            role: "user",
            content: captionsText,
          },
        ],
        temperature: 0,
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
      { message: "Error has occurred" },
      { status: 500 }
    );
  }
}
