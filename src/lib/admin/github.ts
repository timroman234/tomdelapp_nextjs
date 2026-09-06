import { Octokit } from "@octokit/rest";
import { posix } from "node:path";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const OWNER = process.env.GITHUB_OWNER!;
const REPO = process.env.GITHUB_REPO!;
const BRANCH = "main";

// The only repo paths the admin is ever allowed to read or write. This is the real
// security boundary — enforced here in code, independent of whatever the AI's
// system prompt says, so it holds even under a successful prompt injection.
const ALLOWED_PREFIXES = ["content/", "public/uploads/"];

function assertAllowed(path: string) {
  const normalized = posix.normalize(path);
  const ok = !normalized.includes("..") && ALLOWED_PREFIXES.some((p) => normalized.startsWith(p));
  if (!ok) {
    throw new Error(`Path not allowed: ${path}. The admin can only read/write content/ and public/uploads/.`);
  }
}

export type FileContents = { content: string; sha: string };

export async function getFile(path: string): Promise<FileContents | null> {
  assertAllowed(path);
  try {
    const res = await octokit.repos.getContent({ owner: OWNER, repo: REPO, path, ref: BRANCH });
    if (Array.isArray(res.data) || res.data.type !== "file") {
      throw new Error(`${path} is not a file`);
    }
    return {
      content: Buffer.from(res.data.content, "base64").toString("utf-8"),
      sha: res.data.sha,
    };
  } catch (err: unknown) {
    if (typeof err === "object" && err !== null && "status" in err && err.status === 404) {
      return null;
    }
    throw err;
  }
}

export async function writeFile(path: string, content: string, message: string): Promise<void> {
  assertAllowed(path);
  const existing = await getFile(path);
  if (!existing) {
    throw new Error(`Cannot write ${path}: file does not exist. Creating new content files is not supported yet.`);
  }
  const encoded = Buffer.from(content, "utf-8").toString("base64");
  await octokit.repos.createOrUpdateFileContents({
    owner: OWNER,
    repo: REPO,
    path,
    message,
    content: encoded,
    sha: existing.sha,
    branch: BRANCH,
  });
}

const IMAGE_EXTENSIONS = /\.(jpe?g|png|webp|gif)$/i;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
}

function detectImageType(bytes: Buffer): string | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpeg";
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "png";
  }
  if (
    bytes.length >= 12 &&
    bytes.toString("ascii", 0, 4) === "RIFF" &&
    bytes.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "webp";
  }
  if (bytes.length >= 6 && bytes.toString("ascii", 0, 6) === "GIF89a") return "gif";
  if (bytes.length >= 6 && bytes.toString("ascii", 0, 6) === "GIF87a") return "gif";
  return null;
}

export async function uploadImage(filename: string, dataUrl: string): Promise<string> {
  const safeName = sanitizeFilename(filename);
  if (!IMAGE_EXTENSIONS.test(safeName)) {
    throw new Error(`Rejected upload "${filename}": only jpg, jpeg, png, webp, gif are allowed.`);
  }

  const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
  if (!match) throw new Error("Invalid image data URL.");
  const bytes = Buffer.from(match[2], "base64");

  if (bytes.length > MAX_IMAGE_BYTES) {
    throw new Error(`Rejected upload "${filename}": exceeds the 5MB size limit.`);
  }

  const detected = detectImageType(bytes);
  if (!detected) {
    throw new Error(`Rejected upload "${filename}": file content does not match a known image format.`);
  }

  const path = `public/uploads/${safeName}`;
  assertAllowed(path);

  await octokit.repos.createOrUpdateFileContents({
    owner: OWNER,
    repo: REPO,
    path,
    message: `Upload image: ${safeName}`,
    content: bytes.toString("base64"),
    branch: BRANCH,
  });

  return `/uploads/${safeName}`;
}
