"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { MoonStar, Sun } from "lucide-react";
import { Button } from "./ui/button";

const DarkModeButton = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      size="icon"
      variant="outline"
      className="h-8 w-8"
      onClick={(e) => (theme === "dark" ? setTheme("light") : setTheme("dark"))}
    >
      {theme === "dark" ? <MoonStar size={16} /> : <Sun size={16} />}
    </Button>
  );
};

export default DarkModeButton;
