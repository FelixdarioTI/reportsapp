"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full dark:bg-gray-800 dark:hover:bg-gray-700"
        >
           <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
      align="end"
      className="bg-white dark:bg-gray-800 border-none dark:text-white rounded-lg shadow-lg w-36"
    >
      <DropdownMenuItem
        onClick={() => setTheme("light")}
        className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
      >
        <Sun className="w-4 h-4 mr-2" />
        Light
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => setTheme("dark")}
        className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
      >
        <Moon className="w-4 h-4 mr-2" />
        Dark
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
