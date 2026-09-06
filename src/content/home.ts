// src/content/home.ts
import fs from "node:fs";
import path from "node:path";
import type { HomeContent } from "@/content/types";

const filePath = path.join(process.cwd(), "content", "home.json");

export const homeContent: HomeContent = JSON.parse(fs.readFileSync(filePath, "utf-8"));
