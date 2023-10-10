"use client";

import { useMutation } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ChangeEvent, useState } from "react";
import axios from "axios";
import { Copy, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "./ui/use-toast";

const GenerateForm = () => {
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const { toast } = useToast();

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setError(false);
  };

  const { isLoading, isError, isSuccess, mutate, data } = useMutation({
    mutationFn: (data: { url: string }) => {
      return axios.post("/api/generate", data);
    },
    onSuccess: async () => {},
    onError: async (error: any) => {
      const message = error?.response.data.message;
      toast({
        title: message,
      });
    },
  });

  const handleSubmit = () => {
    if (!url) {
      setError(true);
    } else {
      mutate({ url: url });
    }
  };

  const chapters = data?.data as string | undefined;
  const chaptersArray = chapters?.split("\n");

  const copyChapters = () => {
    if (chapters) {
      navigator.clipboard.writeText(chapters);
    }
  };

  return (
    <div className="flex h-full items-center flex-wrap">
      <div className="w-full md:w-1/2 items-center p-2">
        <div className="flex flex-col gap-2">
          <h3 className="text-4xl">Generate Your Chapters</h3>
          <h5 className="text-lg">
            Enter your link and we will generate your chapters within a minute.
          </h5>
          <div className=" text-red-500 flex-col gap-2">
            <p>
              This application is alpha and has known issues with the following:
            </p>
            <ul className="list-disc list-inside text-sm">
              <li>Videos longer than 15 minutes may fail to generator</li>
              <li>Non english videos may fail to generate</li>
              <li>
                Videos without auto-generated transcripts will fail to generate
              </li>
              <li>This does not work on YT Shorts</li>
            </ul>
          </div>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5 my-4">
          <Label htmlFor="url">Youtube Url</Label>
          <Input
            value={url}
            type="text"
            id="url"
            placeholder="https://youtu.be/DkjD5Dksa"
            onChange={handleUrlChange}
          />
          {error && (
            <p className="text-red-500 text-xs">Url {"can't"} be empty</p>
          )}
          <p className="text-xs">
            The URL of the youtube video you want to generate chapters on.
          </p>
        </div>

        <Button disabled={isLoading} onClick={handleSubmit}>
          {isLoading && <Loader2 size={18} className="animate-spin mr-2" />}{" "}
          Gnerate chapters
        </Button>
      </div>
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center gap-2 p-2">
        <h2 className="text-xl font-semibold">Chapters</h2>
        <div className="w-full h-full min-h-[300px] border-2 rounded-lg text-sm p-2">
          {!isSuccess || !chaptersArray ? (
            <p className="text-gray-300">
              00:00 - Introduction <br />
              00:25 - Installing OpenAI Library ...
            </p>
          ) : (
            <div className="text-gray-600 relative">
              {chaptersArray.map((chapter, i) => (
                <p key={i}>{chapter}</p>
              ))}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={copyChapters}
                      variant="outline"
                      size="icon"
                      className="absolute top-1 right-1 p-0 w-8 h-8"
                    >
                      <Copy size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateForm;
