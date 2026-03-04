import { NextResponse } from "next/server";
import { spawn } from "node:child_process";
import path from "node:path";

const ROOT =
  process.cwd().endsWith("apps/web")
    ? path.resolve(process.cwd(), "..", "..")
    : process.cwd();

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST() {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      function send(data: string) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ line: data })}\n\n`));
      }

      const child = spawn("node", ["scripts/crawl-news-feeds.mjs"], {
        cwd: ROOT,
        stdio: ["ignore", "pipe", "pipe"],
        shell: false,
      });

      child.stdout?.on("data", (chunk: Buffer) => {
        const lines = chunk.toString().split("\n").filter(Boolean);
        lines.forEach((line: string) => send(line));
      });
      child.stderr?.on("data", (chunk: Buffer) => {
        const lines = chunk.toString().split("\n").filter(Boolean);
        lines.forEach((line: string) => send(line));
      });
      child.on("close", (code) => {
        send(`[Done with exit code ${code ?? 0}]`);
        controller.close();
      });
      child.on("error", (err) => {
        send(`Error: ${err.message}`);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-store, no-cache",
      Connection: "keep-alive",
    },
  });
}
